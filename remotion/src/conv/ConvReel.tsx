// Ji Fire repair reel (2026-11-08): iPhone 13 Pro Max converted to the 17 Pro Max look (housing swap).
// Owner's own top-down workshop footage (inbox/shoot-2026-11-08, clips 01-34), cut to the ElevenLabs voiceover.
// Segments are pre-cut, re-timed and cropped 9:16 by scripts/make_segments.py (segments.json in scripts_reels/repair-shoot-2026-11-08).
// Rules applied: soft varied transitions (never the same twice in a row), varied text animations, logo bug, black end card.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EndCard, LogoBug} from '../components/Brand';
import {color, font} from '../brand';
import segs from './segments.json'; // copy of scripts_reels/repair-shoot-2026-11-08/segments.json

const FPS = 30;
const gold = color.gold;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const fr = (s: number) => Math.round(s * FPS);

const END_FROM = fr(31.9);
export const CONV_FRAMES = fr(35.5);
const TAIL = 15; // frames of extra footage after each segment (make_segments.py --tail 0.5)

type Trans = 'flash' | 'zoom' | 'blur' | 'push' | 'slideUp' | 'iris' | 'dolly' | 'black';
const TRANS: Record<string, Trans> = {B: 'flash', C1: 'zoom', C2: 'blur', D1: 'push', D2: 'slideUp', D3: 'push', E: 'dolly', F: 'black',
  G: 'flash', H: 'blur', I: 'iris', J: 'zoom', K: 'slideUp', L: 'dolly'};
const TDUR: Record<Trans, number> = {flash: 14, zoom: 12, blur: 14, push: 10, slideUp: 12, iris: 14, dolly: 13, black: 12};

type Seg = {id: string; t: number[]; from: number; to: number};
const SEGS: Seg[] = (segs as {segments: {id: string; t: number[]}[]}).segments.map((s) => ({id: s.id, t: s.t, from: fr(s.t[0]), to: fr(s.t[1])}));
export const CONV_TRANSITIONS = SEGS.slice(1).map((s) => ({at: s.from / FPS, type: TRANS[s.id]})).concat([{at: END_FROM / FPS, type: 'black'}]);

const tStyles = (t: Trans, p: number): {out: React.CSSProperties; in: React.CSSProperties} => {
  const q = ease(clamp(p));
  switch (t) {
    case 'flash': return {out: {opacity: 1}, in: {opacity: q}};
    case 'zoom': return {out: {transform: `scale(${1 + q * 0.6})`, opacity: 1 - q}, in: {transform: `scale(${0.88 + 0.12 * q})`, opacity: clamp(q * 1.6)}};
    case 'blur': return {out: {filter: `blur(${q * 18}px)`}, in: {opacity: q, filter: `blur(${(1 - q) * 18}px)`}};
    case 'push': return {out: {transform: `translateX(${q * 1080}px)`}, in: {transform: `translateX(${(q - 1) * 1080}px)`}};
    case 'slideUp': return {out: {transform: `translateY(${-q * 500}px)`, opacity: 1 - q * 0.6}, in: {transform: `translateY(${(1 - q) * 1920}px)`}};
    case 'iris': return {out: {opacity: 1 - q * 0.5}, in: {clipPath: `circle(${q * 120}% at 50% 45%)`}};
    case 'dolly': return {out: {transform: `scale(${1 - q * 0.25})`, opacity: 1 - q}, in: {transform: `scale(${1.25 - 0.25 * q})`, opacity: q}};
    case 'black': return {out: {opacity: clamp(1 - q * 2)}, in: {opacity: clamp(q * 2 - 1)}};
  }
};

// One footage segment: plays its pre-cut clip, with a slow camera push and drift so the frame is never still.
const Clip: React.FC<{s: Seg}> = ({s}) => {
  const f = useCurrentFrame();
  const len = s.to - s.from + TAIL;
  const k = clamp((f - s.from) / len);
  return (
    <Sequence from={s.from} durationInFrames={len} layout="none">
      <AbsoluteFill style={{transform: `scale(${1.02 + 0.05 * k}) translate(${Math.sin(f / 53) * 6}px, ${Math.cos(f / 67) * 5}px)`}}>
        <OffthreadVideo src={staticFile(`conv/${s.id}.mp4`)} muted style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
    </Sequence>
  );
};

