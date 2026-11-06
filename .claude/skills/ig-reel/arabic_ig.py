"""
arabic_ig.py - Arabic (Iraqi dialect) and mixed Arabic/English support for
hookscore.py and beats.py.

Added for Ji Fire for Mobile (جي فاير للموبايل). The upstream scripts only
counted Latin letters, so an Arabic line scored as zero words. This module:

  - tokenises Arabic, English, Arabic-Indic digits (٠-٩) and mixed lines;
  - normalises spelling (أ/إ/آ -> ا, ى -> ي, ة -> ه, diacritics and tatweel removed);
  - strips Arabic clitics (و، ف، ب، ل، ال، بال، هال...) before a dictionary lookup;
  - knows Iraqi number words, money/offer words, tension words, second-person
    address and imperatives;
  - estimates how many words a written number takes to SAY in Arabic
    ("1,450,000" is said "مليون واربعمية وخمسين الف", four words, not one).

Speaking rate is calibrated on the creator's own reel (refs/ref1.mov):
139 wpm including pauses, 147 wpm of articulation. Default: 140 wpm.
Everything here is a heuristic on text. It measures, it does not predict views.
"""

import re

AR_WPM = 140                 # measured on refs/ref1.mov (Iraqi, to camera)
SENTENCE_PAUSE = 0.20        # seconds after . ! ? ؟ when reading a script aloud
COMMA_PAUSE = 0.10           # seconds after , ، ؛

_AR_LETTERS = "ء-غف-يٱ-ۓڤگ"
_AR_MARKS = "ً-ٰٟـ"
_AR_DIGITS = "٠-٩۰-۹"

WORD_RE = re.compile(rf"[A-Za-z0-9{_AR_DIGITS}{_AR_LETTERS}{_AR_MARKS}$%'’\-]+(?:[.,][0-9]+)*")
AR_CHAR_RE = re.compile(rf"[{_AR_LETTERS}]")
LATIN_CHAR_RE = re.compile(r"[A-Za-z]")
DIGIT_TRANS = str.maketrans("٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹٬٫", "01234567890123456789,.")


def to_latin_digits(text):
    return text.translate(DIGIT_TRANS)


def is_arabic(text):
    """True when a line is mainly Arabic (product names in English are fine)."""
    return len(AR_CHAR_RE.findall(text)) >= max(3, len(LATIN_CHAR_RE.findall(text)))


def norm(word):
    w = re.sub(f"[{_AR_MARKS}]", "", word)
    w = re.sub("[أإآٱ]", "ا", w).replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و").replace("ئ", "ي")
    w = w.replace("گ", "ك").replace("ڤ", "ف").replace("چ", "ج").replace("پ", "ب")
    return w.strip(".,،؛؟!?:\"'“”()").lower()


_PREFIXES = ("وبال", "وال", "بال", "فال", "لل", "هال", "ال", "و", "ف", "ب", "ل", "ك")


def stems(word):
    """The word and its plausible stems once clitics come off, longest first."""
    w = norm(word)
    out = [w]
    for p in _PREFIXES:
        if w.startswith(p) and len(w) - len(p) >= 2:
            out.append(w[len(p):])
    # و + ال combos already listed; second pass for e.g. "وب" + word
    for s in list(out[1:]):
        for p in ("ال", "ب", "ل"):
            if s.startswith(p) and len(s) - len(p) >= 2:
                out.append(s[len(p):])
    return out


def _lex(*words):
    return {norm(w) for w in words}


