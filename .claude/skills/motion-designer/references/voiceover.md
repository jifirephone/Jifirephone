# Laying an ElevenLabs take
1. Copy the upload, `ffmpeg -ar 48000 -ac 1`, transcribe with `scripts/transcribe.py` (word timestamps). Files often hold **two reads**:
   pick the one whose hook matches the screen and whose numbers/dialect are right (watch «الف» losing its ف, «تبحث» instead of «تدور»,
   «ويه» rendered as a laugh «وإيه»).
2. Cut only inside real silences (`silencedetect=noise=-45dB:d=0.2`); never at Whisper word ends (they are 0.1–0.3 s early).
   To slow a fast montage, insert music-only gaps at the real dips between words (find min RMS).
3. If a spoken word contradicts the screen (price, warranty), cut that word or ask for a re-record; never ship the mismatch.
4. Light AI chain: `highpass=80, eq 250Hz −2dB, eq 5kHz +2dB, acompressor 2.5:1, loudnorm −16`; no gate/denoise/de-esser. Pad to full length.
5. Scene STARTS = word onsets (snap to silence ends); captions from the words JSON with fixed spellings.
6. Mix: voice + music sidechain-ducked + SFX → loudnorm −14 LUFS. Re-transcribe the final audio and confirm every word.