// ---------- text ----------
const runs = (text: string) => {
  const out: {latin: boolean; words: string[]}[] = [];
  for (const w of text.split(' ')) {
    const latin = !/[ء-ي]/.test(w);
    const last = out[out.length - 1];
    if (last && latin && last.latin) last.words.push(w);
    else out.push({latin, words: [w]});
  }
  return out;
};

type Anim = 'rise' | 'blur' | 'drop' | 'scale' | 'slide';
const Head: React.FC<{f: number; text: string; gold?: string[]; size?: number; y?: number; out?: number; anim?: Anim; at?: number}> = (
  {f, text, gold: g = [], size = 96, y = 440, out, anim = 'blur', at = 0}) => {
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: y, left: 64, right: 230, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
      direction: 'rtl', columnGap: size * 0.26, fontFamily: font.family, fontWeight: 900, fontSize: size, lineHeight: 1.22}}>
      {runs(text).map((run, i) => {
        const s = spring({frame: f - at - i * 4, fps, config: anim === 'scale' ? {damping: 12, stiffness: 180} : {damping: 18, stiffness: 120}});
        const o = out === undefined ? 1 : clamp((out - f) / 8);
        const v = Math.min(s, o);
        const tr = anim === 'rise' ? `translateY(${(1 - s) * 60}px)` : anim === 'drop' ? `translateY(${(1 - s) * -60}px)`
          : anim === 'scale' ? `scale(${1.4 - 0.4 * s})` : anim === 'slide' ? `translateX(${(1 - s) * 120}px)` : `translateY(${(1 - s) * 24}px)`;
        return (
          <span key={i} dir={run.latin ? 'ltr' : 'rtl'} style={{display: 'inline-block', opacity: v, unicodeBidi: 'isolate',
            filter: anim === 'blur' && v < 0.99 ? `blur(${(1 - v) * 14}px)` : 'none', transform: tr}}>
            {run.words.map((w, j) => (
              <span key={j} style={{color: g.includes(w) ? gold : '#fff', marginInlineStart: j ? size * 0.24 : 0,
                textShadow: g.includes(w) ? `0 0 30px ${gold}77, 0 6px 18px rgba(0,0,0,0.85)` : '0 6px 20px rgba(0,0,0,0.85)'}}>{w}</span>
            ))}
          </span>
        );
      })}
    </div>
  );
};

const Step: React.FC<{f: number; n: number; out?: number}> = ({f, n, out}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 14, stiffness: 160}});
  const o = out === undefined ? 1 : clamp((out - f) / 8);
  return (
    <div style={{position: 'absolute', top: 410, left: 64, right: 230, display: 'flex', justifyContent: 'center', gap: 14, direction: 'rtl',
      opacity: Math.min(s, o), transform: `translateY(${(1 - s) * -20}px)`}}>
      {[1, 2, 3].map((k) => (
        <div key={k} style={{height: 10, width: k === n ? 90 : 34, borderRadius: 6, background: k <= n ? gold : 'rgba(255,255,255,0.35)'}} />
      ))}
    </div>
  );
};

const CHECK = 'M22 52 L42 72 L78 30';
const Badge: React.FC<{f: number; at: number; text: string; y: number; out?: number}> = ({f, at, text, y, out}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 13, stiffness: 170}});
  const o = out === undefined ? 1 : clamp((out - f) / 8);
  const draw = clamp((f - at - 4) / 10);
  return (
    <div style={{position: 'absolute', top: y, left: 64, right: 230, display: 'flex', justifyContent: 'center', opacity: Math.min(clamp(s * 2), o),
      transform: `translateX(${(1 - s) * 160}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl', padding: '16px 34px 16px 40px', borderRadius: 999,
        background: 'rgba(8,7,10,0.78)', border: `2px solid ${gold}`, boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 30px ${gold}33`}}>
        <svg width={58} height={58} viewBox="0 0 100 100">
          <circle cx={50} cy={50} r={46} fill={gold} />
          <path d={CHECK} fill="none" stroke="#000" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={90} strokeDashoffset={90 * (1 - draw)} />
        </svg>
        <span style={{fontFamily: font.family, fontWeight: 900, fontSize: 58, color: '#fff'}}>{text}</span>
      </div>
    </div>
  );
};

