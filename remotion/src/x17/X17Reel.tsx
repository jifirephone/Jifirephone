// Ji Fire iCloud/passcode unlock promo (2026-11-10): «عندك آيفون ناسي رمز الآيكلاود؟».
// Owner's own repair footage (inbox/x17-2026-11-10 → graded to remotion/public/x17): a locked «iPhone غير متوفر»
// device, flashed on a programmer box, through the activation-lock screen, then booting to a working home screen.
// The owner's safety line — reported-lost devices are not serviced — is a prominent caution card, kept honest
// (your own forgotten passcode/iCloud, never stolen devices). VO laid on later; scene cuts re-timed to it.
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EndCard, LogoBug} from '../components/Brand';
import {color, font} from '../brand';

const FPS = 30;
const gold = color.gold;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const fr = (s: number) => Math.round(s * FPS);

// scene starts (video seconds); provisional until the VO lands, then cuts move into the VO's real pauses
const CUTS = [0, 2.55, 5.47, 8.53, 11.74, 13.8, 18.2, 22.3, 26.1];
const END_FROM = fr(26.1);
export const X17_FRAMES = fr(29.4);
const TAIL = 12;

// each scene: a slice of a graded clip + a slow push; src seconds, not scene-local
type Src = {clip: string; in: number; scale?: number; speed?: number};
const SRC: Src[] = [
  {clip: 'p1', in: 2.5},            // S1 hook — locked «iPhone غير متوفر»
  {clip: 'p1', in: 5.0},            // S2 «لا تفرمت!»
  {clip: 'p1', in: 7.6},            // S3 من 7 لل 11 (VO device line muted; screen says 7→11)
  {clip: 'p2', in: 2.0, speed: 1.3},// S4 flashing on the box
  {clip: 'p2', in: 6.6, speed: 1.2},// S5 بسرعة
  {clip: 'p2', in: 8.8},            // S6 disclaimer (dimmed behind the card)
  {clip: 'p3', in: 5.4},            // S7 globe → boots to home (reveal) + address
  {clip: 'p3', in: 7.5},            // S8 working home + CTA
];

const Clip: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const a = fr(CUTS[i]), b = fr(CUTS[i + 1]);
  const len = b - a + TAIL;
  const s = SRC[i];
  const k = clamp((f - a) / len);
  return (
    <Sequence from={a} durationInFrames={len} layout="none">
      <AbsoluteFill style={{transform: `scale(${1.02 + 0.06 * ease(k)}) translate(${Math.sin(f / 52) * 5}px, ${Math.cos(f / 64) * 4}px)`}}>
        <OffthreadVideo src={staticFile(`x17/${s.clip}.mp4`)} muted startFrom={fr(s.in)} playbackRate={s.speed ?? 1} style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
      <Shade />
    </Sequence>
  );
};

// top + bottom shade so headlines read on any frame
const Shade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 26%, transparent 46%, transparent 68%, rgba(0,0,0,0.55) 100%)'}} />
);

// ---------- text ----------
const runs = (text: string) => {
  const out: {latin: boolean; words: string[]; punct?: string}[] = [];
  const add = (w: string, latin: boolean) => {
    const last = out[out.length - 1];
    if (last && latin && last.latin) last.words.push(w);
    else out.push({latin, words: [w]});
  };
  for (const raw of text.split(' ')) {
    const m = raw.match(/^(.*?)([؟،!]+)$/);
    const split = !!(m && m[1] && !/[ء-ي]/.test(m[1]));
    const w = split ? m![1] : raw;
    add(w, !/[ء-ي]/.test(w));
    if (split) out[out.length - 1].punct = m![2];
  }
  return out;
};
type Anim = 'rise' | 'blur' | 'drop' | 'scale' | 'slide';
const Head: React.FC<{f: number; text: string; gold?: string[]; size?: number; y?: number; anim?: Anim; at?: number; red?: boolean; out?: number}> = (
  {f, text, gold: g = [], size = 92, y = 300, anim = 'blur', at = 0, red, out}) => {
  const {fps} = useVideoConfig();
  const col = red ? '#FF4438' : '#fff';
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
            {run.punct ? <span style={{color: col, textShadow: '0 6px 20px rgba(0,0,0,0.85)'}}>{run.punct}</span> : null}
            {run.words.map((w, j) => (
              <span key={j} style={{color: g.includes(w) ? gold : col, marginInlineStart: j ? size * 0.24 : 0,
                textShadow: g.includes(w) ? `0 0 30px ${gold}77, 0 6px 18px rgba(0,0,0,0.85)` : '0 6px 20px rgba(0,0,0,0.9)'}}>{w}</span>
            ))}
          </span>
        );
      })}
    </div>
  );
};

