#!/usr/bin/env bash
# Clean up a phone voice recording for reels (tuned on the owner's voice, 2026-11-07).
# Usage: scripts/enhance_voice.sh in.m4a out.wav
# Measured on the first recording: clarity (2-5 kHz vs 250-500 Hz) -22 -> -11 dB, signal-to-noise 35 -> 42 dB,
# loudness -20.8 -> -16 LUFS, peaks -0.1 -> -1.5 dB. No words lost (checked with Whisper).
set -euo pipefail
ffmpeg -v error -y -i "$1" -ac 1 -ar 48000 -af "\
highpass=f=80:poles=2,\
afftdn=nf=-48:nr=16:tn=1,\
agate=threshold=0.018:ratio=2.5:range=0.2:attack=4:release=180:knee=4,\
equalizer=f=320:t=q:w=1.0:g=-4,equalizer=f=550:t=q:w=1.2:g=-2,\
equalizer=f=3500:t=q:w=0.9:g=5,equalizer=f=6000:t=q:w=1.0:g=2,highshelf=f=10000:g=2.5,\
deesser=i=0.4:m=0.5:f=0.5,\
acompressor=threshold=-22dB:ratio=3:attack=6:release=90:makeup=2,\
alimiter=limit=0.89:attack=3:release=50,\
loudnorm=I=-16:TP=-1.5:LRA=7" "$2"
echo "clean voice -> $2"