const PIN = 'M50 92 C50 92 18 58 18 38 A32 32 0 0 1 82 38 C82 58 50 92 50 92 Z';
const Address: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 4, fps, config: {damping: 16, stiffness: 120}});
  const pin = spring({frame: f - 12, fps, config: {damping: 8, stiffness: 220}});
  const line = (at: number) => clamp((f - at) / 10);
  return (
    <div style={{position: 'absolute', top: 960, left: 64, right: 230, display: 'flex', justifyContent: 'center', opacity: clamp(s * 1.5),
      transform: `translateY(${(1 - s) * 120}px)`}}>
      <div style={{width: 760, padding: '34px 40px 38px', borderRadius: 40, direction: 'rtl', background: 'linear-gradient(160deg, rgba(24,22,27,0.94), rgba(10,9,12,0.94))',
        border: `2px solid ${gold}aa`, boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${gold}22`, display: 'flex', gap: 28, alignItems: 'center'}}>
        <svg width={120} height={120} viewBox="0 0 100 100" style={{transform: `translateY(${(1 - pin) * -60}px)`, flexShrink: 0}}>
          <path d={PIN} fill={gold} /><circle cx={50} cy={38} r={12} fill="#000" />
        </svg>
        <div style={{fontFamily: font.family, color: '#fff'}}>
          <div style={{fontWeight: 900, fontSize: 64, color: gold, opacity: line(10)}}>زورنا</div>
          <div style={{fontWeight: 900, fontSize: 52, opacity: line(20), lineHeight: 1.25}}>النجف • ميلاد</div>
          <div style={{fontWeight: 900, fontSize: 52, opacity: line(30), lineHeight: 1.25}}>شارع الحولي</div>
          <div style={{fontWeight: 700, fontSize: 36, opacity: line(40) * 0.85}}>قرب جامع المنتظر</div>
        </div>
      </div>
    </div>
  );
};

// Gold light bloom used by the 'flash' transition (soft, no hard white flash).
const Bloom: React.FC<{p: number}> = ({p}) => {
  const a = Math.sin(clamp(p) * Math.PI);
  return <AbsoluteFill style={{pointerEvents: 'none', opacity: a * 0.75,
    background: `radial-gradient(circle 900px at 50% 45%, ${gold}cc, ${gold}33 45%, transparent 75%)`, mixBlendMode: 'screen'}} />;
};

// Top shade so headlines read on any footage.
const Shade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 30%, transparent 50%, transparent 72%, rgba(0,0,0,0.35) 100%)'}} />
);

// ---------- text per segment (frames local to the segment start) ----------
const L = (id: string) => SEGS.find((s) => s.id === id)!;
const at = (sec: number, id: string) => fr(sec) - L(id).from; // word time on the video timeline -> local frame of segment id

const Overlay: React.FC<{f: number}> = ({f}) => {
  const span = (a: string, b: string) => [L(a).from, L(b).to] as const;
  const inSpan = ([a, b]: readonly [number, number]) => f >= a && f < b;
  const loc = (id: string) => f - L(id).from;
  const els: React.ReactNode[] = [];
  if (inSpan(span('A', 'A'))) els.push(<Head key="a" f={loc('A')} at={3} text="لا تبيع 13 Pro Max!" gold={['13', 'Pro', 'Max']} anim="scale" size={100} />);
  if (inSpan(span('B', 'B'))) els.push(<Head key="b" f={loc('B')} at={4} text="حولناه لشكل 17 Pro Max" gold={['17', 'Pro', 'Max']} anim="rise" />);
  if (inSpan(span('C1', 'C2'))) {
    els.push(<Step key="s1" f={loc('C1')} n={1} />);
    els.push(<Head key="c" f={loc('C1')} at={4} text="نفتح الجهاز ونفكك القطع" gold={['نفكك']} anim="blur" size={88} />);
  }
  if (inSpan(span('D1', 'D3'))) {
    els.push(<Step key="s2" f={loc('D1')} n={2} />);
    els.push(<Head key="d" f={loc('D1')} at={3} text="ننقلها للشاصي الجديد" gold={['الجديد']} anim="drop" size={88} />);
  }
  if (inSpan(span('E', 'E'))) {
    els.push(<Step key="s3" f={loc('E')} n={3} />);
    els.push(<Head key="e" f={loc('E')} at={4} text="فحص دقيق قبل الشد" gold={['دقيق']} anim="slide" size={92} />);
  }
  if (inSpan(span('F', 'F'))) els.push(<Head key="f" f={loc('F')} at={2} text="خلصت العملية" gold={['خلصت']} anim="scale" />);
  if (inSpan(span('G', 'G'))) {
    els.push(<Head key="g1" f={loc('G')} at={2} text="جاهز" anim="rise" size={84} y={420} />);
    els.push(<Head key="g2" f={loc('G')} at={at(17.2, 'G')} text="بشكل 17 Pro Max" gold={['17', 'Pro', 'Max']} anim="scale" size={112} y={525} />);
  }
  if (inSpan(span('H', 'I'))) {
    const h = loc('H');
    els.push(<Badge key="h1" f={h} at={at(19.4, 'H')} text="بلا مشاكل" y={1060} />);
    els.push(<Badge key="h2" f={h} at={at(20.5, 'H')} text="بلا ضعف بالشبكة" y={1180} />);
    els.push(<Badge key="h3" f={h} at={at(22.45, 'H')} text="الفلاش شغال" y={1300} />);
  }
  if (inSpan(span('J', 'J'))) els.push(<Head key="j" f={loc('J')} at={4} text="تريد جهازك يصير 17؟" gold={['17؟']} anim="drop" size={100} />);
  if (inSpan(span('K', 'K'))) els.push(<Address key="k" f={loc('K')} />);
  if (inSpan(span('L', 'L'))) {
    els.push(<Head key="l1" f={loc('L')} at={0} text="خليك ويا الصح" gold={['الصح']} anim="rise" size={96} y={440} />);
    els.push(<Head key="l2" f={loc('L')} at={at(30.0, 'L')} text="خليك ويا جي فاير" gold={['جي', 'فاير']} anim="rise" size={96} y={565} />);
  }
  return <>{els}</>;
};

export const ConvReel: React.FC = () => {
  const f = useCurrentFrame();
  let idx = SEGS.findIndex((s) => f >= s.from && f < s.to);
  if (idx < 0) idx = SEGS.length - 1;
  const cur = SEGS[idx];
  const tr = idx > 0 ? TRANS[cur.id] : undefined;
  const d = tr ? TDUR[tr] : 0;
  const p = tr ? (f - cur.from) / d : 1;
  const inT = tr && p < 1;
  const toEnd = f >= END_FROM; // fade the last shot into the black end card
  const st = inT ? tStyles(tr!, p) : null;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {inT ? <AbsoluteFill style={st!.out}><Clip s={SEGS[idx - 1]} /></AbsoluteFill> : null}
      <AbsoluteFill style={{...(st ? st.in : {}), opacity: toEnd ? clamp(1 - (f - END_FROM) / 12) : (st?.in.opacity as number | undefined)}}>
        <Clip s={cur} />
      </AbsoluteFill>
      {inT && tr === 'flash' ? <Bloom p={p} /> : null}
      <Shade />
      <Overlay f={f} />
      {f < END_FROM ? <LogoBug /> : null}
      <Sequence from={END_FROM} layout="none">
        <AbsoluteFill style={{opacity: clamp((f - END_FROM) / 12)}}><EndCard /></AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
