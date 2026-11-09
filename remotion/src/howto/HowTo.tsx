// Ji Fire how-to (2026-11-09): order from the app, use the 25k code, free delivery.
// Built from real pieces of jifirephone.com captured on a phone viewport (offer box, options, cart, total, checkout button),
// cut out and animated as floating cards on a dark gold-lit stage, with a tap cursor and success bursts.
// Technique from the owner's Facebook reference (refs/ref5_fb.mp4); never its UI, logo or footage.
// Not shown on purpose: the «ابتداءً من 1,975,000» header (eSIM price, no-eSIM rule). The sign-in step is redrawn (the capture rendered unstyled).
import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EndCard, LogoBug} from '../components/Brand';
import {color, font} from '../brand';

const FPS = 30;
const gold = color.gold;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const fr = (s: number) => Math.round(s * FPS);

// cuts sit in the VO's real pauses (video time = VO + 0.1 s)
const CUTS = [0, 2.18, 5.02, 7.66, 10.76, 12.32, 15.23, 18.08, 20.96, 23.16, 27.2];
const END_FROM = fr(27.2);
export const HOWTO_FRAMES = fr(30.4);

const useS = (f: number, at: number, cfg = {damping: 14, stiffness: 150}) => {
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: cfg});
};

// ---------- stage ----------
const Stage: React.FC<{f: number; burst?: number}> = ({f, burst = -999}) => {
  const b = clamp(1 - (f - burst) / 24) * (f >= burst ? 1 : 0);
  return (
    <AbsoluteFill style={{background: '#060507'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle 900px at 50% ${48 + Math.sin(f / 50) * 4}%, rgba(243,180,6,${0.2 + b * 0.35}), rgba(243,180,6,0.04) 55%, transparent 75%)`}} />
      {b > 0 ? <AbsoluteFill style={{opacity: b, background: `repeating-conic-gradient(from ${f * 1.5}deg at 50% 50%, rgba(243,180,6,0.35) 0deg 6deg, transparent 6deg 18deg)`,
        WebkitMaskImage: 'radial-gradient(circle 700px at 50% 50%, #000, transparent)'}} /> : null}
      <AbsoluteFill style={{opacity: 0.08, backgroundImage: `radial-gradient(circle, ${gold} 1.5px, transparent 2px)`, backgroundSize: '56px 56px', backgroundPosition: `0 ${f * 0.4}px`}} />
    </AbsoluteFill>
  );
};

// a floating UI card from the real site
const Card: React.FC<{f: number; src: string; w: number; x?: number; y: number; at?: number; from?: 'up' | 'down' | 'depth' | 'right'; out?: number; tilt?: number}> = (
  {f, src, w, x = (1080 - w) / 2, y, at = 0, from = 'depth', out, tilt = 8}) => {
  const s = useS(f, at, {damping: 16, stiffness: 110});
  const o = out === undefined ? 1 : clamp((out - f) / 8);
  const enter = from === 'up' ? `translateY(${(1 - s) * -700}px)` : from === 'down' ? `translateY(${(1 - s) * 900}px)`
    : from === 'right' ? `translateX(${(1 - s) * 900}px) rotateY(${(1 - s) * 40}deg)` : `translateZ(${(1 - s) * -800}px) scale(${0.7 + 0.3 * s})`;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, perspective: 1800, opacity: Math.min(clamp(s * 1.6), o)}}>
      <div style={{transform: `${enter} rotateX(${Math.sin((f - at) / 40) * 3}deg) rotateY(${Math.sin((f - at) / 55) * tilt * 0.4}deg) translateY(${Math.sin((f - at) / 28) * 8}px)`,
        borderRadius: 34, overflow: 'hidden', boxShadow: `0 40px 90px rgba(0,0,0,0.7), 0 0 0 3px ${gold}55, 0 0 60px ${gold}30`, background: '#fff'}}>
        <Img src={staticFile(src)} style={{width: w, display: 'block'}} />
      </div>
    </div>
  );
};

// tap cursor: glides between points (canvas px), taps with a ripple
type Tap = {t: number; x: number; y: number};
const Cursor: React.FC<{f: number; taps: Tap[]; enter?: number}> = ({f, taps, enter = 0}) => {
  if (!taps.length || f < enter) return null;
  let x = taps[0].x + 120, y = taps[0].y + 260;
  for (let i = 0; i < taps.length; i++) {
    const a = i === 0 ? enter : taps[i - 1].t, b = taps[i].t;
    const px = i === 0 ? taps[0].x + 120 : taps[i - 1].x, py = i === 0 ? taps[0].y + 260 : taps[i - 1].y;
    if (f >= a) { const k = ease(clamp((f - a) / Math.max(1, b - a - 2))); x = px + (taps[i].x - px) * k; y = py + (taps[i].y - py) * k; }
  }
  const last = [...taps].reverse().find((t) => f >= t.t);
  const since = last ? f - last.t : 99;
  const press = since < 6 ? 0.85 : 1;
  return (
    <>
      {last && since < 18 ? <div style={{position: 'absolute', left: last.x - 70, top: last.y - 70, width: 140, height: 140, borderRadius: '50%',
        border: `6px solid ${gold}`, opacity: 1 - since / 18, transform: `scale(${0.4 + since / 12})`}} /> : null}
      <svg width={110} height={130} viewBox="0 0 100 120" style={{position: 'absolute', left: x - 26, top: y - 8, transform: `scale(${press})`, transformOrigin: '26px 8px',
        filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.6))'}}>
        <path d="M30 8 Q38 4 42 12 L42 54 L48 50 Q56 46 60 54 L62 58 Q70 54 74 62 L76 66 Q84 62 88 72 L88 96 Q86 116 64 116 L46 116 Q34 114 26 100 L10 74 Q6 64 16 62 Q22 62 26 70 L28 72 L28 14 Q28 10 30 8 Z"
          fill="#fff" stroke="#111" strokeWidth={5} strokeLinejoin="round" />
      </svg>
    </>
  );
};

const Ring: React.FC<{f: number; at: number; x: number; y: number; w: number; h: number}> = ({f, at, x, y, w, h}) => {
  const s = useS(f, at, {damping: 12, stiffness: 160});
  if (f < at) return null;
  return <div style={{position: 'absolute', left: x - 12, top: y - 12, width: w + 24, height: h + 24, borderRadius: 26, border: `7px solid ${gold}`,
    boxShadow: `0 0 40px ${gold}aa, inset 0 0 30px ${gold}44`, opacity: clamp(s * 2), transform: `scale(${1.25 - 0.25 * s})`}} />;
};

// step label at the top (safe zone, clear of the logo bug)
const Label: React.FC<{f: number; n?: number; text: string; goldWord?: string; at?: number; anim?: 'rise' | 'slide' | 'blur' | 'scale'}> = ({f, n, text, goldWord, at = 3, anim = 'rise'}) => {
  const s = useS(f, at);
  const tr = anim === 'rise' ? `translateY(${(1 - s) * 50}px)` : anim === 'slide' ? `translateX(${(1 - s) * 140}px)` : anim === 'scale' ? `scale(${1.3 - 0.3 * s})` : 'none';
  return (
    <div style={{position: 'absolute', top: 470, left: 64, right: 290, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, direction: 'rtl',
      opacity: clamp(s * 1.5), transform: tr, filter: anim === 'blur' ? `blur(${(1 - s) * 12}px)` : 'none'}}>
      {n ? <div style={{width: 92, height: 92, borderRadius: 46, background: gold, color: '#000', fontFamily: font.family, fontWeight: 900, fontSize: 58,
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${gold}88`, flexShrink: 0}}>{n}</div> : null}
      <div style={{fontFamily: font.family, fontWeight: 900, fontSize: 70, color: '#fff', lineHeight: 1.2, textShadow: '0 6px 20px rgba(0,0,0,0.8)'}}>
        {text.split(' ').map((w, i) => <span key={i} style={{color: w === goldWord ? gold : '#fff'}}>{i ? ' ' : ''}{w}</span>)}
      </div>
    </div>
  );
};

