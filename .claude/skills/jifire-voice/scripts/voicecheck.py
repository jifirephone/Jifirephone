#!/usr/bin/env python3
"""
voicecheck.py - does this text sound like Ji Fire for Mobile talking, or like an
AI / corporate template? Scores Arabic (Iraqi) drafts before the owner sees them.

Checks
  1. AI_PHRASES   Arabic marketing clichés from ai_tells_ar.json (في عالم التقنية،
                  لا تفوّت الفرصة، نقدم لكم...), each with a plain Iraqi swap.
  2. STRUCTURE    shapes models love: "ليس فقط... بل", one-word rhetorical
                  questions, emoji bullets, !!!, hashtag walls, em dashes.
  3. DIALECT      Iraqi markers vs فصحى markers (uses ig-reel/arabic_ig.py).
  4. RHYTHM       sentence lengths that are all the same = written, not said.
  5. FINGERPRINT  invisible characters, curly quotes, emoji density.

Usage
  python3 voicecheck.py draft.txt                 # report
  python3 voicecheck.py draft.txt --kind caption  # script|caption|reply|dm|story (default script)
  python3 voicecheck.py draft.txt --fix -o clean.txt   # auto-fix phrases + typography, then report
  python3 voicecheck.py --text "..." --json
Exit code 0 = PASS, 1 = REVIEW/FAIL.
"""
import argparse
import json
import os
import re
import statistics
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)  # bundled copy of ig-reel/arabic_ig.py (kept identical by tests/test_ig_tools.py)
import arabic_ig as ar  # noqa: E402

LEX = json.load(open(os.path.join(HERE, "ai_tells_ar.json"), encoding="utf-8"))
INVISIBLE_RE = re.compile("[​-‏‪-‮⁠-⁤﻿­  \U000e0000-\U000e007f]")
EMOJI_RE = re.compile("[\U0001F300-\U0001FAFF☀-➿]")
SENT_RE = re.compile(r"[^.!?؟\n]+[.!?؟]*")

# Minimum Iraqi share per kind: a script is said out loud, so it must be fully Iraqi;
# a caption is read, so a little more neutral Arabic is tolerated.
DIALECT_MIN = {"script": 80, "caption": 65, "reply": 75, "dm": 75, "story": 75}


def _n(text):
    """Normalise spelling the same way the lexicon is matched (أ/إ/آ, ة, ى, diacritics)."""
    return " ".join(ar.norm(w) for w in text.split())


def find_phrases(text):
    t = _n(text)
    for keep in LEX["allow"]:
        t = t.replace(_n(keep), " ")
    hits = []
    for phrase in sorted(LEX["phrases"], key=len, reverse=True):
        p = _n(phrase)
        pattern = r"(?:^|\s)(?:و|ف|ب|ل)?" + re.escape(p) + r"(?=$|\s)"
        if re.search(pattern, t):
            hits.append(phrase)
            t = re.sub(pattern, " ", t)
    return hits


def find_structures(text):
    out = []
    for s in LEX["structures"]:
        if re.search(s["regex"], text):
            out.append((s["name"], s["fix"]))
    return out


def rhythm(text):
    lens = [len(ar.tokens(s)) for s in SENT_RE.findall(text) if ar.tokens(s)]
    if len(lens) < 4:
        return 100.0, f"{len(lens)} جمل، قليلة للحكم"
    cv = statistics.pstdev(lens) / max(1e-9, statistics.mean(lens))
    score = max(0.0, min(100.0, cv * 220))   # people mix 3-word and 12-word lines; models write even
    return score, f"تنوّع طول الجمل {cv:.2f} (الطبيعي ≥ 0.35)"


