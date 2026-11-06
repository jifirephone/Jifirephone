#!/usr/bin/env python3
"""
dialect.py - does this script sound like natural Iraqi Arabic, or like written
فصحى? Counts Iraqi speech markers against MSA markers. Added for Ji Fire.

Usage
  python3 dialect.py script.txt
  python3 dialect.py --text "شلونكم؟ اكو عرض هواية خوش"
"""
import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import arabic_ig as ar  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input", nargs="?", default="-")
    ap.add_argument("--text")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    raw = a.text if a.text else (sys.stdin.read() if a.input == "-" else open(a.input, encoding="utf-8").read())
    r = ar.dialect_report(raw)
    if a.json:
        print(json.dumps(r, ensure_ascii=False, indent=2))
        return
    print(f"\nDIALECT  ·  {r['words']} words  ·  Iraqi {r['score']}%  ·  density {r['density']}%  ·  {r['verdict']}")
    print("  Iraqi markers:", "، ".join(dict.fromkeys(r["iraqi"])) or "-")
    print("  MSA markers:  ", "، ".join(dict.fromkeys(r["msa"])) or "-")
    print()
    sys.exit(0 if r["score"] >= 80 else 1)


if __name__ == "__main__":
    main()
