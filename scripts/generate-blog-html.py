#!/usr/bin/env python3
"""Convert docx blog text to HTML matching site styling."""

import re
import subprocess
import sys
from pathlib import Path

POSTS = [
    {
        "file": "Bridal Boudoir and Getting-Ready Photoshoots_ Inside Santorini_s First Bridal Lounge.docx",
        "key": "bridalBoudoirLounge",
    },
    {
        "file": "How to Choose Your Santorini Wedding Venue_ Caldera, Beach or Private Estate.docx",
        "key": "santoriniWeddingVenue",
    },
    {
        "file": "How to Plan an Unforgettable Marriage Proposal in Santorini.docx",
        "key": "marriageProposalSantorini",
    },
    {
        "file": "Same-Sex Weddings in Santorini_ A Complete Planning and Beauty Guide.docx",
        "key": "sameSexWeddingsSantorini",
    },
    {
        "file": "The Complete Guide to Eloping in Santorini (2026).docx",
        "key": "elopingSantorini2026",
    },
    {
        "file": "Wedding Makeup That Survives the Santorini Sun, Heat and Caldera Wind.docx",
        "key": "santoriniWeddingMakeup",
    },
]

DOCX_DIR = Path("/Users/mario/Desktop/post-antoniou")
OUT_DIR = Path(__file__).resolve().parent.parent / "src" / "data" / "blog-bodies"


def extract_text(docx_path: Path) -> list[str]:
    result = subprocess.run(
        ["textutil", "-convert", "txt", "-stdout", str(docx_path)],
        capture_output=True,
        text=True,
        check=True,
    )
    lines = [line.strip() for line in result.stdout.splitlines()]
    # drop empty trailing lines
    while lines and not lines[-1]:
        lines.pop()
    return lines


def is_heading(line, prev, nxt):
    if not line or len(line) > 120:
        return False
    if line.endswith("."):
        return False
    if prev and prev.endswith("."):
        return True
    if nxt and nxt and not nxt.endswith("."):
        return False
    return bool(prev and prev.endswith("."))


def to_html(lines: list[str]) -> str:
    if not lines:
        return ""

    title = lines[0]
    body_lines = lines[1:]
    parts: list[str] = []
    first_para = True

    i = 0
    while i < len(body_lines):
        line = body_lines[i]
        if not line:
            i += 1
            continue

        prev = body_lines[i - 1] if i > 0 else title
        nxt = body_lines[i + 1] if i + 1 < len(body_lines) else None

        # heading heuristic: short line after paragraph ending with period
        if (
            len(line) < 100
            and not line.endswith(".")
            and prev.endswith(".")
            and (nxt is None or nxt.endswith(".") or (nxt and len(nxt) > 40))
        ):
            parts.append(
                f'      <h2 class="text-display-sm font-serif italic text-charcoal mt-12 mb-4">{escape_html(line)}</h2>'
            )
            i += 1
            continue

        para_class = "text-lg text-grey leading-relaxed" if first_para else "text-base text-grey leading-relaxed"
        first_para = False
        parts.append(f'      <p class="{para_class}">')
        parts.append(f"        {escape_html(line)}")
        parts.append("      </p>")
        i += 1

    return "\n".join(parts)


def escape_html(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for post in POSTS:
        docx = DOCX_DIR / post["file"]
        lines = extract_text(docx)
        html = to_html(lines)
        out = OUT_DIR / f"{post['key']}.en.html"
        out.write_text(html, encoding="utf-8")
        print(f"Wrote {out} ({len(lines)} lines)")


if __name__ == "__main__":
    main()
