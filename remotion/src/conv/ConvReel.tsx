// Ji Fire repair reel (2026-11-08): iPhone 13 Pro Max converted to the 17 Pro Max look (housing swap).
// Owner's own top-down workshop footage (inbox/shoot-2026-11-08, clips 01-34), cut to the ElevenLabs voiceover.
// Segments are pre-cut, re-timed and cropped 9:16 by scripts/make_segments.py (segments.json in scripts_reels/repair-shoot-2026-11-08).
// Rules applied: soft varied transitions (never the same twice in a row), varied text animations, logo bug, black end card.
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
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
const TRANS: Record<string, Trans> = {B: 'none' as Trans, C1: 'zoom', C2: 'blur', D1: 'push', D2: 'slideUp', D3: 'push', E: 'dolly', F: 'black',
  G: 'flash', H: 'blur', I: 'iris', J: 'zoom', K: 'slideUp', L: 'dolly'};
const TDUR: Record<Trans, number> = {flash: 14, zoom: 12, blur: 14, push: 10, slideUp: 12, iris: 14, dolly: 13, black: 12};

type Seg = {id: string; t: number[]; from: number; to: number; still?: string};
const SEGS: Seg[] = (segs as {segments: {id: string; t: number[]; still?: string}[]}).segments.map((s) => ({id: s.id, t: s.t, from: fr(s.t[0]), to: fr(s.t[1]), still: s.still}));
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

// One footage segment: plays its pre-cut clip (panel layout from make_segments.py --layout panel), with a slow camera
// push and drift so the frame is never still. Segments with `still` use the opening hero frame instead.
const PANEL_Y = 470;
const Clip: React.FC<{s: Seg}> = ({s}) => {
  const f = useCurrentFrame();
  const len = s.to - s.from + TAIL;
  const k = clamp((f - s.from) / len);
  if (s.still) return <Hero />;
  return (
    <Sequence from={s.from} durationInFrames={len} layout="none">
      <AbsoluteFill style={{transform: `scale(${1.0 + 0.035 * k}) translate(${Math.sin(f / 53) * 5}px, ${Math.cos(f / 67) * 4}px)`}}>
        <OffthreadVideo src={staticFile(`conv1/${s.id}.mp4`)} muted style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
      <PanelEdge />
    </Sequence>
  );
};

// Thin gold edges on the footage panel.
const PanelEdge: React.FC = () => (
  <>
    {[PANEL_Y, PANEL_Y + 1350].map((y) => (
      <div key={y} style={{position: 'absolute', left: 0, right: 0, top: y - 1, height: 3,
        background: `linear-gradient(90deg, transparent, ${gold}cc 30%, ${gold} 50%, ${gold}cc 70%, transparent)`, boxShadow: `0 0 18px ${gold}66`}} />
    ))}
  </>
);

// Opening (device only, no hands): clip 31 @ 0.9 s, the blue 13 Pro Max next to the new silver housing.
// Camera: close on the blue 13 (hook line 1), glides to the silver housing, then pulls back to show both (line 2).
const Hero: React.FC = () => {
  const f = useCurrentFrame();
  const b0 = fr(2.3);
  const kf = (t: number, a: number[], v: number[]) => {
    for (let i = 0; i < a.length - 1; i++) if (t <= a[i + 1]) return v[i] + (v[i + 1] - v[i]) * ease(clamp((t - a[i]) / (a[i + 1] - a[i])));
    return v[v.length - 1];
  };
  // source px: silver ~448-688, blue ~688-912, phones y ~160-608 (1280x720 frame)
  const cx = kf(f, [0, b0 - 6, b0 + 16, fr(4.9)], [800, 800, 568, 680]);
  const cy = kf(f, [0, b0 - 6, b0 + 16, fr(4.9)], [380, 384, 384, 384]);
  const w = kf(f, [0, b0 - 6, b0 + 16, fr(4.9)], [330, 300, 300, 560]); // visible source width
  const sc = 1080 / w;
  return (
    <AbsoluteFill>
      <Img src={staticFile('conv/hero_bg.png')} style={{width: 1080, height: 1920}} />
      <div style={{position: 'absolute', left: 0, top: PANEL_Y, width: 1080, height: 1350, overflow: 'hidden'}}>
        <Img src={staticFile('conv/hero.png')} style={{position: 'absolute', width: 1280, height: 720, left: 0, top: 0, transformOrigin: '0 0',
          transform: `translate(${540 - cx * sc}px, ${675 - cy * sc}px) scale(${sc})`}} />
      </div>
      <PanelEdge />
    </AbsoluteFill>
  );
};

// ---------- text ----------
const runs = (text: string) => {
  const out: {latin: boolean; words: string[]; punct?: string}[] = [];
  const add = (w: string, latin: boolean) => {
    const last = out[out.length - 1];
    if (last && latin && last.latin) last.words.push(w);
    else out.push({latin, words: [w]});
  };
  for (const raw of text.split(' ')) {
    // trailing ؟ ، ! after an English word or number belongs to the Arabic sentence, not to the LTR run
    const m = raw.match(/^(.*?)([\u061F\u060C!]+)$/);
    const split = !!(m && m[1] && !/[\u0621-\u064A]/.test(m[1]));
    const w = split ? m![1] : raw;
    add(w, !/[\u0621-\u064A]/.test(w));
    if (split) out[out.length - 1].punct = m![2]; // shown at the run's left edge (end of the RTL sentence)
  }
  return out;
};