def check(text, kind="script"):
    phrases = find_phrases(text)
    structs = find_structures(text)
    d = ar.dialect_report(text)
    rh, rh_detail = rhythm(text)
    inv = len(INVISIBLE_RE.findall(text))
    curly = len(re.findall("[“”‘’]", text))
    emoji = len(EMOJI_RE.findall(text))
    words = max(1, d["words"])
    emoji_limit = 3 if kind in ("caption", "story", "dm") else 0

    checks = {
        "AI_PHRASES": (max(0.0, 100 - 25 * len(phrases)),
                       "، ".join(phrases) if phrases else "ماكو عبارات AI"),
        "STRUCTURE": (max(0.0, 100 - 25 * len(structs)),
                      "، ".join(n for n, _ in structs) if structs else "ماكو تراكيب مصطنعة"),
        # No فصحى at all is fine: plain offer lines ("اربع خطوط بعشرة الاف") are how the owner talks.
        "DIALECT": (d["score"] if d["msa"] else 100.0,
                    f"عراقي {d['score']}% · كثافة {d['density']}% · فصحى: {'، '.join(dict.fromkeys(d['msa'])) or 'ماكو'}"),
        "RHYTHM": (rh, rh_detail),
        "FINGERPRINT": (max(0.0, 100 - 30 * (inv > 0) - 15 * (curly > 0) - 10 * max(0, emoji - emoji_limit)),
                        f"حروف مخفية {inv} · أقواس منحنية {curly} · إيموجي {emoji} (الحد {emoji_limit})"),
    }
    scores = [v[0] for v in checks.values()]
    # Rhythm is advice, not a gate: an offer list is legitimately even ("اربع خطوط... زاد...").
    gate = [checks[k][0] for k in ("AI_PHRASES", "STRUCTURE", "DIALECT", "FINGERPRINT")]
    overall = statistics.mean(scores) * 0.5 + min(gate) * 0.5
    need = DIALECT_MIN.get(kind, 75)
    verdict = ("PASS" if overall >= 75 and not phrases and checks["DIALECT"][0] >= need else
               "REVIEW" if overall >= 55 else "FAIL")
    return {"kind": kind, "words": words, "overall": round(overall, 1), "verdict": verdict,
            "checks": {k: {"score": round(v[0], 1), "detail": v[1]} for k, v in checks.items()},
            "fixes": {p: LEX["phrases"][p] for p in phrases}, "structure_fixes": dict(structs),
            "dialect_min": need}


def autofix(text):
    """Mechanical fixes only: invisible chars, typography, lexicon swaps. Structure is left to the writer."""
    t = INVISIBLE_RE.sub("", text)
    t = t.replace("“", "«").replace("”", "»").replace("‘", "'").replace("’", "'")
    t = re.sub(r"\s*[—–]\s*", "، ", t)
    t = re.sub(r"!{2,}", "!", t)
    edge = r"(^|[\s،.!؟?:])"
    for phrase in sorted(LEX["phrases"], key=len, reverse=True):
        rep = LEX["phrases"][phrase]
        # keep a clitic (و/ف/ب/ل) on the swap ("واستمتع" -> "" , "بأسعار" -> "بأسعار"), drop it with a deletion
        pat = edge + r"(و|ف|ب|ل)?" + re.escape(phrase) + r"(?=$|[\s،.!؟?:])"
        t = re.sub(pat, lambda m: m.group(1) + ((m.group(2) or "") + rep if rep else ""), t)
    t = re.sub(r"[ \t]{2,}", " ", t)
    t = re.sub(r"\s+([،.؟!])", r"\1", t)
    t = re.sub(r"([،.؟!])\s*[،]", r"\1", t)          # "،،" / ".،" left by deletions
    t = re.sub(r"،\s*([.؟!])", r"\1", t)              # "،." -> "."
    t = re.sub(r"(^|\n)\s*[،,.]\s*", r"\1", t)
    return t.strip() + "\n"


def bar(s, w=20):
    f = round(s / 100 * w)
    return "#" * f + "." * (w - f)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input", nargs="?", default="-")
    ap.add_argument("--text")
    ap.add_argument("--kind", default="script", choices=sorted(DIALECT_MIN))
    ap.add_argument("--fix", action="store_true")
    ap.add_argument("-o", "--out")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    raw = a.text if a.text else (sys.stdin.read() if a.input == "-" else open(a.input, encoding="utf-8").read())
    if a.fix:
        raw = autofix(raw)
        if a.out:
            open(a.out, "w", encoding="utf-8").write(raw)
        elif not a.json:
            print(raw)
    r = check(raw, a.kind)
    if a.json:
        print(json.dumps(r, ensure_ascii=False, indent=2))
    else:
        print(f"\nVOICE CHECK · {a.kind} · {r['words']} words")
        print("=" * 64)
        for k, v in r["checks"].items():
            print(f"  {k:<12} {bar(v['score'])} {v['score']:5.1f}  {v['detail']}")
        print("-" * 64)
        print(f"  {'OVERALL':<12} {bar(r['overall'])} {r['overall']:5.1f}  {r['verdict']}"
              f"  (Iraqi ≥ {r['dialect_min']}% needed)")
        for p, rep in r["fixes"].items():
            print(f"  ✗ «{p}» → {('«' + rep + '»') if rep else 'احذفها'}")
        for n, fx in r["structure_fixes"].items():
            print(f"  ✗ {n}: {fx}")
        print()
    sys.exit(0 if r["verdict"] == "PASS" else 1)


if __name__ == "__main__":
    main()
