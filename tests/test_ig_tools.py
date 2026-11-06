"""Tests for the Arabic/Iraqi patch of the ig-reel tools (hookscore.py, beats.py, dialect).

Run:  python3 -m unittest discover -s tests -v      (from the project root)
Upstream copies in tests/upstream_ig_reel/ are the "before" side of every comparison.
"""
import importlib.util
import json
import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NEW = os.path.join(ROOT, ".claude", "skills", "ig-reel")
OLD = os.path.join(ROOT, "tests", "upstream_ig_reel")
FIX = os.path.join(ROOT, "tests", "fixtures")


def read(name):
    with open(os.path.join(FIX, name), encoding="utf-8") as fh:
        return fh.read()


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


sys.path.insert(0, NEW)
ar = load("arabic_ig", os.path.join(NEW, "arabic_ig.py"))
hook_new = load("hook_new", os.path.join(NEW, "hookscore.py"))
hook_old = load("hook_old", os.path.join(OLD, "hookscore.py"))
beats_new = load("beats_new", os.path.join(NEW, "beats.py"))
beats_old = load("beats_old", os.path.join(OLD, "beats.py"))

REF1_REAL_SECONDS = 22.94  # first word start -> last word end in refs/ref1.mov (Whisper)
HOOK = "تدور موبايل بأفضل سعر وأقوى ضمان؟ شوف عروض جي فاير للموبايل!"


class Tokens(unittest.TestCase):
    def test_arabic_words_counted(self):
        self.assertEqual(len(ar.tokens(HOOK)), 11)  # تدور موبايل بأفضل سعر وأقوى ضمان شوف عروض جي فاير للموبايل
        self.assertEqual(len(hook_old.words(HOOK)), 0)       # the bug being fixed

    def test_mixed_and_digits(self):
        self.assertEqual(ar.tokens("iPhone 16 Pro بسعر ٢٥ ألف"), ["iPhone", "16", "Pro", "بسعر", "25", "ألف"])
        self.assertEqual(ar.tokens("1,450,000 دينار"), ["1,450,000", "دينار"])

    def test_numbers_said_out_loud(self):
        cases = {"10,000": 1, "25": 2, "٢٥": 2, "160,000": 3, "1,450,000": 4, "$45": 3, "2025": 3, "3000": 1, "17": 1}
        for tok, n in cases.items():
            self.assertEqual(ar.spoken_len(tok), n, tok)

    def test_number_words_and_clitics(self):
        for w in ("بعشرة", "الاف", "تلتالاف", "وثمانين", "مية", "ألف", "مليون", "٢٥", "خمسطعش"):
            self.assertTrue(ar.is_number(w), w)
        for w in ("ايفونك", "آيفون", "سامسونج", "iPhone", "S25", "256GB"):
            self.assertTrue(ar.is_product(w), w)
        self.assertFalse(ar.is_product("شاشة"))
        for w in ("بأقساط", "وبضمان", "بسعر", "دينار"):
            self.assertTrue(ar.in_lex(w, ar.MONEY_WORDS), w)


class HookScore(unittest.TestCase):
    def test_english_unchanged(self):
        for line in read("hooks_en.txt").splitlines():
            if line.strip():
                o, n = hook_old.run(line), hook_new.run(line)
                self.assertAlmostEqual(o[1], n[1], places=6, msg=line)
                self.assertEqual(o[2], n[2], line)

    def test_arabic_strong_beats_weak(self):
        d = json.loads(read("hooks_ar.json"))
        strong = [hook_new.run(h)[1] for h in d["strong"]]
        weak = [hook_new.run(h)[1] for h in d["weak"]]
        pairs = [(s, w) for s in strong for w in weak]
        auc = sum(1.0 if s > w else 0.5 if s == w else 0 for s, w in pairs) / len(pairs)
        self.assertGreaterEqual(auc, 0.95, (strong, weak))
        self.assertGreater(min(strong), max(weak))

    def test_arabic_dealbreakers(self):
        self.assertTrue(hook_new.run("هلا بيكم شلونكم")[3])
        self.assertTrue(hook_new.run("بهذا الفيديو راح نشوف عروض")[3])

    def test_brand_hook_reads(self):
        res, score, verdict, flags = hook_new.run(HOOK)
        self.assertGreater(score, 50)
        self.assertEqual(res["ADDRESS"][0], 100.0)            # تدور / شوف
        self.assertGreaterEqual(res["OFFER"][0], 80.0)          # سعر + ضمان + البراند


class Beats(unittest.TestCase):
    def script(self):
        return read("ref1_script.txt")

    def test_arabic_timing_matches_real_reel(self):
        est = beats_new.analyse(self.script())["total_seconds"]
        self.assertLess(abs(est - REF1_REAL_SECONDS) / REF1_REAL_SECONDS, 0.15, est)

    def test_upstream_timing_was_broken(self):
        est = beats_old.analyse(self.script())["total_seconds"]
        self.assertLess(est, 2.0)                                # it only "heard" no words

    def test_english_unchanged(self):
        txt = "I lost $18,000 on one contract.\nHere is why.\nStop doing this today."
        self.assertEqual(beats_old.analyse(txt, wpm=165)["total_seconds"],
                         beats_new.analyse(txt, wpm=165)["total_seconds"])

    def test_arabic_concrete_and_loop(self):
        a = beats_new.analyse("بطارية ايفونك تخلص بسرعة؟\nنبدلها بنص ساعة.\nبطارية جديدة وبضمان.")
        self.assertEqual(a["language"], "ar")
        self.assertGreater(a["beats"][0]["concrete"] + a["beats"][1]["concrete"], 0)
        self.assertTrue(any(n.startswith("Loops") for n in a["notes"]), a["notes"])


class Dialect(unittest.TestCase):
    def test_iraqi_vs_msa(self):
        self.assertGreaterEqual(ar.dialect_report("شلونكم؟ اكو عرض هواية خوش، تريد شاشة؟ دزلنا")["score"], 80)
        self.assertLess(ar.dialect_report("نحن نقدم لكم أفضل العروض الآن، يمكنكم زيارة متجرنا")["score"], 50)


class VoiceSkill(unittest.TestCase):
    VC = os.path.join(ROOT, ".claude", "skills", "jifire-voice", "scripts")

    def test_bundled_arabic_module_in_sync(self):
        with open(os.path.join(NEW, "arabic_ig.py"), encoding="utf-8") as a, \
                open(os.path.join(self.VC, "arabic_ig.py"), encoding="utf-8") as b:
            self.assertEqual(a.read(), b.read(), "copy ig-reel/arabic_ig.py into jifire-voice/scripts/")

    def test_voicecheck_ai_vs_owner(self):
        vc = load("voicecheck", os.path.join(self.VC, "voicecheck.py"))
        ai = "في عالم التقنية المتسارع، نقدم لكم أفضل الهواتف الذكية بأسعار تنافسية! لا تفوت الفرصة."
        self.assertEqual(vc.check(ai, "caption")["verdict"], "FAIL")
        self.assertEqual(vc.check(read("ref1_script.txt"), "script")["verdict"], "PASS")
        fixed = vc.autofix(ai)
        self.assertEqual(vc.find_phrases(fixed), [], fixed)


if __name__ == "__main__":
    unittest.main()