const Check: React.FC<{f: number; at: number; size?: number}> = ({f, at, size = 220}) => {
  const s = useS(f, at, {damping: 9, stiffness: 180});
  if (f < at) return null;
  const draw = clamp((f - at - 4) / 12);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `scale(${s})`, filter: `drop-shadow(0 0 30px ${gold})`}}>
      <circle cx={50} cy={50} r={44} fill={gold} />
      <path d="M28 52 L44 68 L74 36" fill="none" stroke="#000" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - draw)} />
    </svg>
  );
};

const Pill: React.FC<{children: React.ReactNode; solid?: boolean; size?: number}> = ({children, solid, size = 52}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, padding: '16px 40px', borderRadius: 999, direction: 'rtl', whiteSpace: 'nowrap',
    background: solid ? gold : 'rgba(255,255,255,0.06)', border: `3px solid ${gold}`, color: solid ? '#000' : '#fff', fontFamily: font.family, fontWeight: 900, fontSize: size,
    boxShadow: solid ? `0 0 40px ${gold}66` : 'none'}}>{children}</div>
);

// ---------- scenes (f local) ----------
type SceneEl = React.FC<{f: number}>;
const T = (sec: number, i: number) => fr(sec) - fr(CUTS[i]);

const S0: SceneEl = ({f}) => {
  const n = Math.round(25000 * ease(clamp((f - 4) / 26)));
  const s = useS(f, 2, {damping: 10, stiffness: 140});
  return (
    <>
      <Stage f={f} burst={30} />
      <div style={{position: 'absolute', top: 700, left: 0, right: 0, textAlign: 'center', transform: `scale(${0.6 + 0.4 * s})`, opacity: clamp(s * 2)}}>
        <div style={{fontFamily: font.family, fontWeight: 900, fontSize: 80, color: '#fff'}}>خصم</div>
        <div style={{fontFamily: font.family, fontWeight: 900, fontSize: 230, color: gold, direction: 'ltr', lineHeight: 1, textShadow: `0 0 60px ${gold}88`}}>{n.toLocaleString('en-US')}</div>
        <div style={{fontFamily: font.family, fontWeight: 900, fontSize: 70, color: '#fff', marginTop: 10, direction: 'rtl'}}>دينار؟</div>
      </div>
    </>
  );
};