const Pill: React.FC<{f: number; at: number; y: number; children: React.ReactNode; icon?: React.ReactNode}> = ({f, at, y, children, icon}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 13, stiffness: 170}});
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', top: y, left: 64, right: 230, display: 'flex', justifyContent: 'center', opacity: clamp(s * 2), transform: `translateY(${(1 - s) * 40}px)`}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, padding: '16px 36px', borderRadius: 999, direction: 'rtl', whiteSpace: 'nowrap',
        background: 'rgba(8,7,10,0.72)', border: `2px solid ${gold}`, color: '#fff', fontFamily: font.family, fontWeight: 900, fontSize: 56, boxShadow: `0 0 30px ${gold}33`}}>
        {icon}{children}</div>
    </div>
  );
};

const Signal: React.FC = () => (
  <svg width={56} height={56} viewBox="0 0 24 24">{[0, 1, 2, 3].map((i) => <rect key={i} x={2 + i * 5.5} y={14 - i * 4} width={4} height={6 + i * 4} rx={1} fill={gold} />)}</svg>
);

// big safety card for the owner's disclaimer
const Caution: React.FC<{f: number; at: number}> = ({f, at}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 15, stiffness: 120}});
  if (f < at) return null;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 820, padding: '46px 48px 52px', borderRadius: 40, direction: 'rtl', textAlign: 'center',
        background: 'linear-gradient(160deg, rgba(26,20,10,0.96), rgba(12,9,6,0.96))', border: `3px solid ${gold}`,
        boxShadow: `0 30px 90px rgba(0,0,0,0.7), 0 0 60px ${gold}33`, transform: `scale(${0.8 + 0.2 * s}) translateY(${(1 - s) * 60}px)`, opacity: clamp(s * 2)}}>
        <svg width={120} height={120} viewBox="0 0 100 100" style={{display: 'block', margin: '0 auto 18px'}}>
          <path d="M50 10 L92 86 H8 Z" fill="none" stroke={gold} strokeWidth={7} strokeLinejoin="round" />
          <rect x={46} y={38} width={8} height={26} rx={4} fill={gold} /><circle cx={50} cy={74} r={5} fill={gold} />
        </svg>
        <div style={{fontFamily: font.family, fontWeight: 900, fontSize: 60, color: gold, marginBottom: 12}}>ملاحظة مهمة</div>
        <div style={{fontFamily: font.family, fontWeight: 900, fontSize: 64, color: '#fff', lineHeight: 1.4}}>
          الأجهزة المُبلّغ عنها <span style={{color: gold}}>فقدان</span><br />ما نشتغلها
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PIN = 'M50 92 C50 92 18 58 18 38 A32 32 0 0 1 82 38 C82 58 50 92 50 92 Z';
const Address: React.FC<{f: number; at: number}> = ({f, at}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 16, stiffness: 120}});
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', bottom: 150, left: 64, right: 230, display: 'flex', justifyContent: 'center', opacity: clamp(s * 1.5), transform: `translateY(${(1 - s) * 120}px)`}}>
      <div style={{width: 760, padding: '28px 36px 32px', borderRadius: 36, direction: 'rtl', background: 'linear-gradient(160deg, rgba(24,22,27,0.94), rgba(10,9,12,0.94))',
        border: `2px solid ${gold}aa`, boxShadow: `0 24px 70px rgba(0,0,0,0.6)`, display: 'flex', gap: 24, alignItems: 'center'}}>
        <svg width={104} height={104} viewBox="0 0 100 100" style={{flexShrink: 0}}><path d={PIN} fill={gold} /><circle cx={50} cy={38} r={12} fill="#000" /></svg>
        <div style={{fontFamily: font.family, color: '#fff'}}>
          <div style={{fontWeight: 900, fontSize: 58, color: gold}}>جي فاير للموبايل</div>
          <div style={{fontWeight: 900, fontSize: 48, lineHeight: 1.3}}>النجف • ميلاد • شارع الحولي</div>
        </div>
      </div>
    </div>
  );
};

