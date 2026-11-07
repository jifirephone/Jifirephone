// Ji Fire offer reel (2026-11-07): iPhone 17 / 18 Pro Max + Galaxy S26 Ultra, discount code 25k, free delivery,
// warranty + receipt, offer ends in 2 days, download the app. Built from the owner's own app screen recordings.
// Structure learned from a reference reel (fixed top headline per beat, app demo inside a phone, tap markers,
// two phones side by side, urgency, logo); technique only, Ji Fire black + gold.
import React from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Icon, ICON} from '../AppPromo';
import {color, font} from '../brand';

export const OFFER_FRAMES = 1030; // 34.3 s @ 30 fps
const gold = color.gold;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// ---------- pieces ----------
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#09080B'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle 900px at ${540 + Math.sin(f / 70) * 220}px ${980 + Math.cos(f / 95) * 260}px, rgba(243,180,6,0.16), transparent 70%)`}} />
      <AbsoluteFill style={{opacity: 0.12, backgroundImage: `radial-gradient(circle, ${gold} 1.5px, transparent 2px)`, backgroundSize: '60px 60px',
        backgroundPosition: `${(f * 0.6) % 60}px ${(f * 0.3) % 60}px`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 48%, transparent 55%, rgba(0,0,0,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

// Consecutive English words/numbers stay one LTR run ("Galaxy S26 Ultra", never reversed).
const runs = (text: string) => {
  const out: {latin: boolean; words: string[]}[] = [];
  for (const w of text.split(' ')) {
    const latin = !/[\u0600-\u06FF]/.test(w);
    const last = out[out.length - 1];
    if (last && latin && last.latin) last.words.push(w);
    else out.push({latin, words: [w]});
  }
  return out;
};

// Headline fixed at the top; words blur in, one or more gold words. Local frame f inside its scene.
const Head: React.FC<{f: number; text: string; gold?: string[]; size?: number; y?: number; out?: number}> = ({f, text, gold: g = [], size = 92, y = 250, out}) => {
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: y, left: 64, right: 64, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
      direction: 'rtl', columnGap: size * 0.28, fontFamily: font.family, fontWeight: 900, fontSize: size, lineHeight: 1.25}}>
      {runs(text).map((run, i) => {
        const s = spring({frame: f - i * 3, fps, config: {damping: 18, stiffness: 140}});
        const o = out === undefined ? 1 : clamp((out - f) / 8);
        const v = Math.min(s, o);
        return (
          <span key={i} dir={run.latin ? 'ltr' : 'rtl'} style={{display: 'inline-block', opacity: v, unicodeBidi: 'isolate',
            filter: `blur(${(1 - v) * 12}px)`, transform: `translateY(${(1 - s) * 30}px)`}}>
            {run.words.map((w, j) => (
              <span key={j} style={{color: g.includes(w) ? gold : '#fff', marginInlineStart: j ? size * 0.25 : 0,
                textShadow: g.includes(w) ? `0 0 36px ${gold}66` : '0 6px 22px rgba(0,0,0,0.7)'}}>{w}</span>
            ))}
          </span>
        );
      })}
    </div>
  );
};

const Chip: React.FC<{children: React.ReactNode; solid?: boolean; size?: number; style?: React.CSSProperties}> = ({children, solid, size = 48, style}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '14px 34px', borderRadius: 999, direction: 'rtl', whiteSpace: 'nowrap',
    background: solid ? gold : 'rgba(255,255,255,0.06)', border: `2px solid ${solid ? gold : gold + '99'}`, color: solid ? '#000' : '#fff',
    fontFamily: font.family, fontWeight: 900, fontSize: size, boxShadow: solid ? `0 0 40px ${gold}66` : 'none', ...style}}>{children}</div>
);

const Pop: React.FC<{f: number; at: number; children: React.ReactNode; from?: 'up' | 'down' | 'scale'}> = ({f, at, children, from = 'scale'}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 13, stiffness: 160}});
  const t = from === 'up' ? `translateY(${(1 - s) * -60}px)` : from === 'down' ? `translateY(${(1 - s) * 80}px)` : `scale(${0.6 + 0.4 * s})`;
  return <div style={{opacity: clamp(s * 2), transform: t, filter: `blur(${(1 - s) * 8}px)`}}>{children}</div>;
};

