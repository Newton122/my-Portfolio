import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PORTFOLIO_ROOT = BASE_DIR.parent

FILE_PATTERNS = [
    "src/lib/projects.ts",
    "src/lib/experience.ts",
    "src/lib/skills.ts",
    "src/lib/blog.ts",
    "src/translations/en.ts",
    "src/app/about/page.tsx",
    "src/app/projects/page.tsx",
    "src/app/experience/page.tsx",
    "src/app/education/page.tsx",
    "src/app/skills/page.tsx",
    "src/app/contact/page.tsx",
    "src/app/page.tsx",
]

IGNORE_MARKERS = (
    "use client",
    "className",
    "initial",
    "transition",
    "whileInView",
    "viewport",
    "group-hover",
    "bg-",
    "text-",
    "border-",
    "px-",
    "py-",
    "hover:",
    "focus:",
    "object-cover",
    "motion",
    "ArrowRight",
    "Github",
    "Linkedin",
    "Mail",
    "MapPin",
    "MessageCircle",
    "Check",
    "PageShell",
    "PageHeader",
)


def clean_text(text: str) -> str:
    text = text.replace("\xa0", " ")
    text = re.sub(r"\r\n?", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n +", "\n", text)
    return text.strip()


def extract_strings_from_file(file_path: Path) -> list[str]:
    text = file_path.read_text(encoding="utf-8")
    matches = re.findall(r"['\"]([^'\"\\]*(?:\\.[^'\"\\]*)*)['\"]", text)
    cleaned = []

    for value in matches:
        value = value.replace('\\n', ' ')
        value = value.replace('\\"', '"')
        value = value.replace("\\'", "'")
        value = value.strip()

        if not value:
            continue
        if len(value.split()) < 2:
            continue
        if value.startswith("/") or value.startswith(".") or value.startswith("@"):
            continue
        if any(marker in value.lower() for marker in IGNORE_MARKERS):
            continue
        if any(token in value for token in ("{", "}", "<", ">", "=>", "&&")):
            continue
        if value in {"use client", "export default", "export const"}:
            continue
        cleaned.append(value)

    seen = set()
    unique = []
    for value in cleaned:
        if value not in seen:
            seen.add(value)
            unique.append(value)
    return unique


def extract_portfolio_text() -> str:
    chunks = []

    for relative_path in FILE_PATTERNS:
        path = PORTFOLIO_ROOT / relative_path
        if not path.exists():
            print(f"Skipping missing file: {relative_path}")
            continue

        extracted = extract_strings_from_file(path)
        if not extracted:
            continue

        chunks.append(f"SOURCE: {relative_path}\n")
        chunks.append("\n".join(extracted))

    return clean_text("\n\n".join(chunks))


def main():
    text = extract_portfolio_text()
    print(f"Character count: {len(text)}")
    print("---PREVIEW---")
    print(text)


if __name__ == "__main__":
    main()