const PhoneFrame: React.FC<{children: React.ReactNode; w: number}> = ({children, w}) => (
  <div style={{width: w, height: w * 2.05, borderRadius: w * 0.13, background: '#0d0d10', padding: w * 0.035, border: '6px solid #3a3a40',
    boxShadow: `0 40px 100px rgba(0,0,0,0.75), 0 0 80px ${gold}33`}}>
    <div style={{width: '100%', height: '100%', borderRadius: w * 0.1, overflow: 'hidden', position: 'relative', background: '#fff'}}>{children}</div>
  </div>
);

const S1: SceneEl = ({f}) => {
  const s = useS(f, 0, {damping: 16, stiffness: 100});
  const scroll = interpolate(f, [20, 60], [0, -330], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const pop = useS(f, T(4.25, 1), {damping: 13, stiffness: 140});
  return (
    <>
      <Stage f={f} />
      <Label f={f} n={1} text="افتح التطبيق واختار جهازك" goldWord="جهازك" anim="slide" />
      <div style={{position: 'absolute', left: 250, top: 640, transform: `translateY(${(1 - s) * 900}px) rotate(${(1 - s) * 10}deg)`}}>
        <PhoneFrame w={580}>
          <Img src={staticFile('howto/home.png')} style={{width: '100%', transform: `translateY(${scroll}px)`}} />
        </PhoneFrame>
      </div>
      {f >= T(4.25, 1) ? <div style={{position: 'absolute', left: 300, top: 760, width: 480, transform: `scale(${0.6 + 0.4 * pop}) translateY(${(1 - pop) * 200}px)`, opacity: clamp(pop * 2)}}>
        <div style={{borderRadius: 40, background: 'radial-gradient(circle at 50% 40%, #2a2420, #0b0a0c)', border: `3px solid ${gold}88`, padding: 30, boxShadow: `0 0 60px ${gold}44`}}>
          <Img src={staticFile('shop/p17.png')} style={{width: '100%'}} />
          <div style={{textAlign: 'center', fontFamily: font.family, fontWeight: 900, fontSize: 52, color: '#fff', direction: 'ltr'}}>iPhone 17 Pro Max</div>
        </div></div> : null}
      <Cursor f={f} enter={T(3.5, 1)} taps={[{t: T(4.1, 1), x: 540, y: 1250}]} />
    </>
  );
};

// options.png 1086x840 shown 900 wide at (90, 760): scale 0.829
const S2: SceneEl = ({f}) => {
  const W = 900, X = 90, Y = 760, H = W * 840 / 1086;
  const p = (fx: number, fy: number) => ({x: X + fx * W, y: Y + fy * H});
  const a = p(0.73, 0.23), b = p(0.74, 0.53), c = p(0.88, 0.85);
  return (
    <>
      <Stage f={f} />
      <Label f={f} n={2} text="اختار النوع والذاكرة واللون" goldWord="النوع" anim="rise" />
      <Card f={f} src="howto/options.png" w={W} x={X} y={Y} from="right" />
      <Ring f={f} at={T(5.5, 2)} x={a.x - 150} y={a.y - 45} w={300} h={90} />
      <Ring f={f} at={T(6.0, 2)} x={b.x - 150} y={b.y - 45} w={300} h={90} />
      <Ring f={f} at={T(6.85, 2)} x={c.x - 55} y={c.y - 55} w={110} h={110} />
      <Cursor f={f} enter={4} taps={[{t: T(5.5, 2), x: a.x, y: a.y}, {t: T(6.0, 2), x: b.x, y: b.y}, {t: T(6.85, 2), x: c.x, y: c.y}]} />
    </>
  );
};

// offer.png 1086x858 / offer_done.png 1086x1068, 900 wide at (90, 740)
const S3: SceneEl = ({f}) => {
  const W = 900, X = 90, Y = 740;
  const tapT = T(9.75, 3);
  const btn = {x: X + 0.5 * W, y: Y + 0.88 * (W * 858 / 1086)};
  return (
    <>
      <Stage f={f} burst={tapT + 4} />
      <Label f={f} n={3} text="دوس استخدام كود الخصم" goldWord="الخصم" anim="blur" />
      {f < tapT + 2 ? <Card f={f} src="howto/offer.png" w={W} x={X} y={Y} from="up" /> : <Card f={f} src="howto/offer_done.png" w={W} x={X} y={Y} at={tapT - 30} />}
      {f >= tapT + 6 ? <div style={{position: 'absolute', left: 430, top: 1560}}><Check f={f} at={tapT + 6} /></div> : null}
      <Cursor f={f} enter={6} taps={[{t: tapT, x: btn.x, y: btn.y}]} />
    </>
  );
};

const S4: SceneEl = ({f}) => {
  const tapT = T(11.35, 4);
  const fly = clamp((f - tapT - 2) / 16);
  const badge = useS(f, tapT + 18, {damping: 8, stiffness: 260});
  return (
    <>
      <Stage f={f} />
      <Label f={f} n={4} text="ضيف الجهاز للسلة" goldWord="للسلة" anim="scale" />
      <div style={{position: 'absolute', left: 230, top: 760, width: 620, opacity: 1 - fly, transform: `translate(${fly * 260}px, ${fly * -260}px) scale(${1 - fly * 0.75})`}}>
        <Img src={staticFile('shop/p17.png')} style={{width: '100%'}} />
      </div>
      <div style={{position: 'absolute', left: 140, top: 1480, width: 800, height: 140, borderRadius: 26, background: '#fff', border: '5px solid #1f6fd1',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, fontFamily: font.family, fontWeight: 900, fontSize: 58, color: '#1f6fd1',
        transform: `scale(${f >= tapT && f < tapT + 6 ? 0.95 : 1})`, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>أضف إلى السلة 🛒</div>
      <div style={{position: 'absolute', left: 760, top: 620}}>
        <svg width={160} height={160} viewBox="0 0 100 100"><path d="M10 20 H25 L38 70 H82 L92 35 H30" fill="none" stroke="#fff" strokeWidth={7} strokeLinejoin="round" />
          <circle cx={42} cy={84} r={7} fill="#fff" /><circle cx={78} cy={84} r={7} fill="#fff" /></svg>
        {f >= tapT + 18 ? <div style={{position: 'absolute', top: -6, right: -6, width: 70, height: 70, borderRadius: 35, background: gold, fontFamily: font.family, fontWeight: 900,
          fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${badge})`}}>1</div> : null}
      </div>
      <Cursor f={f} enter={0} taps={[{t: tapT, x: 540, y: 1550}]} />
    </>
  );
};

// cart_item.png 1086x942, cart_total.png 1086x918
const S5: SceneEl = ({f}) => {
  const W = 880, X = 100;
  const hiT = T(13.5, 5);
  return (
    <>
      <Stage f={f} burst={hiT} />
      <Label f={f} text="بالسلة الخصم ينزل مباشرة" goldWord="الخصم" anim="rise" />
      <Card f={f} src="howto/cart_item.png" w={W * 0.8} x={X + W * 0.1} y={640} from="up" out={hiT - 4} />
      <Card f={f} src="howto/cart_total.png" w={W} x={X} y={760} at={hiT - 14} from="down" />
      <Ring f={f} at={hiT + 4} x={X + 0.25 * W} y={760 + 0.04 * W * 918 / 1086 + 4} w={0.62 * W} h={80} />
      <Ring f={f} at={hiT + 22} x={X + 0.1 * W} y={760 + 0.20 * W * 918 / 1086} w={0.8 * W} h={96} />
    </>
  );
};

const S6: SceneEl = ({f}) => {
  const s = useS(f, 2, {damping: 12, stiffness: 140});
  const truck = interpolate(f, [8, 50], [-500, 330], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return (
    <>
      <Stage f={f} />
      <Label f={f} text="التوصيل مجاني" goldWord="مجاني" anim="scale" />
      <div style={{position: 'absolute', left: truck, top: 900}}>
        <svg width={420} height={300} viewBox="0 0 140 100">
          <rect x={4} y={20} width={84} height={56} rx={6} fill={gold} stroke="#000" strokeWidth={3} />
          <path d="M88 40 H116 L132 58 V76 H88 Z" fill="#fff" stroke="#000" strokeWidth={3} />
          <circle cx={30} cy={80} r={12} fill="#222" /><circle cx={110} cy={80} r={12} fill="#222" />
          <text x={46} y={54} fontSize={18} textAnchor="middle" fontFamily="Cairo" fontWeight={900}>JI FIRE</text>
        </svg>
      </div>
      <div style={{position: 'absolute', top: 1300, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${s})`}}>
        <Pill solid size={60}>لكل محافظات العراق</Pill>
      </div>
    </>
  );
};

// checkout_btn.png 960x192 ; sign-in card redrawn
const S7: SceneEl = ({f}) => {
  const tapT = T(18.5, 7);
  const s = useS(f, tapT + 6, {damping: 15, stiffness: 120});
  const digits = '07X XXX XXXX';
  const typed = digits.slice(0, Math.max(0, Math.floor((f - T(19.8, 7)) / 1.6)));
  return (
    <>
      <Stage f={f} />
      <Label f={f} n={5} text="إتمام الشراء وسجل رقمك" goldWord="رقمك" anim="slide" />
      <Card f={f} src="howto/checkout_btn.png" w={820} x={130} y={700} from="depth" out={tapT + 10} tilt={2} />
      {f >= tapT + 6 ? (
        <div style={{position: 'absolute', left: 110, top: 780, width: 860, borderRadius: 40, background: '#fff', padding: '50px 56px', direction: 'rtl',
          boxShadow: `0 40px 90px rgba(0,0,0,0.7), 0 0 0 3px ${gold}55`, transform: `scale(${0.7 + 0.3 * s}) translateY(${(1 - s) * 200}px)`, opacity: clamp(s * 2)}}>
          <div style={{fontFamily: font.family, fontWeight: 900, fontSize: 56, color: '#111'}}>تسجيل الدخول برمز التحقق</div>
          <div style={{fontFamily: font.family, fontWeight: 600, fontSize: 34, color: '#555', marginTop: 10}}>يوصلك رمز التحقق على الواتساب</div>
          <div style={{marginTop: 36, display: 'flex', gap: 18, direction: 'ltr'}}>
            <div style={{padding: '20px 26px', borderRadius: 20, border: '3px solid #ddd', fontFamily: font.family, fontWeight: 800, fontSize: 40}}>🇮🇶 +964</div>
            <div style={{flex: 1, padding: '20px 26px', borderRadius: 20, border: `4px solid ${gold}`, fontFamily: font.family, fontWeight: 800, fontSize: 44, color: '#111'}}>
              {typed}<span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0}}>|</span></div>
          </div>
          <div style={{marginTop: 30, padding: '22px 0', borderRadius: 22, background: '#1f6fd1', color: '#fff', textAlign: 'center', fontFamily: font.family, fontWeight: 900, fontSize: 46}}>إرسال رمز التحقق</div>
        </div>
      ) : null}
      {f < tapT + 8 ? <Cursor f={f} enter={0} taps={[{t: tapT, x: 540, y: 800}]} /> : null}
    </>
  );
};

const S8: SceneEl = ({f}) => {
  const box = interpolate(f, [6, 40], [-300, 380], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return (
    <>
      <Stage f={f} burst={40} />
      <Label f={f} text="ويوصلك لباب البيت" goldWord="البيت" anim="rise" />
      <svg width={520} height={560} viewBox="0 0 520 560" style={{position: 'absolute', left: 280, top: 760}}>
        <path d="M20 230 L260 40 L500 230 Z" fill="#2a2420" stroke={gold} strokeWidth={8} />
        <rect x={60} y={220} width={400} height={330} fill="#16130f" stroke={gold} strokeWidth={8} />
        <rect x={200} y={330} width={120} height={220} fill="#3b2a1c" stroke={gold} strokeWidth={6} />
        <circle cx={300} cy={445} r={8} fill={gold} />
      </svg>
      <div style={{position: 'absolute', left: box, top: 1200}}>
        <svg width={200} height={200} viewBox="0 0 100 100"><rect x={8} y={24} width={84} height={68} fill="#d7a35c" stroke="#000" strokeWidth={4} />
          <path d="M8 24 L50 8 L92 24" fill="#e6b877" stroke="#000" strokeWidth={4} /><rect x={42} y={24} width={16} height={68} fill={gold} /></svg>
      </div>
      {f > 42 ? <div style={{position: 'absolute', left: 640, top: 1150}}><Check f={f} at={42} size={160} /></div> : null}
    </>
  );
};

const S9: SceneEl = ({f}) => {
  const s = useS(f, T(25.0, 9), {damping: 10, stiffness: 150});
  return (
    <>
      <Stage f={f} burst={T(25.1, 9)} />
      <Label f={f} text="بس من تطبيق جي فاير" goldWord="جي" anim="blur" />
      <Card f={f} src="howto/banner.png" w={940} x={70} y={720} from="depth" tilt={4} />
      <div style={{position: 'absolute', top: 1110, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 24, direction: 'ltr'}}>
        <Pill size={44}>▶ Google Play</Pill><Pill size={44}> App Store</Pill>
      </div>
      <div style={{position: 'absolute', top: 1260, left: 0, right: 0, textAlign: 'center', transform: `scale(${0.5 + 0.5 * s})`, opacity: clamp(s * 2)}}>
        <span style={{fontFamily: font.family, fontWeight: 900, fontSize: 110, color: gold, textShadow: `0 0 40px ${gold}88`}}>خصم 25,000</span>
      </div>
      <div style={{position: 'absolute', top: 1410, left: 0, right: 0, textAlign: 'center', fontFamily: font.family, fontWeight: 800, fontSize: 36, color: '#fff', direction: 'ltr', opacity: 0.85}}>app.jifrephone.workers.dev</div>
    </>
  );
};

const SCENES: SceneEl[] = [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9];
type Trans = 'zoom' | 'slide' | 'blur' | 'iris' | 'up' | 'flip' | 'dolly';
const TRANS: Trans[] = ['zoom', 'slide', 'blur', 'iris', 'up', 'dolly', 'flip', 'blur', 'zoom'];
export const HOWTO_CUTS = CUTS.slice(1, -1).map((t, i) => ({at: t, type: TRANS[i]}));
const D = 12;
const tStyles = (t: Trans, p: number): {out: React.CSSProperties; in: React.CSSProperties} => {
  const q = ease(clamp(p));
  switch (t) {
    case 'zoom': return {out: {transform: `scale(${1 + q * 0.6})`, opacity: 1 - q}, in: {transform: `scale(${0.85 + 0.15 * q})`, opacity: clamp(q * 1.6)}};
    case 'slide': return {out: {transform: `translateX(${q * 1080}px)`}, in: {transform: `translateX(${(q - 1) * 1080}px)`}};
    case 'blur': return {out: {opacity: 1 - q, filter: `blur(${q * 16}px)`}, in: {opacity: q, filter: `blur(${(1 - q) * 16}px)`}};
    case 'iris': return {out: {}, in: {clipPath: `circle(${q * 120}% at 50% 50%)`}};
    case 'up': return {out: {transform: `translateY(${-q * 500}px)`, opacity: 1 - q}, in: {transform: `translateY(${(1 - q) * 1920}px)`}};
    case 'flip': return {out: {transform: `perspective(2200px) rotateY(${q * 90}deg)`, opacity: q < 0.5 ? 1 : 0}, in: {transform: `perspective(2200px) rotateY(${(q - 1) * 90}deg)`, opacity: q < 0.5 ? 0 : 1}};
    case 'dolly': return {out: {transform: `scale(${1 - q * 0.3})`, opacity: 1 - q}, in: {transform: `scale(${1.3 - 0.3 * q})`, opacity: q}};
  }
};
const Cam: React.FC<{local: number; len: number; children: React.ReactNode}> = ({local, len, children}) => (
  <AbsoluteFill style={{transform: `scale(${1 + 0.04 * ease(clamp(local / len))}) translate(${Math.sin(local / 45) * 5}px, ${Math.cos(local / 55) * 4}px)`}}>{children}</AbsoluteFill>
);
const Scene: React.FC<{i: number; f: number}> = ({i, f}) => {
  const a = fr(CUTS[i]), b = fr(CUTS[i + 1]);
  const El = SCENES[i];
  return <Cam local={f - a} len={b - a}><El f={f - a} /></Cam>;
};

export const HowTo: React.FC = () => {
  const f = useCurrentFrame();
  let idx = CUTS.findIndex((c, i) => f >= fr(c) && f < fr(CUTS[i + 1] ?? 1e9));
  if (idx < 0 || idx >= SCENES.length) idx = SCENES.length - 1;
  const from = fr(CUTS[idx]);
  const inT = idx > 0 && f < from + D;
  const st = inT ? tStyles(TRANS[idx - 1], (f - from) / D) : null;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {inT ? <AbsoluteFill style={st!.out}><Scene i={idx - 1} f={f} /></AbsoluteFill> : null}
      <AbsoluteFill style={st ? st.in : {}}><Scene i={idx} f={f} /></AbsoluteFill>
      {f < END_FROM ? <LogoBug /> : null}
      {f >= END_FROM ? <AbsoluteFill style={{opacity: clamp((f - END_FROM) / 12)}}><Sequence from={END_FROM} layout="none"><EndCard /></Sequence></AbsoluteFill> : null}
    </AbsoluteFill>
  );
};