NUMBER_WORDS = _lex(
    "صفر", "اثنين", "ثنين", "اثنان", "ثلاث", "ثلاثة", "تلاث", "تلاثة", "تلث", "أربع", "أربعة",
    "خمس", "خمسة", "ست", "ستة", "سبع", "سبعة", "ثمان", "ثمانية", "ثمن", "ثمنية", "تسع", "تسعة",
    "عشر", "عشرة", "حدعش", "احدعش", "ثنعش", "اثنعش", "تلطعش", "اربعطعش", "خمسطعش", "سطعش",
    "سبعطعش", "ثمنطعش", "تسعطعش", "عشرين", "ثلاثين", "تلاثين", "أربعين", "خمسين", "ستين",
    "سبعين", "ثمانين", "تسعين", "مية", "ميه", "مئة", "مائة", "ميتين", "مئتين", "تلثمية",
    "ثلاثمية", "اربعمية", "خمسمية", "ستمية", "سبعمية", "ثمنمية", "تسعمية", "ألف", "آلاف", "الاف",
    "ألفين", "تلتالاف", "اربعتالاف", "خمستالاف", "ستتالاف", "سبعتالاف", "ثمنتالاف", "تسعتالاف",
    "عشرتالاف", "مليون", "ملايين", "مليار", "نص", "نصف", "ربع", "ضعف", "دبل", "نسخة", "أول",
    "سنة", "سنتين", "شهر", "شهرين", "اشهر", "أسبوع", "يوم", "يومين", "ساعة", "ساعتين", "دقيقة",
    "دقايق", "دقائق", "%",
)
MONEY_WORDS = _lex(
    "سعر", "أسعار", "دينار", "دنانير", "دولار", "ورقة", "قسط", "أقساط", "تقسيط", "مقدمة", "دفعة",
    "خصم", "تخفيض", "تخفيضات", "مجانا", "مجاناً", "مجاني", "ببلاش", "فلوس", "رخيص", "أرخص",
    "ضمان", "كفالة", "دولارات",
)
OFFER_WORDS = MONEY_WORDS | _lex(
    "عرض", "عروض", "أصلي", "اصلية", "جديد", "مستعمل", "نظيف", "توصيل", "فحص", "صيانة", "تصليح",
    "تبديل", "شاشة", "شاشات", "بطارية", "حساس", "بورد", "سوفت", "سوفتوير", "خدمة", "هدية", "حصري",
    "price", "warranty", "free", "discount", "installments", "deal", "sale", "offer", "repair",
)
STAKES = _lex(
    "لا", "ما", "مو", "ماكو", "محد", "ماحد", "بس", "لازم", "خطأ", "غلط", "تخسر", "خسارة", "تنغش",
    "غش", "مغشوش", "تقليد", "مقلد", "كوبي", "تجاري", "عطل", "عاطل", "خربان", "يخرب", "تخرب",
    "انكسر", "مكسور", "مكسورة", "تلف", "تالف", "ضاع", "تدفع", "قبل", "لحد", "إلا", "الحق", "آخر",
    "فرصة", "محدود", "حصري", "أسرع", "ليش", "شلون", "شنو", "سر", "الحقيقة", "انتبه", "دير",
    "تحذير", "أرخص", "أقوى", "أفضل", "احسن", "مستحيل", "تندم", "ندم", "بدل", "بدون", "بلا",
    "حتى", "يغشك", "يضحك", "ضمان", "أصلي", "مضمون", "تخاف", "خوف", "مشكلة", "مشاكل",
)
ADDRESS = _lex(
    "انت", "إنت", "انتي", "انتو", "انتم", "إلك", "الك", "الج", "الكم", "عندك", "عندج", "عدك",
    "تدور", "تريد", "تحتاج", "تشتري", "تعرف", "تخاف", "تدفع", "تبدل", "تصلح", "تحب", "تفكر",
    "تشوف", "تلگه", "تلكه", "تلقى", "يمك", "تتوقع", "تتصور", "تفحص", "تصدك", "تصدق", "تنصدم",
    "تنغش", "تعرفون", "تدورون", "تريدون", "تشترون", "تتوقعون",
)
IMPERATIVES = _lex(
    "شوف", "شوفوا", "تعال", "تعالوا", "اكتب", "اكتبوا", "احجز", "دز", "دزلنا", "اشتري", "جرب",
    "الحق", "الحگ", "خذ", "اطلب", "زورنا", "راسلنا", "اتصل", "لا", "سجل", "حمّل", "نزل", "اسمع",
    "وقف", "انتبه", "دير", "افحص", "افحصها", "افحصه", "اسأل", "قارن", "تأكد",
)
WEAK_OPENERS = [norm(w) for w in (
    "هلا", "هلو", "مرحبا", "اهلا", "أهلاً", "السلام", "شلونكم", "شلونك", "يا جماعة", "جماعة",
    "شباب", "اليوم", "بهذا", "بهالفيديو", "بهاي", "طبعا", "المهم", "أول شي", "احب", "حبيت", "انا راح",
    "خلي احجيلكم", "راح احجيلكم",
)]
STOPWORDS = _lex(
    "و", "في", "من", "على", "الى", "إلى", "عن", "هذا", "هاي", "هذي", "هذه", "اللي", "الي", "هو",
    "هي", "احنا", "انا", "يعني", "كلش", "هم", "مع", "او", "أو", "ثم", "بعد", "كل", "شي", "اكو",
)
# Device and brand names said in Arabic letters ("ايفونك" = your iPhone).
AR_PRODUCTS = _lex(
    "ايفون", "آيفون", "ايباد", "ايربودز", "ابل", "سامسونج", "سامسونك", "كلكسي", "كالكسي", "جالكسي",
    "شاومي", "ريدمي", "هواوي", "هونر", "اوبو", "ريلمي", "فيفو", "بكسل", "انفنكس", "تكنو", "نوت", "برو",
    "ماكس", "الترا", "بلس",
)


