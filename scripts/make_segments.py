"""Cut, re-time and crop source clips into vertical 1080x1920 segments for a Remotion edit.

Usage: python3 scripts/make_segments.py SEGMENTS.json SRC_DIR OUT_DIR [--tail 0.5] [--layout full|panel] [--only A,B]

Each segment plays source [in, out] over video time [t0, t1] (speed = (out-in)/(t1-t0)); a tail (same speed, last frame
held if the clip ends) is added so the edit can overlap segments for transitions.
  full : 9:16 crop (405x720 at cropx) filling the frame.
  panel: wider 4:5 view (576x720 centred on the same subject, or cropx_wide) as a 1080x1350 panel at y=PANEL_Y over a
         blurred, darkened copy of the shot (owner: "the camera is too close, pull back a bit").
Light lanczos upscale + sharpening and a gentle natural grade in both.
"""
import argparse, json, subprocess

PANEL_Y = 470
ap = argparse.ArgumentParser()
ap.add_argument('spec'); ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--tail', type=float, default=0.5); ap.add_argument('--layout', default='full'); ap.add_argument('--only', default='')
a = ap.parse_args()
only = set(filter(None, a.only.split(',')))
grade = 'unsharp=5:5:0.7:5:5:0,eq=contrast=1.04:saturation=1.06:brightness=0.01'
for s in json.load(open(a.spec))['segments']:
    if only and s['id'] not in only or 'clip' not in s:
        continue
    t0, t1 = s['t']; d = t1 - t0
    speed = (s['out'] - s['in']) / d
    clip = f"{a.src}/{s['clip']}.mp4"
    dur_src = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', clip]))
    end = min(dur_src, s['out'] + a.tail * speed)
    head = f"trim={s['in']}:{end},setpts=(PTS-STARTPTS)/{speed:.4f},fps=30"
    foot = f"tpad=stop_mode=clone:stop_duration={d + a.tail},trim=0:{d + a.tail:.3f},format=yuv420p"
    if a.layout == 'full':
        fc = f"[0:v]{head},crop=405:720:{s['cropx']}:0,scale=1080:1920:flags=lanczos,{grade},{foot}[v]"
    else:
        cx = s['cropx'] + 202
        xw = s.get('cropx_wide', min(1280 - 576, max(0, cx - 288)))
        xb = min(1280 - 405, max(0, cx - 202))
        fc = (f"[0:v]{head},split[a][b];[a]crop=576:720:{xw}:0,scale=1080:1350:flags=lanczos,{grade}[fg];"
              f"[b]crop=405:720:{xb}:0,scale=216:384,boxblur=8:2,scale=1080:1920,eq=brightness=-0.22:saturation=0.75[bg];"
              f"[bg][fg]overlay=0:{PANEL_Y},{foot}[v]")
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', clip, '-an', '-filter_complex', fc, '-map', '[v]',
                    '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', f"{a.out}/{s['id']}.mp4"], check=True)
    print(f"{s['id']:3s} {s['clip']} {s['in']:.2f}-{s['out']:.2f} x{speed:.2f} -> {d:.2f}s")