// Phone with an app clip. Screen is 886x1816 source px shown at `w` wide. zoom/focus: magnify a point of the screen.
const SCREEN_W = 886, SCREEN_H = 1816;
const Phone: React.FC<{src: string; w?: number; rate?: number; start?: number; zoom?: number; fx?: number; fy?: number; tilt?: number; children?: React.ReactNode}> = ({src, w = 560, rate = 1, start = 0, zoom = 1, fx = 443, fy = 908, tilt = 0, children}) => {
  const h = (w * SCREEN_H) / SCREEN_W;
  const k = w / SCREEN_W;
  return (
    <div style={{width: w + 28, height: h + 28, borderRadius: 74 * k * 1.6, padding: 14, background: 'linear-gradient(150deg,#3a3630,#121013 40%,#2b2722)',
      boxShadow: `0 60px 140px rgba(0,0,0,0.75), 0 0 0 2px ${gold}55, 0 0 80px ${gold}22`, transform: `rotateY(${tilt}deg)`}}>
      <div style={{width: w, height: h, borderRadius: 60 * k * 1.6, overflow: 'hidden', position: 'relative', background: '#fff'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: `${fx * k}px ${fy * k}px`, transform: `scale(${zoom})`}}>
          {src.endsWith('.png') ? <Img src={staticFile(src)} style={{width: w, height: h}} />
            : <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} startFrom={start} style={{width: w, height: h}} />}
          {children}
        </div>
      </div>
    </div>
  );
};

// Tap marker in screen coordinates (source px), like the reference's touch indicator.
const Tap: React.FC<{f: number; at: number; x: number; y: number; k: number}> = ({f, at, x, y, k}) => {
  const p = (f - at) / 18;
  if (p < 0 || p > 1.4) return null;
  const r = 40 + 80 * clamp(p);
  return (
    <div style={{position: 'absolute', left: x * k - r, top: y * k - r, width: 2 * r, height: 2 * r, borderRadius: 999,
      border: `6px solid ${gold}`, background: `${gold}33`, opacity: clamp(1.3 - p), boxShadow: `0 0 30px ${gold}`}} />
  );
};

const center = (w: number) => (1080 - w - 28) / 2;

// ---------- scenes (each gets local frame f) ----------
type SceneEl = React.FC<{f: number}>;

const SHook: SceneEl = ({f}) => {
  const {fps} = useVideoConfig();
  const ph = spring({frame: f - 4, fps, config: {damping: 16, stiffness: 80}});
  return (
    <>
      {f < 62 ? <Head f={f} text="تريد iPhone 17 أو 18" gold={['17', '18']} out={62} /> : <Head f={f - 62} text="أو Galaxy S26 Ultra؟" gold={['S26', 'Ultra؟']} />}
      <div style={{position: 'absolute', left: center(520), top: 520, transform: `translateY(${(1 - ph) * 900}px) rotate(${(1 - ph) * 8}deg)`}}>
        <Sequence from={0} layout="none"><Phone src="offer/list18.mp4" w={520} rate={0.62} /></Sequence>
      </div>
      <div style={{position: 'absolute', top: 1290, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Pop f={f} at={70}><Chip solid size={64}>بأنسب سعر بالسوق</Chip></Pop>
      </div>
    </>
  );
};

const STwo: SceneEl = ({f}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: f, fps, config: {damping: 18, stiffness: 90}});
  const b = spring({frame: f - 8, fps, config: {damping: 18, stiffness: 90}});
  return (
    <>
      <Head f={f} text="17 Pro Max و 18 Pro Max" gold={['17', '18']} size={84} />
      <div style={{position: 'absolute', top: 470, left: 30 + (1 - a) * -500, transform: `rotateY(${(1 - a) * 30 + 8}deg)`}}>
        <Phone src="offer/page17.mp4" w={460} />
        <div style={{marginTop: 26, display: 'flex', justifyContent: 'center'}}><Chip size={40}><span dir="ltr">iPhone 17 Pro Max</span></Chip></div>
      </div>
      <div style={{position: 'absolute', top: 470, left: 562 + (1 - b) * 600, transform: `rotateY(${(1 - b) * -30 - 8}deg)`}}>
        <Phone src="offer/page18.mp4" w={460} />
        <div style={{marginTop: 26, display: 'flex', justifyContent: 'center'}}><Chip size={40}><span dir="ltr">iPhone 18 Pro Max</span></Chip></div>
      </div>
    </>
  );
};

