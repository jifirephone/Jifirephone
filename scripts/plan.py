"""Build an edit plan from a transcript: which source ranges to keep, and words retimed to the edit.

Usage: .venv/bin/python scripts/plan.py work/<clip>/words.json work/<clip>/plan.json [--end SRC_END]

Rules (CLAUDE.md): cuts happen only in gaps BETWEEN words, never inside a word; each kept
range keeps PAD seconds of air around its words. Graphics/hook are added to plan.json by hand.
"""
import argparse
import json
import re
from pathlib import Path

PAD = 0.12          # air kept before/after words at a cut
MIN_GAP = 0.35      # pauses longer than this get shortened
# How the creator spells words in their own captions (from refs/ref1.mov).
CAPTION_SPELLING = {"زاد": "زائد"}


def clean(text: str) -> str:
    text = re.sub(r"[.,،!؟?]+$", "", text.strip())
    return CAPTION_SPELLING.get(text, text)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("words")
    ap.add_argument("out")
    ap.add_argument("--end", type=float, default=None, help="last source second to keep")
    a = ap.parse_args()
    words = json.loads(Path(a.words).read_text())["words"]

    keep = [[max(0.0, words[0]["start"] - PAD), None]]
    for prev, nxt in zip(words, words[1:]):
        if nxt["start"] - prev["end"] > MIN_GAP:
            keep[-1][1] = prev["end"] + PAD
            keep.append([nxt["start"] - PAD, None])
    keep[-1][1] = a.end if a.end is not None else words[-1]["end"] + PAD

    def remap(t: float) -> float:
        out = 0.0
        for s, e in keep:
            if t < s:
                return out
            if t <= e:
                return out + (t - s)
            out += e - s
        return out

    retimed, phrase = [], 0
    for i, w in enumerate(words):
        if i and re.search(r"[.،!؟?]$", words[i - 1]["text"].strip()):
            phrase += 1
        retimed.append({"text": clean(w["text"]), "start": round(remap(w["start"]), 3),
                        "end": round(remap(w["end"]), 3), "src": w["start"], "phrase": phrase})
    total = sum(e - s for s, e in keep)
    plan = {"keep": [[round(s, 3), round(e, 3)] for s, e in keep], "duration": round(total, 3),
            "words": retimed, "graphics": [], "hook": None}
    Path(a.out).write_text(json.dumps(plan, ensure_ascii=False, indent=1))
    print(f"keep {plan['keep']}  -> {total:.2f}s (cut {words[-1]['end'] - total:.2f}s of pauses)")


if __name__ == "__main__":
    main()
