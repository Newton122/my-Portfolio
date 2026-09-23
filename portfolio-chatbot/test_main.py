from unittest.mock import Mock, patch

from fastapi.testclient import TestClient

from main import app, build_context_query, HistoryMessage, MODEL
from rag import Retriever, load_documents

client = TestClient(app)
keyword_retriever = Retriever(client=None, documents=load_documents())


def test_chat_route_sends_history_and_context():
    mock_response = Mock()
    mock_response.text = "It uses Next.js, Django and PostgreSQL."

    history = [
        {"role": "user", "content": "Tell me about Unitrans"},
        {"role": "ai", "content": "Unitrans is a university transport platform."},
    ]
    with patch("main.client.models.generate_content", return_value=mock_response) as mock_generate:
        response = client.post("/chat", json={"message": "What stack did it use?", "history": history})

    assert response.status_code == 200
    assert response.json()["reply"] == "It uses Next.js, Django and PostgreSQL."

    kwargs = mock_generate.call_args.kwargs
    assert kwargs["model"] == MODEL
    contents = kwargs["contents"]
    assert [c.role for c in contents] == ["user", "model", "user"]
    assert "Unitrans" in contents[-1].parts[0].text  # follow-up retrieved the right project


def test_follow_up_query_uses_history():
    history = [HistoryMessage(role="user", content="Tell me about BookVerse")]
    message = "does it have a demo?"
    top = keyword_retriever.search(message, build_context_query(message, history), top_k=1)[0]
    assert top["id"] == "project-bookverse"


def test_keyword_search_finds_skills_and_contact():
    assert keyword_retriever.search("Docker Figma", top_k=1)[0]["id"] == "skills"
    assert keyword_retriever.search("email linkedin", top_k=1)[0]["id"] == "contact"


def test_empty_message_rejected():
    assert client.post("/chat", json={"message": ""}).status_code == 422


def test_new_topic_beats_previous_topic():
    history = [HistoryMessage(role="user", content="Tell me about BookVerse")]
    message = "what is his email?"
    top = keyword_retriever.search(message, build_context_query(message, history), top_k=1)[0]
    assert top["id"] == "contact"
