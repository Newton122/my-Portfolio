import os
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

from rag import ALWAYS_INCLUDE, Retriever

load_dotenv()

MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
MAX_HISTORY = 12  # messages (6 exchanges) sent back to the model

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY is missing. Add it to the .env file in the portfolio-chatbot folder.")

client = genai.Client(api_key=api_key)
retriever = Retriever(client)

app = FastAPI()

SECTIONS = sorted({d["title"] for d in retriever.docs})

SYSTEM_PROMPT = f"""You are the assistant on Brighton Matikiti's portfolio website. You talk to
visitors - often recruiters or other developers - about Brighton: his projects, skills,
education, experience, certificates, blog posts and how to contact him.

How to answer:
- Use ONLY the facts in the PORTFOLIO CONTEXT of the latest message and earlier in this
  conversation. Never invent projects, employers, dates, numbers or skills.
- If something isn't covered, say you don't have that information and suggest contacting
  Brighton (email on the Contact page).
- Keep "skills" (the Skills page list) separate from technologies he used in a project.
- Refer to Brighton in the third person ("he"). Keep answers short: 1-4 sentences, or a
  short bullet list when listing things. Plain, friendly, professional.
- Use the conversation history to resolve follow-ups ("that project", "which stack did he
  use?", "and the second one?").
- If a question is ambiguous or too broad (e.g. "tell me about the project" when there are
  several), ask ONE short clarifying question that names the options instead of guessing.
- When it helps, point to the page where they can see more (e.g. /projects, /contact).
- If the visitor is hiring or asks about availability, mention he is looking for
  internships in data, AI or full-stack development and how to reach him.
- Politely decline questions unrelated to Brighton or his work.

Topics you have information about: {", ".join(SECTIONS)}."""


class HistoryMessage(BaseModel):
    role: Literal["user", "ai", "assistant", "model"]
    content: str = Field(max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    history: list[HistoryMessage] = Field(default_factory=list)


def build_context_query(message: str, history: list[HistoryMessage]) -> str | None:
    """Follow-ups like "what stack did it use?" have no keywords of their own,
    so search with the recent conversation, not just the latest message."""
    if not history:
        return None
    recent_user = [m.content for m in history if m.role == "user"][-2:]
    last_reply = next((m.content for m in reversed(history) if m.role != "user"), "")
    return "\n".join([*recent_user, last_reply[:300], message])


def to_contents(history: list[HistoryMessage], message: str, context: str) -> list[types.Content]:
    contents = [
        types.Content(
            role="user" if m.role == "user" else "model",
            parts=[types.Part(text=m.content)],
        )
        for m in history[-MAX_HISTORY:]
        if m.content.strip()
    ]
    # Gemini expects the conversation to start with a user turn.
    while contents and contents[0].role != "user":
        contents.pop(0)
    contents.append(
        types.Content(
            role="user",
            parts=[types.Part(text=f"PORTFOLIO CONTEXT:\n{context}\n\nVISITOR QUESTION:\n{message}")],
        )
    )
    return contents


@app.get("/")
def home():
    return {"message": "Welcome to the Portfolio Chatbot API!", "documents": len(retriever.docs)}


@app.post("/chat")
def chat(request: ChatRequest):
    message = request.message.strip()
    docs = retriever.search(message, build_context_query(message, request.history))
    context = retriever.format_context(docs)

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=to_contents(request.history, message, context),
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.4,
                max_output_tokens=600,
                thinking_config=types.ThinkingConfig(thinking_level="low"),
                automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
            ),
        )
    except Exception as exc:
        print(f"[chat] Gemini request failed: {exc}")
        raise HTTPException(status_code=502, detail="The assistant is unavailable right now. Please try again.") from exc

    reply = (response.text or "").strip() or "Sorry, I couldn't come up with an answer. Could you rephrase?"
    return {
        "reply": reply,
        "sources": [{"title": d["title"], "url": d["url"]} for d in docs if d["id"] not in ALWAYS_INCLUDE],
    }
