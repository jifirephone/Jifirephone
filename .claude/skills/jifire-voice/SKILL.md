---
name: jifire-voice
description: >-
  Write anything for جي فاير للموبايل (Ji Fire for Mobile, Najaf phone shop) in the owner's own
  Iraqi-dialect voice so it never reads as AI-written or as a corporate template: reel scripts,
  hooks, captions, comment replies, DMs, stories, bios, offers, ad copy, WhatsApp/app messages.
  Use it whenever Arabic text for the shop is drafted, rewritten or reviewed, even if the user
  only says "اكتب كابشن"، "رد على هذا التعليق"، "سويلي سكربت"، "خليها تبين طبيعية"، "مو مثل
  الذكاء الاصطناعي", or asks for any customer-facing words about phones, accessories, instalments
  or iPhone repair. Use it alongside ig-reel / ig-caption / ig-reply / ig-dm / ig-story, which
  decide the structure, while this skill decides how every line sounds.
---

# jifire-voice

The other skills decide *what* to say (hook formula, beat sheet, caption length). This one
decides *how it sounds*. The failure it prevents: text that is correct but reads like an ad
agency or a chatbot («في عالم التقنية… نقدم لكم… لا تفوّت الفرصة»). Customers in Najaf scroll
past that, and the owner can't say it on camera without sounding like someone else.

## Before writing

1. Read `brand/voice.md` (in the Jifirephone project; copy at `~/.claude/instagram/voice.md`).
   It has who the shop is, the audience, the services, the links and the CTA keyword «السعر».
2. Read `references/samples.md`. These are real lines the owner said or approved. Matching them
   matters more than any rule, so read them first.
3. Read `references/voice-guide.md` for the ten rules, before/after examples per format, and
   the word-swap table.

## Writing

- Write the way the owner talks across the counter: short Iraqi lines, fact or number first,
  device names in English, one ask at the end. The guide explains each rule and why.
- If a number is needed and the owner hasn't given it, don't make one up: a wrong price or
  warranty on a shop's page is a real problem for the shop. Use `{{السعر}}`-style placeholders,
  flag them, or phrase the line so it doesn't need the figure.
- Pick the kind: `script` (said aloud, fully Iraqi), `caption`, `reply`, `dm`, `story`.

## Check before showing anything

```bash
python3 .claude/skills/jifire-voice/scripts/voicecheck.py draft.txt --kind script
python3 .claude/skills/jifire-voice/scripts/voicecheck.py draft.txt --fix -o clean.txt   # mechanical fixes
```

It scores five things: AI_PHRASES (the Arabic template lexicon in `scripts/ai_tells_ar.json`),
STRUCTURE (ليس فقط… بل، one-word rhetorical questions, emoji bullets, !!!, hashtag walls, em
dashes), DIALECT (Iraqi vs فصحى; plain lines with no فصحى are fine), RHYTHM (advice only) and
FINGERPRINT (invisible characters, curly quotes, emoji count).

`--fix` only does mechanical swaps. Rewrite anything flagged under STRUCTURE by hand, then
re-run until it says **PASS**. For reel scripts also run the ig-reel tools (`hookscore.py`,
`beats.py`, `dialect.py`) as `CLAUDE.md` requires.

Show the owner the final text plus one line of results, e.g.
`voicecheck: PASS 96 · Iraqi 100% · 0 AI phrases`.

## Learning the voice

The voice file starts thin (one real reel). It gets better only from the owner's own words:
- When the owner approves a line, add it to `references/samples.md` → "Approved".
- When the owner rewrites a line, add `✗ old → ✓ new` under "Rejected / corrected", add any
  new phrase to `ai_tells_ar.json` (or to `allow` if the owner really says it), and log the
  correction in `CLAUDE.md`.
- When the owner sends more of their reels or captions, transcribe them and add them as samples.

## Never

Publish, post, comment, reply or DM anyone. This skill writes drafts. Every customer-facing
message goes out only after the owner approves it.