// ---------- overlay per scene (frames local to the scene) ----------
const loc = (f: number, i: number) => f - fr(CUTS[i]);
const span = (i: number): [number, number] => [fr(CUTS[i]), fr(CUTS[i + 1])];
const Overlay: React.FC<{f: number}> = ({f}) => {
  const inS = ([a, b]: [number, number]) => f >= a && f < b;
  const e: React.ReactNode[] = [];
  if (inS(span(0))) e.push(<Head key="s1" f={loc(f, 0)} at={2} text="جهازك قافل آيكلود بعده ما فرمت؟" gold={['آيكلود']} anim="scale" size={72} />);
  if (inS(span(1))) e.push(<Head key="s2" f={loc(f, 1)} at={2} text="لا تفرمته قبل لا تشوف هذا الفيديو!" gold={['تفرمته']} anim="scale" size={68} red />);
  if (inS(span(2))) e.push(<Head key="s3" f={loc(f, 2)} at={3} text="من iPhone 7 لـ 11 Pro Max" gold={['7', '11', 'Pro', 'Max']} anim="rise" size={78} />);
  if (inS(span(3))) {
    e.push(<Head key="s4" f={loc(f, 3)} at={3} text="نفتح القفل" gold={['نفتح']} anim="blur" size={92} y={300} />);
    e.push(<Pill key="s4p" f={loc(f, 3)} at={fr(1.3)} y={430} icon={<Signal />}>والخط يشتغل عادي</Pill>);
  }
  if (inS(span(4))) e.push(<Head key="s5" f={loc(f, 4)} at={2} text="بسرعة وسعر مناسب" gold={['مناسب']} anim="slide" size={90} />);
  if (inS(span(5))) e.push(<Caution key="s6" f={loc(f, 5)} at={2} />);
  if (inS(span(6))) {
    e.push(<Head key="s7" f={loc(f, 6)} at={2} text="صار شغّال!" gold={['شغّال!']} anim="scale" size={100} />);
    e.push(<Address key="s7a" f={loc(f, 6)} at={fr(0.8)} />);
  }
  if (inS(span(7))) e.push(<Head key="s8" f={loc(f, 7)} at={2} text="ناسي رمز iCloud؟ تعال لجي فاير" gold={['iCloud', 'جي', 'فاير']} anim="rise" size={74} />);
  return <>{e}</>;
};

// ---------- transitions ----------
type Trans = 'flash' | 'zoom' | 'blur' | 'whip' | 'dolly' | 'iris' | 'dip';
const TRANS: Trans[] = ['zoom', 'whip', 'blur', 'flash', 'dip', 'iris', 'dolly'];
export const X17_CUTS = CUTS.slice(1, -1).map((t, i) => ({at: t, type: TRANS[i]}));
const D = 12;
const tStyles = (t: Trans, p: number): {out: React.CSSProperties; in: React.CSSProperties} => {
  const q = ease(clamp(p));
  switch (t) {
    case 'flash': return {out: {opacity: 1}, in: {opacity: q}};
    case 'zoom': return {out: {transform: `scale(${1 + q * 0.6})`, opacity: 1 - q}, in: {transform: `scale(${0.88 + 0.12 * q})`, opacity: clamp(q * 1.6)}};
    case 'blur': return {out: {filter: `blur(${q * 18}px)`, opacity: 1 - q}, in: {opacity: q, filter: `blur(${(1 - q) * 18}px)`}};
    case 'whip': return {out: {transform: `translateX(${q * -1080}px)`, filter: `blur(${q * 12}px)`}, in: {transform: `translateX(${(1 - q) * 1080}px)`, filter: `blur(${(1 - q) * 12}px)`}};
    case 'dolly': return {out: {transform: `scale(${1 - q * 0.25})`, opacity: 1 - q}, in: {transform: `scale(${1.25 - 0.25 * q})`, opacity: q}};
    case 'iris': return {out: {opacity: 1 - q * 0.5}, in: {clipPath: `circle(${q * 120}% at 50% 50%)`}};
    case 'dip': return {out: {opacity: clamp(1 - q * 2)}, in: {opacity: clamp(q * 2 - 1)}};
  }
};
const Bloom: React.FC<{p: number}> = ({p}) => {
  const a = Math.sin(clamp(p) * Math.PI);
  return <AbsoluteFill style={{pointerEvents: 'none', opacity: a * 0.6, background: `radial-gradient(circle 900px at 50% 45%, ${gold}cc, ${gold}22 45%, transparent 75%)`, mixBlendMode: 'screen'}} />;
};

export const X17Reel: React.FC = () => {
  const f = useCurrentFrame();
  let idx = CUTS.findIndex((c, i) => f >= fr(c) && f < fr(CUTS[i + 1] ?? 1e9));
  if (idx < 0 || idx >= SRC.length) idx = SRC.length - 1;
  const from = fr(CUTS[idx]);
  const tr = idx > 0 ? TRANS[idx - 1] : undefined;
  const inT = tr && f < from + D;
  const st = inT ? tStyles(tr!, (f - from) / D) : null;
  const toEnd = f >= END_FROM;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {inT ? <AbsoluteFill style={st!.out}><Clip i={idx - 1} /></AbsoluteFill> : null}
      <AbsoluteFill style={{...(st ? st.in : {}), opacity: toEnd ? clamp(1 - (f - END_FROM) / 12) : (st?.in.opacity as number | undefined)}}>
        <Clip i={idx} />
      </AbsoluteFill>
      {inT && tr === 'flash' ? <Bloom p={(f - from) / D} /> : null}
      <Overlay f={f} />
      {f < END_FROM ? <LogoBug /> : null}
      <Sequence from={END_FROM} layout="none"><AbsoluteFill style={{opacity: clamp((f - END_FROM) / 12)}}><EndCard /></AbsoluteFill></Sequence>
    </AbsoluteFill>
  );
};