MULTIWORD_PRODUCT_RE = re.compile(r"Face\s?ID|True\s?Tone|Apple\s?Watch|Pro\s?Max|سوفت\s?وير", re.IGNORECASE)


def multiword_products(text):
    """Names split across tokens ("Face ID") that per-token checks miss."""
    return MULTIWORD_PRODUCT_RE.findall(text)


def is_product(token):
    if PRODUCT_RE.fullmatch(token):
        return True
    for s in stems(token):
        if s in AR_PRODUCTS or any(s == p + suf for p in AR_PRODUCTS for suf in ("ك", "ج", "كم", "ي", "نا", "ه")):
            return True
    return False


BRAND_RE = re.compile(r"(جي\s*فاير|ji\s*fire)", re.IGNORECASE)
PRODUCT_RE = re.compile(
    r"\b(?:iPhone|iPad|AirPods|Apple|Watch|Samsung|Galaxy|Note|Pro|Max|Plus|Ultra|Mini|Xiaomi|Redmi|"
    r"Poco|Huawei|Honor|Oppo|Realme|Vivo|Pixel|Infinix|Tecno|Face\s?ID|True\s?Tone|Swap|iOS|"
    r"[A-Z]?\d{1,4}(?:GB|TB|G|mAh|W|Hz|MP)|[A-Z]\d{1,3})\b")
DEALBREAKERS = [
    (re.compile(r"^\s*(?:لا\s*تسحب|لا\s*تطلع|وقف\s*لا|ستوب)"),
     "يبدي بـ«لا تسحب». طلب الانتباه يعني بعدك ما كسبته."),
    (re.compile(r"(?:ب|في\s*)(?:هذا|ها|هال)\s*(?:الفيديو|فيديو|المقطع)|راح\s*(?:اشرحلكم|اعلمكم|احجيلكم)"),
     "مقدمة فيديو («بهذا الفيديو راح...»). احذفها وابدي بالفايدة."),
    (re.compile(r"^\s*(?:هلا|هلو|مرحبا|اهلا|أهلا|السلام\s*عليكم|شلونكم)"),
     "تحية بالبداية. محد فتح الريلز حتى يسلمون عليه."),
]


def _spoken_number_words(n):
    """How many words an integer takes to say in Iraqi Arabic (approximate)."""
    if n == 0:
        return 1
    count = 0
    for scale in (1_000_000_000, 1_000_000, 1000):
        q, n = divmod(n, scale)
        if q:
            if q in (1, 2):                          # الف / الفين، مليون / مليونين
                count += 1
            elif scale == 1000 and q <= 10:          # "تلتالاف" is one fused word in Iraqi speech
                count += 1
            else:                                    # "خمسة وعشرين الف"، "تلث ملايين"
                count += _spoken_number_words(q) + 1
    hundreds, rest = divmod(n, 100)
    if hundreds:
        count += 1
    if rest:
        count += 1 if (rest <= 19 or rest % 10 == 0) else 2
    return max(1, count)


def spoken_len(token):
    """Spoken word count of one token in an Arabic line."""
    t = to_latin_digits(token)
    m = re.fullmatch(r"\$?(\d[\d,]*)(?:\.(\d+))?(%|\$|k|K)?", t)
    if not m:
        return 1
    whole = int(m.group(1).replace(",", "") or 0)
    extra = 1 if (t.startswith("$") or m.group(3) in ("%", "$")) else 0  # دولار / بالمية
    if m.group(3) in ("k", "K"):
        whole *= 1000
    if m.group(2):
        extra += 2                                                  # "فاصلة خمسة"
    return _spoken_number_words(whole) + extra


