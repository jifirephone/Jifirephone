import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {Captions, Word} from './components/Captions';
import {EndCard, LogoBug} from './components/Brand';
import {Hook, HookTitle} from './components/Graphics';
import {color, endCard, font, safe} from './brand';

// B-roll before/after reel (no speech): source clips joined with soft transitions,
// one stylised gold light-sweep at the reveal, timed text instead of transcribed captions.

export type Shot = {from: number; to: number; speed: number; tag?: 'before' | 'after'};
export type RepairProps = {
  video: string; // pre-graded clip under public/
  shots: Shot[];
  xfade: number; // seconds of overlap between shots
  revealShot: number; // index of the shot that enters with the gold sweep
  words: Word[];
  hook: Hook | null;
  musicFadeSec: number;
};

const FPS = 30;
const shotFrames = (s: Shot) => Math.round(((s.to - s.from) / s.speed) * FPS);
const x = (p: RepairProps) => Math.round(p.xfade * FPS);

const layout = (p: RepairProps) => {
  let at = 0;
  return p.shots.map((s, i) => {
    const start = i === 0 ? 0 : at - x(p);
    at = start + shotFrames(s);
    return {start, len: shotFrames(s)};
  });
};
export const footageFrames = (p: RepairProps) => {
  const l = layout(p);
  return l.length ? l[l.length - 1].start + l[l.length - 1].len : 1;
};
export const repairFrames = (p: RepairProps) => footageFrames(p) + Math.round(endCard.durationSec * FPS);

// One shot: fades/zooms in over the overlap, slow push-in while on screen (keeps static shots alive).
const ShotView: React.FC<{p: RepairProps; s: Shot; len: number; first: boolean; reveal: boolean}> = ({p, s, len, first, reveal}) => {
  const f = useCurrentFrame();
  const X = x(p);
  const ease = Easing.bezier(0.33, 0, 0.2, 1);
  const inP = first ? 1 : interpolate(f, [0, X], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const push = interpolate(f, [0, len], [1.0, 1.06]);
  const settle = reveal ? interpolate(inP, [0, 1], [1.18, 1]) : interpolate(inP, [0, 1], [1.07, 1]);
  const blur = (1 - inP) * (reveal ? 18 : 10);
  return (
    <AbsoluteFill style={{opacity: reveal ? Math.min(1, inP * 1.6) : inP}}>
      <AbsoluteFill style={{transform: `scale(${push * settle})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>
        <OffthreadVideo src={staticFile(p.video)} muted playbackRate={s.speed}
          startFrom={Math.round(s.from * FPS)} style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Gold light sweep + soft bloom across the cut into the "after" shot.
const GoldSweep: React.FC<{len: number}> = ({len}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const pos = -40 + t * 180; // % across the frame
  const bloom = interpolate(f, [0, len * 0.5, len], [0, 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 50% at 50% 50%, ${color.gold}aa, rgba(255,240,200,0.0) 70%)`,
        opacity: bloom, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{
        background: `linear-gradient(115deg, transparent ${pos - 22}%, ${color.goldDeep}55 ${pos - 8}%, #fff6d8dd ${pos}%, ${color.gold}66 ${pos + 8}%, transparent ${pos + 22}%)`,
        mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

// قبل / بعد pill, top-left (logo sits top-right).
const Tag: React.FC<{kind: 'before' | 'after'; len: number}> = ({kind, len}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame: f - 4, fps, config: {damping: 14, stiffness: 180}});
  const out = interpolate(f, [len - 8, len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const after = kind === 'after';
  return (
    <div style={{position: 'absolute', top: safe.top + 18, left: safe.left, fontFamily: font.family, direction: 'rtl',
      opacity: Math.min(inP, out), transform: `translateY(${(1 - inP) * -24}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '6px 30px 10px',
        borderRadius: 999, fontSize: 52, fontWeight: font.caption,
        background: after ? color.gold : 'rgba(0,0,0,0.55)', color: after ? color.black : color.white,
        border: after ? 'none' : `3px solid ${color.silver}`, backdropFilter: 'blur(10px)',
        boxShadow: after ? `0 0 36px ${color.gold}88` : '0 8px 24px rgba(0,0,0,0.5)'}}>
        {after ? 'بعد' : 'قبل'}
      </div>
    </div>
  );
};

// Hides the burned-in watermark area (delogo'd in the clip) and keeps the logo/tag legible.
const TopShade: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 14%, rgba(0,0,0,0) 26%)'}} />
);
const Vignette: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 62% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)'}} />
);

const FadeIn: React.FC<{after: number; children: React.ReactNode}> = ({after, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [after, after + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

// Footage → end card: footage dims to black while the end card fades up.
const EndIn: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: interpolate(f, [0, 10], [0, 1], {extrapolateRight: 'clamp'})}}>{children}</AbsoluteFill>;
};

export const RepairReel: React.FC<RepairProps> = (p) => {
  const {fps} = useVideoConfig();
  const L = layout(p);
  const foot = footageFrames(p);
  const total = repairFrames(p);
  const fadeF = Math.round(p.musicFadeSec * fps);
  const tagRuns: {kind: 'before' | 'after'; start: number; end: number}[] = [];
  p.shots.forEach((s, i) => {
    if (!s.tag) return;
    const last = tagRuns[tagRuns.length - 1];
    if (last && last.kind === s.tag) last.end = L[i].start + L[i].len;
    else tagRuns.push({kind: s.tag, start: L[i].start + (i ? x(p) : 0), end: L[i].start + L[i].len});
  });
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile(p.video)}
        volume={(fr) => interpolate(fr, [0, 6, total - fadeF, total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      {p.shots.map((s, i) => (
        <Sequence key={i} from={L[i].start} durationInFrames={L[i].len}>
          <ShotView p={p} s={s} len={L[i].len} first={i === 0} reveal={i === p.revealShot} />
        </Sequence>
      ))}
      {p.revealShot > 0 && p.revealShot < p.shots.length ? (
        <Sequence from={L[p.revealShot].start - 4} durationInFrames={x(p) + 14}>
          <GoldSweep len={x(p) + 14} />
        </Sequence>
      ) : null}
      <Sequence durationInFrames={foot}>
        <TopShade />
        <Vignette />
        <FadeIn after={p.hook ? Math.round(p.hook.end * fps) - 6 : 0}><LogoBug /></FadeIn>
        {tagRuns.map((r, i) => (
          <Sequence key={i} from={r.start} durationInFrames={r.end - r.start}>
            <Tag kind={r.kind} len={r.end - r.start} />
          </Sequence>
        ))}
        <Captions words={p.words} />
        {p.hook ? <HookTitle hook={p.hook} /> : null}
      </Sequence>
      <Sequence from={foot - 10}>
        <EndIn><EndCard /></EndIn>
      </Sequence>
    </AbsoluteFill>
  );
};
