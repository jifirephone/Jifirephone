"""Cut, re-time and crop source clips into vertical 1080x1920 segments for a Remotion edit.

Usage: python3 scripts/make_segments.py SEGMENTS.json SRC_DIR OUT_DIR [--tail 0.5]

Each segment plays source [in, out] over video time [t0, t1] (speed = (out-in)/(t1-t0)), cropped 9:16 at cropx,
upscaled with lanczos + light sharpening and a gentle natural grade. A tail (default 0.5 s, same speed, last frame held
if the clip ends) is added so the edit can overlap segments for transitions.
"""
import json, subprocess, sys

spec, src, out = sys.argv[1], sys.argv[2], sys.argv[3]
tail = float(sys.argv[5]) if len(sys.argv) > 5 and sys.argv[4] == '--tail' else 0.5
for s in json.load(open(spec))['segments']:
    t0, t1 = s['t']; d = t1 - t0
    speed = (s['out'] - s['in']) / d
    clip = f"{src}/{s['clip']}.mp4"
    dur_src = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', clip]))
    end = min(dur_src, s['out'] + tail * speed)
    h = s.get('crop_h', 720); w = round(h * 9 / 16); y = s.get('cropy', 0)
    vf = (f"trim={s['in']}:{end},setpts=(PTS-STARTPTS)/{speed:.4f},fps=30,crop={w}:{h}:{s['cropx']}:{y},"
          f"scale=1080:1920:flags=lanczos,unsharp=5:5:0.7:5:5:0,eq=contrast=1.04:saturation=1.06:brightness=0.01,"
          f"tpad=stop_mode=clone:stop_duration={d + tail},trim=0:{d + tail:.3f},format=yuv420p")
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', clip, '-an', '-vf', vf, '-c:v', 'libx264', '-crf', '14',
                    '-preset', 'fast', f"{out}/{s['id']}.mp4"], check=True)
    print(f"{s['id']:3s} {s['clip']} {s['in']:.2f}-{s['out']:.2f} x{speed:.2f} -> {d:.2f}s")