type Anim = 'rise' | 'blur' | 'drop' | 'scale' | 'slide';
const Head: React.FC<{f: number; text: string; gold?: string[]; size?: number; y?: number; out?: number; anim?: Anim; at?: number}> = (
  {f, text, gold: g = [], size = 84, y = 250, out, anim = 'blur', at = 0}) => {
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: y, left: 64, right: 290, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
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
            {run.punct ? <span style={{display: 'inline-block', unicodeBidi: 'isolate', color: '#fff', textShadow: '0 6px 20px rgba(0,0,0,0.85)'}}>{run.punct}</span> : null}
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
    <div style={{position: 'absolute', top: 440, left: 64, right: 290, display: 'flex', justifyContent: 'center', gap: 14, direction: 'rtl',
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
  <AbsoluteFill style={{pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 25%)'}} />
);

// ---------- text per segment (frames local to the segment start) ----------
const L = (id: string) => SEGS.find((s) => s.id === id)!;
const at = (sec: number, id: string) => fr(sec) - L(id).from; // word time on the video timeline -> local frame of segment id

const Overlay: React.FC<{f: number}> = ({f}) => {
  const span = (a: string, b: string) => [L(a).from, L(b).to] as const;
  const inSpan = ([a, b]: readonly [number, number]) => f >= a && f < b;
  const loc = (id: string) => f - L(id).from;
  const els: React.ReactNode[] = [];
  if (inSpan(span('A', 'A'))) els.push(<Head key="a" f={loc('A')} at={3} text="لا تبيع 13 Pro Max!" gold={['13', 'Pro', 'Max']} anim="scale" size={84} />);
  if (inSpan(span('B', 'B'))) els.push(<Head key="b" f={loc('B')} at={4} text="حولناه لشكل 17 Pro Max" gold={['17', 'Pro', 'Max']} anim="rise" />);
  if (inSpan(span('C1', 'C2'))) {
    els.push(<Step key="s1" f={loc('C1')} n={1} />);
    els.push(<Head key="c" f={loc('C1')} at={4} text="نفتح الجهاز ونفكك القطع" gold={['نفكك']} anim="blur" size={84} />);
  }
  if (inSpan(span('D1', 'D3'))) {
    els.push(<Step key="s2" f={loc('D1')} n={2} />);
    els.push(<Head key="d" f={loc('D1')} at={3} text="ننقلها للشاصي الجديد" gold={['الجديد']} anim="drop" size={84} />);
  }
  if (inSpan(span('E', 'E'))) {
    els.push(<Step key="s3" f={loc('E')} n={3} />);
    els.push(<Head key="e" f={loc('E')} at={4} text="فحص دقيق قبل الشد" gold={['دقيق']} anim="slide" size={84} />);
  }
  if (inSpan(span('F', 'F'))) els.push(<Head key="f" f={loc('F')} at={2} text="خلصت العملية" gold={['خلصت']} anim="scale" />);
  if (inSpan(span('G', 'G'))) {
    els.push(<Head key="g" f={loc('G')} at={2} text="جاهز بشكل 17 Pro Max" gold={['17', 'Pro', 'Max']} anim="scale" size={90} />);
  }
  if (inSpan(span('H', 'I'))) {
    const h = loc('H');
    els.push(<Badge key="h1" f={h} at={at(19.4, 'H')} text="بلا مشاكل" y={1060} />);
    els.push(<Badge key="h2" f={h} at={at(20.5, 'H')} text="بلا ضعف بالشبكة" y={1180} />);
    els.push(<Badge key="h3" f={h} at={at(22.45, 'H')} text="الفلاش شغال" y={1300} />);
  }
  if (inSpan(span('J', 'J'))) els.push(<Head key="j" f={loc('J')} at={4} text="تريد جهازك يصير 17؟" gold={['17']} anim="drop" size={84} />);
  if (inSpan(span('K', 'K'))) els.push(<Address key="k" f={loc('K')} />);
  if (inSpan(span('L', 'L'))) {
    els.push(<Head key="l1" f={loc('L')} at={0} text="خليك ويا الصح" gold={['الصح']} anim="rise" size={80} y={250} />);
    els.push(<Head key="l2" f={loc('L')} at={at(30.0, 'L')} text="خليك ويا جي فاير" gold={['جي', 'فاير']} anim="rise" size={80} y={345} />);
  }
  return <>{els}</>;
};

export const ConvReel: React.FC = () => {
  const f = useCurrentFrame();
  let idx = SEGS.findIndex((s) => f >= s.from && f < s.to);
  if (idx < 0) idx = SEGS.length - 1;
  const cur = SEGS[idx];
  const tr = idx > 0 && TRANS[cur.id] !== ('none' as Trans) ? TRANS[cur.id] : undefined;
  const d = tr ? (TDUR[tr] ?? 12) : 0;
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