def tokens(text):
    return WORD_RE.findall(to_latin_digits(text))


def in_lex(token, lex):
    return any(s in lex for s in stems(token))


def is_number(token):
    t = to_latin_digits(token)
    return bool(re.match(r"\$?\d", t)) or in_lex(token, NUMBER_WORDS) or "طعش" in norm(token)


def is_address(token):
    s = stems(token)
    if any(x in ADDRESS for x in s):
        return True
    w = s[0]
    # possessive "-ك" on a noun the viewer owns: موبايلك، تلفونك، شاشتك، ايفونك
    return len(w) >= 5 and w.endswith("ك") and not w.endswith(("بك", "سمك", "ملك"))


def has_payload(token):
    return (is_number(token) or in_lex(token, MONEY_WORDS) or in_lex(token, STAKES)
            or is_product(token) or bool(BRAND_RE.search(token)))


# --- Iraqi dialect check ---------------------------------------------------
# Markers of natural Iraqi speech versus written MSA (فصحى). A script that has
# to be said out loud by an Iraqi creator should lean hard on the first list.
IRAQI_MARKERS = _lex(
    "شلون", "شنو", "شكد", "بيش", "اكو", "ماكو", "هواية", "هسه", "هسة", "ليش", "مو", "اريد", "تريد",
    "يريد", "نريد", "دز", "دزلنا", "وياك", "وياكم", "ويه", "ويانا", "يمعود", "اغاتي", "عيوني",
    "حبيبي", "خوش", "زين", "كلش", "شويه", "شوية", "هيج", "هيچ", "جاي", "چا", "لعد", "بلكي",
    "صار", "صارت", "يصير", "تصير", "راح", "خلي", "خلّي", "اشوف", "تشوف", "شوف", "عدنا", "عدك",
    "يمنا", "يمكم", "تلگه", "تلكه", "حيل", "هم", "بعد", "احنا", "انطيك", "ننطيك", "نطيك", "يگلك",
    "يقلك", "اگلك", "اقلك", "دير", "بالك", "شكو", "هاي", "هذني", "منا", "مال", "مالتك", "مالك",
    "هالشي", "هالعرض", "هالموبايل", "تحچي", "نحچي", "جيب", "جيبه", "ابد", "ميخالف", "عاد",
    "وين", "زاد", "تلقون", "تلقونه", "تلقونها", "شكو", "ليش", "اشكد", "هواي", "نطيكم", "ننطيكم",
)
MSA_MARKERS = _lex(
    "سوف", "لماذا", "ماذا", "هذه", "الذي", "التي", "الذين", "ليس", "ليست", "لدينا", "لديك",
    "لديكم", "جدا", "جداً", "يمكنك", "يمكنكم", "نحن", "كيف", "إن", "ان", "لكن", "حيث", "أيضا",
    "أيضاً", "عندما", "هناك", "هنا", "قد", "لقد", "إذا", "سيتم", "يتم", "تستطيع", "نستطيع",
    "بإمكانك", "قم", "قوموا", "احصل", "تفضل", "تفضلوا", "إليكم", "إليك", "الآن",
)


def dialect_report(text):
    toks = tokens(text)
    def base(t):  # word, clitic stems, and stems without a pronoun suffix (شلونكم -> شلون)
        out = set(stems(t))
        for s in list(out):
            for suf in ("كم", "ك", "ج", "ه", "ها", "نا", "هم"):
                if s.endswith(suf) and len(s) - len(suf) >= 3:
                    out.add(s[: -len(suf)])
        return out

    iraqi = [t for t in toks if base(t) & IRAQI_MARKERS or "چ" in t or "گ" in t
             or "طعش" in norm(t) or norm(t).endswith("تالاف")]   # Iraqi fused numbers: خمسطعش، تلتالاف
    msa = [t for t in toks if norm(t) in MSA_MARKERS]
    total = len(iraqi) + len(msa)
    score = 50.0 if total == 0 else 100.0 * len(iraqi) / total
    density = 100.0 * len(iraqi) / max(1, len(toks))
    verdict = ("عراقي طبيعي" if score >= 80 and density >= 8 else
               "عراقي خفيف، زيد كلمات عراقية" if score >= 60 else "فصحى، ما ينحچي هيچ")
    return {"words": len(toks), "iraqi": iraqi, "msa": msa, "score": round(score, 1),
            "density": round(density, 1), "verdict": verdict}