const SCode: SceneEl = ({f}) => {
  // zoom in on the code box, tap the button at clip 1.2 s, show the ✓, ease back out a little
  const z = interpolate(f, [0, 30, 100, 130], [1, 1.75, 1.75, 1.5], {extrapolateRight: 'clamp', easing: ease});
  const w = 560, k = w / SCREEN_W;
  return (
    <>
      <Head f={f} text="كود خصم 25 الف" gold={['25', 'الف']} size={104} />
      <div style={{position: 'absolute', left: center(w), top: 470}}>
        <Phone src="offer/code.mp4" w={w} rate={0.8} zoom={z} fx={443} fy={620}>
          <Tap f={f} at={42} x={443} y={762} k={k} />
        </Phone>
      </div>
      <div style={{position: 'absolute', top: 1330, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Pop f={f} at={62} from="down"><Chip solid size={52}>✓ تم إدخال كود الخصم</Chip></Pop>
      </div>
    </>
  );
};

const SDelivery: SceneEl = ({f}) => {
  const z = interpolate(f, [0, 26], [1.15, 1.9], {extrapolateRight: 'clamp', easing: ease});
  return (
    <>
      <Head f={f} text="توصيل مجاني لباب البيت" gold={['مجاني']} size={92} />
      <div style={{position: 'absolute', left: center(560), top: 470}}>
        <Phone src="offer/deliv.mp4" w={560} start={15} rate={0.12} zoom={z} fx={640} fy={545} />
      </div>
      <div style={{position: 'absolute', top: 1330, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 5}}>
        <Pop f={f} at={24} from="down"><Chip solid size={54}>لكل محافظات العراق</Chip></Pop>
      </div>
    </>
  );
};

const SWarranty: SceneEl = ({f}) => {
  const card = (at: number, icon: string[], title: string, sub: string, x: number) => (
    <div style={{position: 'absolute', top: 560, left: x}}>
      <Pop f={f} at={at} from="down">
        <div style={{width: 430, height: 560, borderRadius: 44, background: 'linear-gradient(160deg,#18161B,#0D0C0F)', border: `2px solid ${gold}99`,
          boxShadow: `0 40px 90px rgba(0,0,0,0.6), 0 0 50px ${gold}22`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26}}>
          <Icon f={f} delay={at + 4} size={220} d={icon} fill />
          <div style={{fontFamily: font.family, fontWeight: 900, fontSize: 72, color: '#fff'}}>{title}</div>
          <div style={{fontFamily: font.family, fontWeight: 700, fontSize: 38, color: gold}}>{sub}</div>
        </div>
      </Pop>
    </div>
  );
  return (
    <>
      <Head f={f} text="ويه ضمان ووصل ضمان" gold={['ضمان']} size={92} />
      {card(6, ICON.shield, 'ضمان', 'على جهازك', 560)}
      {card(18, ['M25 8 H75 V92 L67 86 L59 92 L50 86 L41 92 L33 86 L25 92 Z', 'M36 30 H64', 'M36 46 H64', 'M36 62 H54'], 'وصل ضمان', 'بإيدك', 90)}
    </>
  );
};

const SS26: SceneEl = ({f}) => (
  <>
    <Head f={f} text="و Galaxy S26 Ultra هم" gold={['S26', 'Ultra']} size={90} />
    <div style={{position: 'absolute', left: center(560), top: 470}}>
      <Phone src="offer/s26.mp4" w={560} rate={0.93} zoom={interpolate(f, [0, 100], [1, 1.12])} fx={443} fy={900} />
    </div>
  </>
);

const SUrgent: SceneEl = ({f}) => {
  const {fps} = useVideoConfig();
  const digit = (v: string, label: string, at: number) => {
    const s = spring({frame: f - at, fps, config: {damping: 12, stiffness: 170}});
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transform: `scale(${0.6 + 0.4 * s})`, opacity: clamp(s * 2)}}>
        <div style={{width: 230, height: 260, borderRadius: 36, background: '#141216', border: `3px solid ${gold}`, boxShadow: `0 0 50px ${gold}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.family, fontWeight: 900, fontSize: 170, color: gold, direction: 'ltr'}}>{v}</div>
        <div style={{fontFamily: font.family, fontWeight: 800, fontSize: 44, color: '#fff'}}>{label}</div>
      </div>
    );
  };
  // live-looking countdown from 47:59:59
  const secsLeft = 2 * 86400 - 1 - Math.floor(f / 30);
  const hh = String(Math.floor((secsLeft % 86400) / 3600)).padStart(2, '0');
  const mm = String(Math.floor((secsLeft % 3600) / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');
  return (
    <>
      <Head f={f} text="العرض يخلص بعد يومين!" gold={['يومين!']} size={96} />
      <div style={{position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 34, direction: 'rtl'}}>
        {digit('02', 'يوم', 6)}{digit(hh, 'ساعة', 12)}{digit(mm === '00' ? '59' : mm, 'دقيقة', 18)}
      </div>
      <div style={{position: 'absolute', top: 920, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: clamp((f - 24) / 10)}}>
        <div style={{fontFamily: font.family, fontWeight: 800, fontSize: 52, color: '#ffffffaa', direction: 'ltr'}}>{hh}:{mm}:{ss}</div>
      </div>
      <div style={{position: 'absolute', top: 1110, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Pop f={f} at={50}><Chip solid size={58}>يلا الحگ قبل لا تصعد الأسعار!</Chip></Pop>
      </div>
    </>
  );
};

const StoreChips: React.FC<{f: number; at: number}> = ({f, at}) => (
  <div style={{display: 'flex', gap: 24, justifyContent: 'center', direction: 'ltr'}}>
    <Pop f={f} at={at} from="down"><Chip size={44}><span>▶</span><span dir="ltr">Google Play</span></Chip></Pop>
    <Pop f={f} at={at + 8} from="down"><Chip size={44}><span>⬇</span><span dir="ltr">App Store</span></Chip></Pop>
  </div>
);

const SApp: SceneEl = ({f}) => (
  <>
    {f < 60 ? <Head f={f} text="نزّل تطبيق جي فاير للموبايل" gold={['جي', 'فاير']} size={88} out={60} />
      : <Head f={f - 60} text="واطلب هسه" gold={['هسه']} size={110} />}
    <div style={{position: 'absolute', left: center(470), top: 480}}>
      <Phone src="offer/picker.png" w={430} tilt={Math.sin(f / 30) * 6} />
    </div>
    <div style={{position: 'absolute', top: 1330, left: 0, right: 0, zIndex: 5}}><StoreChips f={f} at={20} /></div>
    <div style={{position: 'absolute', top: 1400, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: clamp((f - 40) / 10)}}>
      <div style={{fontFamily: font.family, fontWeight: 700, fontSize: 32, color: '#ffffffcc', direction: 'ltr'}}>app.jifrephone.workers.dev</div>
    </div>
  </>
);

const SEnd: SceneEl = ({f}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 6, fps, config: {damping: 16, stiffness: 100}});
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', paddingTop: 480}}>
      <div style={{opacity: s, transform: `scale(${0.85 + 0.15 * s})`, filter: `blur(${(1 - s) * 10}px)`}}><Img src={staticFile('logo.png')} style={{width: 560}} /></div>
      <div style={{marginTop: 46, opacity: clamp((f - 22) / 12), fontFamily: font.family, fontWeight: 800, fontSize: 64, color: '#fff', direction: 'rtl'}}>التقنية باعلى ذروتها</div>
      <div style={{marginTop: 54, width: 1080}}><StoreChips f={f} at={32} /></div>
    </AbsoluteFill>
  );
};

// ---------- timeline + transitions ----------
type Trans = 'slide' | 'zoomIn' | 'whip' | 'blur' | 'iris' | 'dolly' | 'pushUp' | 'black';
const SCENES: {from: number; to: number; el: SceneEl; tin?: Trans; dur?: number}[] = [
  {from: 0, to: 120, el: SHook},
  {from: 120, to: 240, el: STwo, tin: 'slide', dur: 18},
  {from: 240, to: 370, el: SCode, tin: 'zoomIn', dur: 18},
  {from: 370, to: 470, el: SDelivery, tin: 'whip', dur: 14},
  {from: 470, to: 575, el: SWarranty, tin: 'blur', dur: 16},
  {from: 575, to: 675, el: SS26, tin: 'iris', dur: 18},
  {from: 675, to: 800, el: SUrgent, tin: 'dolly', dur: 18},
  {from: 800, to: 930, el: SApp, tin: 'pushUp', dur: 18},
  {from: 930, to: 1030, el: SEnd, tin: 'black', dur: 20},
];
export const OFFER_TRANSITIONS = SCENES.filter((s) => s.tin).map((s) => ({at: s.from, type: s.tin as Trans, dur: s.dur ?? 16}));

const tStyles = (t: Trans, p: number): {out: React.CSSProperties; in: React.CSSProperties} => {
  const q = ease(clamp(p));
  const o = clamp(1 - q * 1.7), i = clamp(q * 1.7 - 0.7);
  switch (t) {
    case 'slide': return {out: {transform: `translateX(${q * -1080}px)`}, in: {transform: `translateX(${(1 - q) * 1080}px)`}};
    case 'zoomIn': return {out: {transform: `scale(${1 + q * 1.4})`, opacity: o, transformOrigin: '75% 55%'}, in: {transform: `scale(${0.85 + 0.15 * q})`, opacity: i}};
    case 'whip': return {out: {transform: `translateX(${q * 1080}px)`, filter: `blur(${q * 22}px)`}, in: {transform: `translateX(${(q - 1) * 1080}px)`, filter: `blur(${(1 - q) * 22}px)`}};
    case 'blur': return {out: {opacity: o, filter: `blur(${q * 14}px)`}, in: {opacity: i, filter: `blur(${(1 - q) * 14}px)`}};
    case 'iris': return {out: {opacity: 1 - q * 0.6}, in: {clipPath: `circle(${q * 125}% at 50% 55%)`}};
    case 'dolly': return {out: {transform: `scale(${1 - q * 0.4})`, opacity: o}, in: {transform: `scale(${1.25 - 0.25 * q})`, opacity: i}};
    case 'pushUp': return {out: {transform: `translateY(${-q * 900}px)`, opacity: 1 - q}, in: {transform: `translateY(${(1 - q) * 1920}px)`}};
    case 'black': return {out: {opacity: clamp(1 - q * 2)}, in: {opacity: clamp(q * 2 - 1)}};
  }
};

// gentle camera life on every scene: slow push + drift, so nothing is ever fully still
const Cam: React.FC<{local: number; len: number; children: React.ReactNode}> = ({local, len, children}) => {
  const f = useCurrentFrame();
  const z = 1 + 0.03 * clamp(local / len);
  return (
    <AbsoluteFill style={{transform: `translate(${Math.sin(f / 61) * 8}px, ${Math.cos(f / 73) * 6}px) scale(${z}) rotate(${Math.sin(f / 97) * 0.3}deg)`}}>
      {children}
    </AbsoluteFill>
  );
};

const Render: React.FC<{i: number; f: number}> = ({i, f}) => {
  const s = SCENES[i];
  const El = s.el;
  const local = f - s.from;
  return (
    <Sequence from={s.from} layout="none">
      <Cam local={local} len={s.to - s.from}><El f={local} /></Cam>
    </Sequence>
  );
};

export const OfferPromo: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.max(0, SCENES.findIndex((s) => f >= s.from && f < s.to));
  const cur = SCENES[idx];
  const inT = cur.tin && f < cur.from + (cur.dur ?? 16) ? cur.tin : undefined;
  if (!inT || idx === 0) {
    return (<AbsoluteFill><Backdrop /><AbsoluteFill><Render i={idx} f={f} /></AbsoluteFill></AbsoluteFill>);
  }
  const st = tStyles(inT, (f - cur.from) / (cur.dur ?? 16));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop />
      <AbsoluteFill style={st.out}><Render i={idx - 1} f={f} /></AbsoluteFill>
      <AbsoluteFill style={st.in}>{inT === 'iris' ? <Backdrop /> : null}<Render i={idx} f={f} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
