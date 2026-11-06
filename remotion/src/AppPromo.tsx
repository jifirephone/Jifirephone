import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color, font} from './brand';

// Ji Fire app promo: pure motion graphics, 1080x1920, 30 fps, scenes on a 120 BPM grid
// (1 beat = 15 frames, 1 bar = 60 frames). Copy comes from the owner (scripts_reels/app-promo).

const BEAT = 15;
export const APP_PROMO_FRAMES = 960; // 32 s

type Scene = {from: number; to: number; el: React.FC<{f: number}>};

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const useSpring = (f: number, delay = 0, cfg = {damping: 14, stiffness: 180}) => {
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: cfg});
};

// ---------- building blocks ----------

// Words rise out of a mask one after another (Arabic is animated per word, never per letter,
// because the letters are joined).
// Seven ways for a line to arrive, so consecutive scenes never move their text the same way.
// Arabic is animated per word (or per line for "wipe"), never per letter, because the letters join.
type Anim = 'rise' | 'blur' | 'scale' | 'slideR' | 'slideL' | 'drop' | 'wipe';

const Words: React.FC<{text: string; f: number; delay?: number; size: number; c?: string; gold?: string[];
  stagger?: number; weight?: number; nowrap?: boolean; anim?: Anim}> = ({text, f, delay = 0, size, c = color.white,
  gold = [], stagger = 4, weight = 900, nowrap, anim = 'rise'}) => {
  const wrap: React.CSSProperties = {display: 'flex', flexWrap: nowrap ? 'nowrap' : 'wrap', whiteSpace: 'nowrap',
    justifyContent: 'center', direction: 'rtl', columnGap: size * 0.28, fontFamily: font.family, fontWeight: weight,
    fontSize: size, lineHeight: 1.25};
  const shadow = (w: string) => gold.includes(w) ? `0 0 40px ${color.gold}66` : '0 8px 24px rgba(0,0,0,0.6)';
  const words = text.split(' ');
  if (anim === 'wipe') {
    // the line is revealed right-to-left, the direction it is read, behind a soft edge
    const p = interpolate(f - delay, [0, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      easing: (x) => 1 - Math.pow(1 - x, 3)});
    const edge = p * 130 - 15;
    return (
      <div style={{...wrap, WebkitMaskImage: `linear-gradient(to left, black ${edge}%, transparent ${edge + 15}%)`,
        maskImage: `linear-gradient(to left, black ${edge}%, transparent ${edge + 15}%)`}}>
        {words.map((w, i) => (
          <span key={i} dir={/[\u0600-\u06FF]/.test(w) ? 'rtl' : 'ltr'} style={{display: 'inline-block',
            color: gold.includes(w) ? color.gold : c, textShadow: shadow(w), paddingBottom: size * 0.12}}>{w}</span>
        ))}
      </div>
    );
  }
  return (
    <div style={wrap}>
      {words.map((w, i) => {
        const soft = anim === 'blur' || anim === 'drop';
        const s = useSpring(f, delay + i * stagger, soft ? {damping: 20, stiffness: 90} : {damping: 13, stiffness: 200});
        const latin = !/[\u0600-\u06FF]/.test(w);
        const t: Record<Exclude<Anim, 'wipe'>, React.CSSProperties> = {
          rise: {transform: `translateY(${(1 - s) * 110}%)`, opacity: clamp(s * 1.5)},
          blur: {filter: `blur(${(1 - s) * 18}px)`, transform: `translateY(${(1 - s) * 24}px)`, opacity: clamp(s * 1.3)},
          scale: {transform: `scale(${1.5 - 0.5 * s})`, opacity: clamp(s * 1.6)},
          slideR: {transform: `translateX(${(1 - s) * 220}px)`, opacity: clamp(s * 1.4)},
          slideL: {transform: `translateX(${(1 - s) * -220}px)`, opacity: clamp(s * 1.4)},
          drop: {transform: `translateY(${(1 - s) * -90}px)`, opacity: clamp(s * 1.3)},
        };
        return (
          <span key={i} style={{display: 'inline-block', overflow: anim === 'rise' ? 'hidden' : 'visible', paddingBottom: size * 0.12}}>
            <span dir={latin ? 'ltr' : 'rtl'} style={{display: 'inline-block', color: gold.includes(w) ? color.gold : c,
              textShadow: shadow(w), ...t[anim as Exclude<Anim, 'wipe'>]}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

const Center: React.FC<{y: number; children: React.ReactNode; w?: number}> = ({y, children, w = 952}) => (
  <div style={{position: 'absolute', top: y, left: (1080 - w) / 2, width: w, display: 'flex', flexDirection: 'column',
    alignItems: 'center'}}>{children}</div>
);

// Line-drawn icon: strokes draw themselves in, then fill fades up.
export const Icon: React.FC<{f: number; delay?: number; size: number; d: string[]; fill?: boolean}> = ({f, delay = 0, size, d, fill}) => {
  const p = clamp((f - delay) / 18);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
      {d.map((path, i) => (
        <path key={i} d={path} fill={fill && i === 0 ? `rgba(243,180,6,${0.18 * p})` : 'none'} stroke={color.gold}
          strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
          strokeDasharray={1} strokeDashoffset={1 - p} />
      ))}
    </svg>
  );
};

export const ICON = {
  house: ['M15 50 L50 18 L85 50', 'M25 42 V85 H75 V42', 'M43 85 V62 H57 V85'],
  shield: ['M50 8 L85 22 V48 C85 70 70 85 50 94 C30 85 15 70 15 48 V22 Z', 'M33 50 L46 63 L68 38'],
  box: ['M20 35 L50 20 L80 35 L80 70 L50 85 L20 70 Z', 'M20 35 L50 50 L80 35', 'M50 50 V85'],
  door: ['M25 92 V10 H75 V92', 'M10 92 H90', 'M62 52 h4'],
  phone: ['M30 6 H70 Q78 6 78 14 V86 Q78 94 70 94 H30 Q22 94 22 86 V14 Q22 6 30 6 Z', 'M44 13 H56'],
  used: ['M25 40 A28 28 0 0 1 78 35', 'M78 20 V36 H62', 'M75 60 A28 28 0 0 1 22 65', 'M22 80 V64 H38'],
  laptop: ['M22 25 H78 V65 H22 Z', 'M10 75 H90 L84 83 H16 Z'],
  phones: ['M20 60 V52 A30 30 0 0 1 80 52 V60', 'M14 58 H28 V84 H14 Z', 'M72 58 H86 V84 H72 Z'],
  download: ['M50 15 V65', 'M30 47 L50 67 L70 47', 'M20 82 H80'],
  play: ['M30 18 L80 50 L30 82 Z'],
};

// Gold diagonal band that wipes across every scene cut.
const GoldWipe: React.FC<{f: number; at: number}> = ({f, at}) => {
  const p = (f - (at - 6)) / 12;
  if (p < 0 || p > 1) return null;
  const x = interpolate(p, [0, 1], [-1400, 1400]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: -400, left: 540 - 300 + x, width: 600, height: 2720,
        transform: 'rotate(18deg)', background: `linear-gradient(90deg, transparent, ${color.goldDeep} 25%, ${color.gold} 50%, ${color.goldDeep} 75%, transparent)`,
        boxShadow: `0 0 120px ${color.gold}`}} />
    </AbsoluteFill>
  );
};

// Moving brand background: black, a slow gold light, and drifting hairlines.
const Background: React.FC<{f: number}> = ({f}) => {
  const gx = 540 + Math.sin(f / 70) * 260;
  const gy = 820 + Math.cos(f / 90) * 300;
  return (
    <AbsoluteFill style={{background: '#050405'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle 760px at ${gx}px ${gy}px, rgba(243,180,6,0.20), rgba(243,180,6,0.04) 55%, transparent 75%)`}} />
      <AbsoluteFill style={{opacity: 0.10, backgroundImage: `repeating-linear-gradient(115deg, ${color.gold} 0 2px, transparent 2px 120px)`,
        backgroundPosition: `${f * 1.6}px 0`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 70% at 50% 45%, transparent 55%, rgba(0,0,0,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

const Pill: React.FC<{f: number; delay: number; children: React.ReactNode; gold?: boolean; size?: number}> = ({f, delay, children, gold, size = 54}) => {
  const s = useSpring(f, delay, {damping: 11, stiffness: 220});
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, padding: '18px 40px', borderRadius: 999,
      background: gold ? color.gold : 'rgba(255,255,255,0.06)', border: `3px solid ${color.gold}`,
      color: gold ? color.black : color.white, fontFamily: font.family, fontWeight: 900, fontSize: size,
      transform: `scale(${0.6 + 0.4 * s})`, opacity: clamp(s * 2), boxShadow: gold ? `0 0 50px ${color.gold}88` : 'none'}}>
      {children}
    </div>
  );
};

const StoreButtons: React.FC<{f: number; delay: number; scale?: number}> = ({f, delay, scale = 1}) => (
  <div style={{display: 'flex', gap: 28 * scale, direction: 'ltr', transform: `scale(${scale})`}}>
    {[{label: 'Google Play', icon: ICON.play}, {label: 'App Store', icon: ICON.download}].map((b, i) => {
      const s = useSpring(f, delay + i * 6, {damping: 12, stiffness: 200});
      return (
        <div key={b.label} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '20px 34px', borderRadius: 26,
          background: '#0d0b0e', border: `3px solid ${color.gold}`, transform: `translateY(${(1 - s) * 80}px)`, opacity: clamp(s * 2)}}>
          <Icon f={f} delay={delay + i * 6} size={56} d={b.icon} />
          <div style={{fontFamily: font.family, color: color.white, lineHeight: 1}}>
            <div style={{fontSize: 26, fontWeight: 700, opacity: 0.8, direction: 'rtl'}}>حمّله من</div>
            <div style={{fontSize: 46, fontWeight: 800}}>{b.label}</div>
          </div>
        </div>
      );
    })}
  </div>
);

const PhoneMock: React.FC<{f: number; delay: number; y?: number}> = ({f, delay, y = 0}) => {
  const s = useSpring(f, delay, {damping: 15, stiffness: 120});
  const tilt = Math.sin((f - delay) / 25) * 3;
  return (
    <div style={{width: 400, height: 800, borderRadius: 64, background: 'linear-gradient(160deg,#1b181d,#060507)',
      border: `6px solid ${color.goldDeep}`, boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 80px ${color.gold}33`,
      transform: `translateY(${(1 - s) * 900 + y}px) rotate(${tilt}deg)`, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', position: 'relative', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 22, width: 120, height: 30, borderRadius: 20, background: '#000'}} />
      <Img src={staticFile('logo.png')} style={{width: 280, opacity: clamp((f - delay - 10) / 12)}} />
      <div style={{position: 'absolute', top: -200, left: interpolate((f - delay) % 90, [0, 90], [-300, 500]), width: 120,
        height: 1200, transform: 'rotate(20deg)', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)'}} />
    </div>
  );
};

// ---------- scenes ----------

const S1: React.FC<{f: number}> = ({f}) => (
  <>
    <Center y={560}>
      <Words f={f} text="تريد جهاز" size={170} />
      <Words f={f} delay={8} text="بالأقساط؟" size={190} gold={['بالأقساط؟']} />
    </Center>
    {f >= 60 && (
      <Center y={1050}>
        <Icon f={f} delay={60} size={200} d={ICON.house} fill />
        <Words f={f} delay={66} text="وانت ببيتك؟" size={120} anim="blur" />
      </Center>
    )}
  </>
);

const S2: React.FC<{f: number}> = ({f}) => {
  const s = useSpring(f, 6, {damping: 14, stiffness: 160});
  const shake = 0;
  return (
    <Center y={640}>
      <Words f={f} text="مقدمة؟" size={120} c="rgba(255,255,255,0.55)" anim="blur" />
      <div style={{marginTop: 30, transform: `scale(${1.8 - 0.8 * s}) rotate(${-8 * s}deg) translateX(${shake}px)`, opacity: clamp(s * 3),
        border: `10px solid ${color.gold}`, borderRadius: 28, padding: '10px 60px', fontFamily: font.family,
        fontWeight: 900, fontSize: 200, color: color.gold, boxShadow: `0 0 60px ${color.gold}55`}}>بدون</div>
    </Center>
  );
};

const S3: React.FC<{f: number}> = ({f}) => (
  <Center y={470}>
    <Icon f={f} size={380} d={ICON.shield} fill />
    <div style={{marginTop: 30}}>
      <Words f={f} delay={10} text="ضمان سنة" size={190} gold={['سنة']} anim="wipe" />
    </div>
  </Center>
);

const S4: React.FC<{f: number}> = ({f}) => {
  const slide = useSpring(f, 2, {damping: 18, stiffness: 90});
  return (
    <>
      <div style={{position: 'absolute', top: 430, left: 560}}><Icon f={f} size={420} d={ICON.door} /></div>
      <div style={{position: 'absolute', top: 600, left: interpolate(slide, [0, 1], [-360, 300]),
        transform: `rotate(${(1 - slide) * -25}deg)`}}>
        <Icon f={f} size={260} d={ICON.box} fill />
      </div>
      <Center y={1010}>
        <Words f={f} delay={12} text="يوصلك لباب البيت" size={130} gold={['البيت']} anim="slideR" stagger={5} />
      </Center>
    </>
  );
};

const S5: React.FC<{f: number}> = ({f}) => (
  <>
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{position: 'absolute', top: 560 + i * 90, height: 10, borderRadius: 5, background: color.gold,
        opacity: 0.5, width: 300 + (i % 2) * 180, left: interpolate((f * 28 + i * 230) % 1600, [0, 1600], [1100, -500])}} />
    ))}
    <Center y={720}>
      <Words f={f} text="توصيل" size={180} anim="scale" />
      <div style={{marginTop: 20}}><Pill f={f} delay={8} gold size={150}>مجاني</Pill></div>
    </Center>
  </>
);

const S6: React.FC<{f: number}> = ({f}) => {
  const n = Math.round(interpolate(f, [6, 34], [0, 25], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const pop = useSpring(f, 34, {damping: 8, stiffness: 300});
  return (
    <Center y={560}>
      <Words f={f} text="وخصم" size={150} anim="drop" />
      <div style={{direction: 'rtl', display: 'flex', alignItems: 'baseline', gap: 30, fontFamily: font.family, fontWeight: 900}}>
        <span style={{fontSize: 400, color: color.gold, lineHeight: 1.05, transform: `scale(${1 + 0.12 * Math.sin(pop * Math.PI)})`,
          textShadow: `0 0 80px ${color.gold}88`, display: 'inline-block', direction: 'ltr'}}>{n}</span>
        <span style={{fontSize: 140, color: color.white}}>الف</span>
      </div>
    </Center>
  );
};

const S7: React.FC<{f: number}> = ({f}) => (
  <>
    <Center y={300}>
      <Words f={f} text="لكيتلك الحل" size={140} gold={['الحل']} anim="blur" stagger={7} />
    </Center>
    <div style={{position: 'absolute', top: 560, left: 340}}><PhoneMock f={f} delay={10} /></div>
  </>
);

const S8: React.FC<{f: number}> = ({f}) => (
  <>
    <div style={{position: 'absolute', top: 270, left: 340, transform: 'scale(0.62)', transformOrigin: 'top center'}}>
      <PhoneMock f={f + 40} delay={0} />
    </div>
    <Center y={800}>
      <Words f={f} text="حمّل تطبيق" size={130} anim="wipe" />
      <Words f={f} delay={12} text="جي فاير للموبايل" size={140} gold={['جي', 'فاير', 'للموبايل']} anim="scale" />
      <div style={{marginTop: 50}}><StoreButtons f={f} delay={30} /></div>
    </Center>
  </>
);

const S9: React.FC<{f: number}> = ({f}) => {
  const cats = [
    {t: 'هواتف جديدة', i: ICON.phone}, {t: 'مستعمل', i: ICON.used},
    {t: 'حاسبات', i: ICON.laptop}, {t: 'اكسسوارات', i: ICON.phones},
  ];
  return (
    <>
      <Center y={330}><Words f={f} text="اشتري اللي يناسبك" size={96} anim="slideL" /></Center>
      <div style={{position: 'absolute', top: 520, left: 84, width: 912, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, direction: 'rtl'}}>
        {cats.map((c, k) => {
          const s = useSpring(f, 12 + k * BEAT / 2, {damping: 12, stiffness: 200});
          return (
            <div key={k} style={{height: 380, borderRadius: 40, background: 'linear-gradient(160deg, rgba(243,180,6,0.12), rgba(255,255,255,0.02))',
              border: `3px solid ${color.gold}88`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 20, transform: `scale(${0.5 + 0.5 * s}) translateY(${(1 - s) * 120}px)`, opacity: clamp(s * 2)}}>
              <Icon f={f} delay={12 + k * 7} size={170} d={c.i} />
              <div style={{fontFamily: font.family, fontWeight: 900, fontSize: 64, color: color.white}}>{c.t}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const S10: React.FC<{f: number}> = ({f}) => {
  const line = clamp((f - 24) / 14);
  return (
    <Center y={620}>
      <Words f={f} text="ضمان سنة" size={150} nowrap anim="drop" />
      <Words f={f} delay={14} text="ضمان حقيقي" size={150} gold={['حقيقي']} nowrap anim="wipe" />
      <div style={{height: 14, width: 620 * line, background: color.gold, borderRadius: 7, marginTop: 10, boxShadow: `0 0 30px ${color.gold}`}} />
    </Center>
  );
};

const S11: React.FC<{f: number}> = ({f}) => (
  <Center y={520}>
    <Words f={f} text="يلا شمنتظر؟" size={140} />
    <div style={{height: 40}} />
    <Words f={f} delay={20} text="حمّل هسه واستفيد" size={120} gold={['هسه']} anim="scale" />
    <div style={{marginTop: 70}}><Pill f={f} delay={40} gold size={44}>
      <span style={{fontSize: 52}}>⬇</span> <span dir="ltr">app.jifrephone.workers.dev</span>
    </Pill></div>
  </Center>
);

const S12: React.FC<{f: number}> = ({f}) => {
  const s = useSpring(f, 0, {damping: 16, stiffness: 120});
  return (
    <Center y={380}>
      <Img src={staticFile('logo.png')} style={{width: 560, transform: `scale(${0.7 + 0.3 * s})`, opacity: clamp(s * 2)}} />
      <div style={{marginTop: 50}}><Words f={f} delay={10} text="التقنية باعلى ذروتها" size={70} weight={800} anim="blur" /></div>
      <div style={{marginTop: 60}}><StoreButtons f={f} delay={20} scale={0.9} /></div>
    </Center>
  );
};

export const SCENES: Scene[] = [
  {from: 0, to: 120, el: S1}, {from: 120, to: 180, el: S2}, {from: 180, to: 240, el: S3},
  {from: 240, to: 300, el: S4}, {from: 300, to: 360, el: S5}, {from: 360, to: 420, el: S6},
  {from: 420, to: 480, el: S7}, {from: 480, to: 600, el: S8}, {from: 600, to: 720, el: S9},
  {from: 720, to: 780, el: S10}, {from: 780, to: 870, el: S11}, {from: 870, to: 960, el: S12},
];

// Eleven soft transitions, one per cut and never the same twice in a row. Both scenes are on screen
// during the change, so nothing pops; each has its own matching sound (scripts_reels/app-promo/sfx_cues.json).
type Trans = 'dissolve' | 'iris' | 'push' | 'leak' | 'zoom' | 'softwipe' | 'blurrise' | 'pushUp' | 'goldline' | 'irisLow' | 'fadeBlack';
export const TRANSITIONS: {at: number; type: Trans; dur: number}[] = [
  {at: 120, type: 'dissolve', dur: 16}, {at: 180, type: 'iris', dur: 18}, {at: 240, type: 'push', dur: 18},
  {at: 300, type: 'leak', dur: 20}, {at: 360, type: 'zoom', dur: 16}, {at: 420, type: 'softwipe', dur: 20},
  {at: 480, type: 'blurrise', dur: 18}, {at: 600, type: 'pushUp', dur: 18}, {at: 720, type: 'goldline', dur: 20},
  {at: 780, type: 'irisLow', dur: 18}, {at: 870, type: 'fadeBlack', dur: 22},
];

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2); // easeInOutCubic

const styles = (type: Trans, p: number): {out: React.CSSProperties; in: React.CSSProperties; overlay?: React.ReactNode} => {
  const q = ease(p);
  // staggered crossfade: the old text is mostly gone before the new text arrives, so two lines never stack
  const o = clamp(1 - q * 1.7);
  const i = clamp(q * 1.7 - 0.7);
  switch (type) {
    case 'dissolve':
      return {out: {opacity: o, filter: `blur(${q * 10}px)`}, in: {opacity: i, filter: `blur(${(1 - q) * 10}px)`}};
    case 'iris':
      return {out: {opacity: 1 - q * 0.6}, in: {clipPath: `circle(${q * 125}% at 50% 42%)`}};
    case 'irisLow':
      return {out: {opacity: 1 - q * 0.6}, in: {clipPath: `circle(${q * 140}% at 50% 100%)`}};
    case 'push':
      return {out: {transform: `translateX(${q * 1080}px)`, opacity: 1 - q * 0.5}, in: {transform: `translateX(${(q - 1) * 1080}px)`}};
    case 'pushUp':
      return {out: {transform: `translateY(${-q * 700}px)`, opacity: 1 - q}, in: {transform: `translateY(${(1 - q) * 1920}px)`}};
    case 'zoom':
      return {out: {transform: `scale(${1 + q * 0.6})`, opacity: o}, in: {transform: `scale(${0.82 + 0.18 * q})`, opacity: i}};
    case 'blurrise':
      return {out: {opacity: o, transform: `translateY(${-q * 120}px)`},
        in: {opacity: i, filter: `blur(${(1 - q) * 16}px)`, transform: `translateY(${(1 - q) * 120}px)`}};
    case 'softwipe': {
      const e = q * 140 - 20;
      const m = `linear-gradient(to left, black ${e}%, transparent ${e + 20}%)`;
      return {out: {opacity: 1 - q * 0.8}, in: {WebkitMaskImage: m, maskImage: m}};
    }
    case 'leak':
      return {out: {opacity: o}, in: {opacity: i},
        overlay: <AbsoluteFill style={{opacity: Math.sin(Math.PI * p) * 0.55, mixBlendMode: 'screen',
          background: `radial-gradient(circle 900px at ${200 + q * 700}px 700px, ${color.gold}, rgba(243,180,6,0.25) 45%, transparent 70%)`}} />};
    case 'goldline': {
      const x = interpolate(q, [0, 1], [-200, 1280]);
      return {out: {clipPath: `polygon(${x}px 0, 1080px 0, 1080px 1920px, ${x - 500}px 1920px)`},
        in: {clipPath: `polygon(0 0, ${x}px 0, ${x - 500}px 1920px, 0 1920px)`},
        overlay: <AbsoluteFill><div style={{position: 'absolute', top: -200, left: x - 250, width: 6, height: 2400,
          transform: 'rotate(14.6deg)', transformOrigin: 'top', background: color.gold, boxShadow: `0 0 40px ${color.gold}`,
          opacity: Math.sin(Math.PI * p)}} /></AbsoluteFill>};
    }
    case 'fadeBlack':
      return {out: {opacity: clamp(1 - q * 2)}, in: {opacity: clamp(q * 2 - 1)}};
  }
};

export const AppPromo: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.max(0, SCENES.findIndex((s) => f >= s.from && f < s.to));
  const cur = SCENES[idx];
  const zoomOf = (sc: Scene, local: number) => 1 + 0.035 * clamp(local / (sc.to - sc.from)); // slow camera push
  const tr = TRANSITIONS.find((t) => t.at === cur.from && f < t.at + t.dur);
  const El = cur.el;
  const local = f - cur.from;
  if (!tr || idx === 0) {
    return (
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Background f={f} />
        <AbsoluteFill style={{transform: `scale(${zoomOf(cur, local)})`}}><El f={local} /></AbsoluteFill>
      </AbsoluteFill>
    );
  }
  const prev = SCENES[idx - 1];
  const Prev = prev.el;
  const prevLocal = f - prev.from;
  const st = styles(tr.type, (f - tr.at) / tr.dur);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Background f={f} />
      <AbsoluteFill style={st.out}>
        <AbsoluteFill style={{transform: `scale(${zoomOf(prev, prevLocal)})`}}><Prev f={prevLocal} /></AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={st.in}>
        {tr.type === 'irisLow' || tr.type === 'iris' || tr.type === 'softwipe' || tr.type === 'goldline' ? <Background f={f} /> : null}
        <AbsoluteFill style={{transform: `scale(${zoomOf(cur, local)})`}}><El f={local} /></AbsoluteFill>
      </AbsoluteFill>
      {st.overlay}
    </AbsoluteFill>
  );
};
