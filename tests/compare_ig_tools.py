"""Before/after report for the ig-reel Arabic patch. Run: python3 tests/compare_ig_tools.py"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from test_ig_tools import REF1_REAL_SECONDS, ar, beats_new, beats_old, hook_new, hook_old, read  # noqa: E402

d = json.loads(read("hooks_ar.json"))
print("HOOKS (Arabic)                                          before        after")
for label in ("strong", "weak"):
    for h in d[label]:
        o, n = hook_old.run(h), hook_new.run(h)
        print(f"  {label:<6} {h[:44]:<46} {o[1]:5.1f} {o[2]:<6} {n[1]:5.1f} {n[2]:<6}")


def auc(fn):
    s = [fn(h)[1] for h in d["strong"]]
    w = [fn(h)[1] for h in d["weak"]]
    p = [(a, b) for a in s for b in w]
    return sum(1 if a > b else .5 if a == b else 0 for a, b in p) / len(p)


print(f"\n  separation strong vs weak (AUC, 0.5 = coin flip): before {auc(hook_old.run):.2f}   after {auc(hook_new.run):.2f}")
en = [l for l in read("hooks_en.txt").splitlines() if l.strip()]
same = sum(abs(hook_old.run(h)[1] - hook_new.run(h)[1]) < 1e-9 for h in en)
print(f"  English hooks with identical scores: {same}/{len(en)}")
s = read("ref1_script.txt")
bo, bn = beats_old.analyse(s), beats_new.analyse(s)
print(f"\nTIMING  refs/ref1.mov script, real speech {REF1_REAL_SECONDS:.2f}s")
print(f"  before: {bo['total_words']:>3} words  {bo['total_seconds']:6.2f}s  error {100*(bo['total_seconds']-REF1_REAL_SECONDS)/REF1_REAL_SECONDS:+.0f}%")
print(f"  after:  {bn['total_words']:>3} words  {bn['total_seconds']:6.2f}s  error {100*(bn['total_seconds']-REF1_REAL_SECONDS)/REF1_REAL_SECONDS:+.0f}%")
