"""Hybrid retrieval over the portfolio knowledge base.

Documents come from knowledge.json (built by build_knowledge.mjs from the
site's real data files). Each document is scored two ways:

- BM25 keyword score (exact names: "Unitrans", "PostgreSQL", ...)
- Gemini embedding similarity (meaning: "is he good at backend?")

The two are blended, and the "profile" document is always included so the
model never loses track of who Brighton is.
"""

import hashlib
import json
import math
import re
from collections import Counter
from pathlib import Path

from extract_portfolio import extract_portfolio_text

BASE_DIR = Path(__file__).resolve().parent
PORTFOLIO_ROOT = BASE_DIR.parent
KNOWLEDGE_FILE = BASE_DIR / "knowledge.json"
EMBED_CACHE_FILE = BASE_DIR / ".embeddings_cache.json"
EMBED_MODEL = "gemini-embedding-001"
EMBED_DIM = 768
ALWAYS_INCLUDE = ("profile",)

STOPWORDS = set(
    "a an the and or of to in on for with at by from is are was were be been do does did "
    "what which who whom how why when where can could would should will me my i you your "
    "he his him she her they them their it its this that these those about tell any has have "
    "brighton brighton's matikiti".split()
)


def _tokens(text: str) -> list[str]:
    return [t for t in re.findall(r"[a-z0-9+#.]+", text.lower()) if t not in STOPWORDS]


def load_documents() -> list[dict]:
    """Extract the current portfolio source directly at startup."""
    text = extract_portfolio_text()
    if not text:
        raise RuntimeError("No portfolio content could be extracted from the frontend source files.")

    documents = [{
        "id": "profile",
        "title": "Brighton Matikiti - profile",
        "url": "/about",
        "text": (
            "Brighton Matikiti is Zimbabwean. He speaks English and French at a conversational level. "
            "He is an AI Engineering student at USTHB in Algiers and is looking for internships in data, AI, "
            "or full-stack development."
        ),
    }]
    for index, block in enumerate(re.split(r"\n\n(?=SOURCE: )", text)):
        lines = block.splitlines()
        if not lines or not lines[0].startswith("SOURCE: "):
            continue

        source = lines[0].removeprefix("SOURCE: ").strip()
        content = "\n".join(lines[1:]).strip()
        if content:
            documents.append({
                "id": f"source-{index}",
                "title": source,
                "url": "/",
                "text": content,
            })

    return documents


class BM25:
    def __init__(self, texts: list[str], k1: float = 1.4, b: float = 0.75):
        self.k1, self.b = k1, b
        self.docs = [Counter(_tokens(t)) for t in texts]
        self.lengths = [sum(d.values()) for d in self.docs]
        self.avg_len = sum(self.lengths) / max(len(self.docs), 1)
        df = Counter(term for d in self.docs for term in d)
        n = len(self.docs)
        self.idf = {term: math.log(1 + (n - f + 0.5) / (f + 0.5)) for term, f in df.items()}

    def scores(self, query: str) -> list[float]:
        terms = _tokens(query)
        out = []
        for doc, length in zip(self.docs, self.lengths):
            s = 0.0
            for term in terms:
                tf = doc.get(term, 0)
                if tf:
                    norm = tf + self.k1 * (1 - self.b + self.b * length / self.avg_len)
                    s += self.idf[term] * tf * (self.k1 + 1) / norm
            out.append(s)
        return out


def _cosine(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    return dot / (na * nb) if na and nb else 0.0


def _normalise(values: list[float]) -> list[float]:
    hi, lo = max(values, default=0.0), min(values, default=0.0)
    if hi - lo < 1e-9:
        return [0.0] * len(values)
    return [(v - lo) / (hi - lo) for v in values]


class Retriever:
    def __init__(self, client=None, documents: list[dict] | None = None):
        self.client = client
        self.docs = documents if documents is not None else load_documents()
        self.bm25 = BM25([f"{d['title']}\n{d['text']}" for d in self.docs])
        self.doc_vectors = self._embed_documents()

    # ---- embeddings (optional: falls back to BM25-only if unavailable) ----

    def _embed(self, texts: list[str], task_type: str) -> list[list[float]]:
        from google.genai import types

        result = self.client.models.embed_content(
            model=EMBED_MODEL,
            contents=texts,
            config=types.EmbedContentConfig(task_type=task_type, output_dimensionality=EMBED_DIM),
        )
        return [e.values for e in result.embeddings]

    def _embed_documents(self) -> list[list[float]] | None:
        if self.client is None:
            return None
        texts = [f"{d['title']}\n{d['text']}" for d in self.docs]
        keys = [hashlib.sha256(f"{EMBED_MODEL}:{EMBED_DIM}:{t}".encode()).hexdigest() for t in texts]

        cache = {}
        if EMBED_CACHE_FILE.exists():
            try:
                cache = json.loads(EMBED_CACHE_FILE.read_text())
            except ValueError:
                cache = {}

        missing = [i for i, k in enumerate(keys) if k not in cache]
        if missing:
            try:
                vectors = self._embed([texts[i] for i in missing], "RETRIEVAL_DOCUMENT")
            except Exception as exc:  # network / quota: keyword search still works
                print(f"[rag] Embeddings unavailable, using keyword search only: {exc}")
                return None
            for i, vec in zip(missing, vectors):
                cache[keys[i]] = vec
            EMBED_CACHE_FILE.write_text(json.dumps({k: cache[k] for k in keys}))

        return [cache[k] for k in keys]

    # ---- retrieval ----

    def _scores(self, query: str, query_vector: list[float] | None) -> list[float]:
        keyword = _normalise(self.bm25.scores(query))
        if query_vector is None:
            return keyword
        semantic = _normalise([_cosine(query_vector, v) for v in self.doc_vectors])
        return [0.65 * s + 0.35 * k for s, k in zip(semantic, keyword)]

    def search(self, query: str, context_query: str | None = None, top_k: int = 5, min_score: float = 0.25) -> list[dict]:
        """Rank documents for `query`. `context_query` (the query plus recent
        conversation) helps follow-ups; it is weighted a bit lower so a new
        topic ("how can I hire him?") still wins over the previous one."""
        queries = [(query, 1.0)] + ([(context_query, 0.85)] if context_query else [])

        vectors: list[list[float] | None] = [None] * len(queries)
        if self.doc_vectors is not None:
            try:
                vectors = self._embed([q for q, _ in queries], "RETRIEVAL_QUERY")
            except Exception as exc:
                print(f"[rag] Query embedding failed, using keyword search only: {exc}")

        combined = [0.0] * len(self.docs)
        for (q, weight), vec in zip(queries, vectors):
            for i, score in enumerate(self._scores(q, vec)):
                combined[i] = max(combined[i], weight * score)

        ranked = sorted(range(len(self.docs)), key=lambda i: combined[i], reverse=True)
        picked = [i for i in ranked[:top_k] if combined[i] >= min_score]
        for doc_id in ALWAYS_INCLUDE:
            idx = next((i for i, d in enumerate(self.docs) if d["id"] == doc_id), None)
            if idx is not None and idx not in picked:
                picked.append(idx)
        return [self.docs[i] for i in picked]

    @staticmethod
    def format_context(docs: list[dict]) -> str:
        return "\n\n".join(f"[{d['title']}] (page: {d['url']})\n{d['text']}" for d in docs)
