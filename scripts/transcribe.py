"""Transcribe a clip with word-level timestamps (faster-whisper large-v3, Arabic).

Usage: .venv/bin/python scripts/transcribe.py inbox/clip.mp4 [work/clip/words.json]
Writes a JSON list of {"text", "start", "end", "prob"} words, plus segments.
"""
import json
import subprocess
import sys
from pathlib import Path

from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parent.parent

# Bias the decoder toward Iraqi dialect. Spell numbers as WORDS here: a prompt with digits
# makes Whisper write "10,000" instead of what was said ("بعشرة الاف"). Tested on refs/ref1.mov.
PROMPT = (
    "هلا بيكم بجي فاير للموبايل. اربع خطوط بعشرة الاف، وتلتالاف، ومليون وثمانين، ومية وستين الف. "
    "شكو ماكو، هواية، اكو، ضمان، اقساط. iPhone، Samsung Galaxy، Pro Max، Ultra."
)

# Fixed mis-hearings, applied to every word/segment (add new ones when the user corrects a transcript).
FIXES = {
    "جاي فايل": "جي فاير", "جي فايل": "جي فاير", "جاي فاير": "جي فاير",
    "جاي": "جي", "فايل": "فاير", "جيفايل": "جي فاير", "جيفاير": "جي فاير",
}


# Phrases Whisper invents over music/silence. Dropped unless the user confirms they said them.
HALLUCINATIONS = ("اشتركوا في القناة", "شكرا للمشاهدة", "ترجمة", "نانسي قنقر", "لا تنسوا الاشتراك")


def is_hallucination(seg) -> bool:
    text = seg.text.strip()
    return seg.no_speech_prob > 0.6 or any(h in text for h in HALLUCINATIONS)


def fix(text: str) -> str:
    for a, b in sorted(FIXES.items(), key=lambda kv: -len(kv[0])):
        if " " in a:
            text = text.replace(a, b)
    return text


def fix_word(w: str) -> str:
    core = w.strip(".,،؟!?")
    return w.replace(core, FIXES[core]) if core in FIXES else w


def extract_audio(src: Path, wav: Path) -> None:
    wav.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vn", "-ac", "1", "-ar", "16000", str(wav)],
        check=True,
    )


def main() -> None:
    src = Path(sys.argv[1])
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "work" / src.stem / "words.json"
    wav = out.parent / "audio16k.wav"
    extract_audio(src, wav)

    model = WhisperModel("large-v3", device="cpu", compute_type="int8",
                         download_root=str(ROOT / "models" / "whisper"))
    segments, info = model.transcribe(
        str(wav), language="ar", word_timestamps=True, initial_prompt=PROMPT,
        vad_filter=False,  # keep every word; silence is cut later from word gaps
        beam_size=5, condition_on_previous_text=False,
    )
    words, segs, dropped = [], [], []
    for s in segments:
        if is_hallucination(s):
            dropped.append(f"{s.start:.2f}-{s.end:.2f} {s.text.strip()}")
            continue
        segs.append({"start": round(s.start, 3), "end": round(s.end, 3), "text": fix(s.text.strip())})
        for w in s.words or []:
            words.append({"text": fix_word(w.word.strip()), "start": round(w.start, 3),
                          "end": round(w.end, 3), "prob": round(w.probability, 3)})
    out.write_text(json.dumps({"duration": info.duration, "segments": segs, "words": words,
                               "dropped": dropped},
                              ensure_ascii=False, indent=1))
    print(f"{len(words)} words, {info.duration:.1f}s -> {out}")
    for d in dropped:
        print("DROPPED (likely hallucination):", d)
    for s in segs:
        print(f"[{s['start']:6.2f}-{s['end']:6.2f}] {s['text']}")


if __name__ == "__main__":
    main()
