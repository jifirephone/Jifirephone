// Ji Fire — cartoon social explainer: traditional shopping (traffic, heat, crowds, delay)
// vs e-commerce (one button on our site → free delivery to your door). 2026-11-12.
// Own SVG cast (Person from Toon). Discount codes shown only "if available" (generic), no invented offer.
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color} from '../brand';
import {EndCard, LogoBug} from '../components/Brand';
import {Person} from './Toon';

const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
// timed to the owner's ElevenLabs take (voice = master clock); 2.4 s music-only pause for the order scene
const DUR = [1.15, 2.5, 4.7, 1.6, 1.6, 5.15, 3.35, 2.4, 2.1, 1.65, 4.7, 3.4];
const STARTS: number[] = [];
DUR.reduce((a, d, i) => { STARTS[i] = a; return a + d; }, 0);
const TOTAL = DUR.reduce((a, b) => a + b, 0);
export const VS_FRAMES = S(TOTAL);
const F = 'Cairo';
const GOLD = color.gold, GOLDD = color.goldDeep, W = color.white, INK = '#2a1c14';
const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const blinkAt = (f: number, seed = 0) => ((f + seed * 37) % 97) < 4;
const latin = (s: string) => <span style={{direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block'}}>{s}</span>;

const At: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <div style={{position: 'absolute', left: x, top: y}}>{children}</div>
);

const Caption: React.FC<{lf: number; children: React.ReactNode; red?: boolean; top?: number}> = ({lf, children, red, top}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf - 2, fps, config: {damping: 16}});
  return (
    <div style={{position: 'absolute', ...(top ? {top} : {bottom: 510}), left: 64, right: 64, textAlign: 'center', direction: 'rtl', fontFamily: F,
      fontWeight: 900, fontSize: 74, color: red ? '#ff5a4d' : W, opacity: a, transform: `translateY(${(1 - a) * 24}px)`,
      WebkitTextStroke: '9px rgba(0,0,0,0.9)', paintOrder: 'stroke fill', textShadow: '0 7px 0 rgba(0,0,0,0.3)'}}>{children}</div>
  );
};

// ---------- set pieces ----------
const Sun: React.FC<{lf: number}> = ({lf}) => (
  <div style={{position: 'absolute', left: 740, top: 150}}>
    <svg width="320" height="320" viewBox="0 0 320 320" style={{transform: `rotate(${lf * 1.2}deg)`}}>
      {[...Array(12)].map((_, i) => <rect key={i} x={154} y={6} width={12} height={54} rx={6} fill="#FFC93C" transform={`rotate(${i * 30} 160 160)`} />)}
    </svg>
    <div style={{position: 'absolute', left: 70, top: 70, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,#FFE066,#FFB020)', boxShadow: '0 0 60px #FFC93C'}} />
  </div>
);

const HeatWave: React.FC<{lf: number}> = ({lf}) => (
  <>{[0, 1, 2].map((i) => (
    <div key={i} style={{position: 'absolute', left: 300 + i * 160, top: 560, width: 70, height: 220, opacity: 0.25,
      background: 'linear-gradient(180deg,transparent,#fff,transparent)', filter: 'blur(6px)',
      transform: `translateX(${Math.sin(lf / 7 + i) * 14}px)`}} />))}</>
);

const Sweat: React.FC<{lf: number; x: number; y: number}> = ({lf, x, y}) => {
  const d = (lf % 40) / 40;
  return <div style={{position: 'absolute', left: x, top: y + d * 120, width: 16, height: 22, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: '#7fd3ff', opacity: 1 - d}} />;
};

const Car: React.FC<{color?: string; scale?: number}> = ({color = '#c0392b', scale = 1}) => (
  <svg width={260 * scale} height={150 * scale} viewBox="0 0 260 150">
    <rect x={20} y={60} width={220} height={54} rx={18} fill={color} stroke={INK} strokeWidth={5} />
    <path d="M60 60 Q80 24 130 24 Q180 24 198 60 Z" fill={color} stroke={INK} strokeWidth={5} />
    <rect x={80} y={34} width={46} height={26} rx={6} fill="#bfe3ff" stroke={INK} strokeWidth={4} />
    <rect x={134} y={34} width={46} height={26} rx={6} fill="#bfe3ff" stroke={INK} strokeWidth={4} />
    <circle cx={72} cy={118} r={26} fill="#222" stroke={INK} strokeWidth={5} /><circle cx={72} cy={118} r={9} fill="#888" />
    <circle cx={188} cy={118} r={26} fill="#222" stroke={INK} strokeWidth={5} /><circle cx={188} cy={118} r={9} fill="#888" />
  </svg>
);

const House: React.FC<{open?: number}> = ({open = 0}) => (
  <svg width="300" height="300" viewBox="0 0 300 300">
    <rect x={40} y={120} width={220} height={170} fill="#efe3c8" stroke={INK} strokeWidth={6} />
    <path d="M24 126 L150 40 L276 126 Z" fill="#c0392b" stroke={INK} strokeWidth={6} />
    <rect x={120} y={190} width={60} height={100} fill="#8a5a2b" stroke={INK} strokeWidth={5} transform={`skewY(${-open * 6})`} />
    <rect x={70} y={160} width={46} height={46} fill="#bfe3ff" stroke={INK} strokeWidth={5} />
    <rect x={184} y={160} width={46} height={46} fill="#bfe3ff" stroke={INK} strokeWidth={5} />
  </svg>
);

const Box: React.FC<{w?: number}> = ({w = 140}) => (
  <svg width={w} height={w} viewBox="0 0 140 140">
    <path d="M14 46 L70 20 L126 46 L70 72 Z" fill="#d9a441" stroke={INK} strokeWidth={5} />
    <path d="M14 46 L14 104 L70 130 L70 72 Z" fill="#c4902f" stroke={INK} strokeWidth={5} />
    <path d="M126 46 L126 104 L70 130 L70 72 Z" fill="#b07d22" stroke={INK} strokeWidth={5} />
    <path d="M70 72 L70 130 M40 58 L40 112" stroke="#F3B406" strokeWidth={6} />
  </svg>
);

const Wheel: React.FC<{cx: number; roll: number}> = ({cx, roll}) => (
  <g transform={`rotate(${roll} ${cx} 246)`}>
    <circle cx={cx} cy={246} r={46} fill="#1c1c1c" stroke={INK} strokeWidth={6} />
    <circle cx={cx} cy={246} r={24} fill="#d5d5da" stroke={INK} strokeWidth={4} />
    {[0, 60, 120].map((a) => <rect key={a} x={cx - 3} y={224} width={6} height={44} rx={3} fill="#8d8d95" transform={`rotate(${a} ${cx} 246)`} />)}
    <circle cx={cx} cy={246} r={7} fill={INK} />
  </g>
);

// Ji Fire delivery van (faces left), black-and-gold, full body
const Van: React.FC<{roll: number; moving: boolean; lf: number}> = ({roll, moving, lf}) => (
  <div style={{position: 'relative', width: 640, height: 300, transform: `translateY(${moving ? Math.sin(lf / 2) * 2 : 0}px)`}}>
    <svg width="640" height="300" viewBox="0 0 640 300" style={{overflow: 'visible'}}>
      <ellipse cx={320} cy={292} rx={300} ry={12} fill="rgba(0,0,0,0.25)" />
      {/* cargo box */}
      <rect x={196} y={36} width={418} height={198} rx={20} fill="#141216" stroke={INK} strokeWidth={6} />
      <rect x={196} y={170} width={418} height={30} fill={GOLD} />
      {/* cabin */}
      <path d="M200 66 L126 66 Q98 68 84 104 L56 150 Q34 158 34 180 L34 234 L200 234 Z" fill={GOLD} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M186 86 L130 86 Q112 88 102 110 L88 146 L186 146 Z" fill="#cfeaff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M150 90 L128 142" stroke="#fff" strokeWidth={6} opacity={0.7} />
      <path d="M196 150 L196 230" stroke={INK} strokeWidth={4} />
      <rect x={150} y={166} width={26} height={8} rx={4} fill={INK} />
      <rect x={30} y={178} width={18} height={24} rx={6} fill="#FFF3A8" stroke={INK} strokeWidth={4} />
      <rect x={596} y={150} width={14} height={30} rx={5} fill="#e74c3c" stroke={INK} strokeWidth={3} />
      <rect x={22} y={226} width={600} height={18} rx={9} fill="#2b2b31" stroke={INK} strokeWidth={4} />
      <Wheel cx={130} roll={roll} /><Wheel cx={500} roll={roll} />
      {moving ? [0, 1, 2].map((i) => <rect key={i} x={650 + i * 34 + (lf * 7) % 30} y={90 + i * 46} width={60 - i * 12} height={7} rx={3} fill="#fff" opacity={0.7} />) : null}
    </svg>
    <Img src={staticFile('logo.png')} style={{position: 'absolute', left: 335, top: 46, width: 150}} />
    <div style={{position: 'absolute', left: 196, top: 170, width: 418, height: 30, textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: 21, lineHeight: '30px', color: '#1b1405', direction: 'rtl'}}>توصيل مجاني لباب البيت</div>
  </div>
);

const Phone: React.FC<{lf: number; children?: React.ReactNode; scale?: number}> = ({lf, children, scale = 1}) => (
  <div style={{width: 360 * scale, height: 740 * scale, borderRadius: 48 * scale, background: '#0c0c0f', border: `${9 * scale}px solid #2b2b31`,
    boxShadow: '0 30px 60px rgba(0,0,0,0.5)', overflow: 'hidden', position: 'relative'}}>{children}</div>
);

// ---------- scenes ----------
const Title: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 13}});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#ff9a3c,#ffd27a 55%,#f2b35a)'}} />
      <Sun lf={lf} /><HeatWave lf={lf} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 360, background: 'linear-gradient(180deg,#caa26a,#b1824f)'}} />
      <At x={360} y={560}><div style={{transform: `scale(${0.9 + 0.1 * a})`}}><Person mood="worried" blink={blinkAt(lf)} skin="#E6B48C" /><Sweat lf={lf} x={300} y={600} /></div></At>
      <div style={{position: 'absolute', top: 250, left: 64, right: 64, textAlign: 'center', direction: 'rtl', fontFamily: F, fontWeight: 900,
        fontSize: 96, color: '#fff', opacity: a, WebkitTextStroke: '10px #3b2a1c', paintOrder: 'stroke fill'}}>التسوّق التقليدي... تعب!</div>
    </AbsoluteFill>
  );
};

const Traffic: React.FC<{lf: number}> = ({lf}) => {
  const jitter = Math.sin(lf / 3) * 3;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#ffb04a,#ffd98a 60%,#e9b366)'}} />
      <Sun lf={lf} /><HeatWave lf={lf} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 760, background: '#5b5450'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 300, height: 14, background: 'repeating-linear-gradient(90deg,#e8e0c8 0 90px,transparent 90px 170px)', opacity: 0.7}} />
      <At x={90} y={980 + jitter}><Car color="#2d6cdf" scale={1.1} /></At>
      <At x={430} y={1120 - jitter}><Car color="#c0392b" scale={1.1} /></At>
      <At x={660} y={1340 + jitter}><Car color="#2f9e53" scale={1.15} /></At>
      {/* angry honks */}
      <At x={240} y={930}><div style={{fontSize: 70, opacity: Math.abs(Math.sin(lf / 6))}}>💢</div></At>
      <Caption lf={lf} red>زحمة وحَر وانتظار</Caption>
    </AbsoluteFill>
  );
};

const CrowdShop: React.FC<{lf: number}> = ({lf}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#8a6f55,#6f5842)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 230, height: 150, background: '#241a12', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: F, fontWeight: 900, fontSize: 60, color: GOLD, direction: 'rtl'}}>زحمة بالمحل</div>
    {/* crowd of heads */}
    {[...Array(7)].map((_, i) => (
      <At key={i} x={60 + i * 150} y={760 + (i % 2) * 70 + Math.sin(lf / 8 + i) * 6}>
        <div style={{width: 120, height: 120, borderRadius: '50%', background: ['#E6B48C', '#caa06f', '#d9a98a'][i % 3], border: `5px solid ${INK}`}} />
      </At>
    ))}
    <At x={360} y={980}><Person mood="worried" blink={blinkAt(lf, 2)} /></At>
    <Caption lf={lf} red>تفتر وتنطر دورك</Caption>
  </AbsoluteFill>
);

const Pivot: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 12, stiffness: 150}});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 50% 30%,#2a2113,#140f08 60%,#070502)', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: F, fontWeight: 900, fontSize: 118, color: W, textAlign: 'center', direction: 'rtl', opacity: a,
        transform: `scale(${0.8 + 0.2 * a})`, WebkitTextStroke: '3px rgba(0,0,0,0.5)'}}>أكو <span style={{color: GOLD}}>حل أحسن!</span></div>
    </AbsoluteFill>
  );
};

const HomeRelax: React.FC<{lf: number}> = ({lf}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#3b3350,#2a2440)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 520, background: '#6b4e8a', opacity: 0.4}} />
    {/* sofa */}
    <div style={{position: 'absolute', left: 200, top: 1050, width: 680, height: 300, borderRadius: 40, background: '#C23B57', boxShadow: '0 20px 0 rgba(0,0,0,0.25)'}} />
    <div style={{position: 'absolute', left: 170, top: 980, width: 120, height: 320, borderRadius: 40, background: '#A82F49'}} />
    <At x={360} y={720}><Person mood="happy" phone blink={blinkAt(lf, 3)} /></At>
    <Caption lf={lf}>بالبيت ومرتاح 😌</Caption>
  </AbsoluteFill>
);

const BigPhone: React.FC<{children: React.ReactNode; k: number; dy: number}> = ({children, k, dy}) => (
  <div style={{width: 468, height: 962, marginTop: 24, transform: `translateY(${dy}px)`}}>
    <div style={{transform: `scale(${1.3 * k})`, transformOrigin: 'top center', width: 360, marginLeft: 54}}><Phone lf={0}>{children}</Phone></div>
  </div>
);

const AppBar: React.FC<{title?: string}> = ({title}) => (
  <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 62, background: '#fff', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', direction: 'rtl'}}>
    <Img src={staticFile('logo.png')} style={{height: 40}} />
    {title ? <div style={{fontFamily: F, fontWeight: 900, fontSize: 19, color: '#17150f'}}>{title}</div> : null}
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17150f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h2l2.4 11h10.2L20 7H6.2" /><circle cx="9" cy="19" r="1.4" /><circle cx="17" cy="19" r="1.4" /></svg>
  </div>
);

// product page rebuilt as a clean app screen (real product + price read from the store)
const AppProduct: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const pin = spring({frame: lf, fps, config: {damping: 15, stiffness: 95}});
  const img = spring({frame: lf - 8, fps, config: {damping: 14}});
  const info = spring({frame: lf - 18, fps, config: {damping: 15}});
  const tapT = (lf - 104) / 14;
  const tap = tapT > 0 && tapT < 1 ? Math.sin(tapT * Math.PI) : 0;
  const ring = Math.min(1, Math.max(0, (lf - 108) / 18));
  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 50% 25%,#2a2113,#120d07 60%,#060402)', alignItems: 'center'}}>
      <div style={{marginTop: 236, fontFamily: F, fontWeight: 900, fontSize: 68, color: W, direction: 'rtl', opacity: pin}}>بكبسة زر داخل <span style={{color: GOLD}}>التطبيق</span></div>
      <BigPhone k={0.9 + 0.1 * pin} dy={(1 - pin) * 60}>
        <AbsoluteFill style={{background: '#f6f6f8'}} />
        <AppBar />
        <div style={{position: 'absolute', top: 74, left: 12, right: 12, height: 300, borderRadius: 18, background: '#000', overflow: 'hidden'}}>
          <Img src={staticFile('disc25b/honor.jpg')} style={{width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${0.8 + 0.25 * img})`, opacity: img}} />
          <div style={{position: 'absolute', top: 12, right: 12, padding: '3px 12px', borderRadius: 8, background: '#e02b2b', color: '#fff', fontFamily: F, fontWeight: 900, fontSize: 14}}>NEW</div>
        </div>
        <div style={{position: 'absolute', top: 388, left: 16, right: 16, direction: 'rtl', opacity: info, transform: `translateY(${(1 - info) * 16}px)`}}>
          <div style={{fontFamily: F, fontWeight: 900, fontSize: 24, color: '#17150f', direction: 'ltr', textAlign: 'right'}}>HONOR X9e Pro 5G</div>
          <div style={{marginTop: 2, fontFamily: F, fontWeight: 900, fontSize: 25, color: GOLDD}}>يبدأ من {latin('639,000')} د.ع</div>
          <div style={{marginTop: 8, display: 'flex', gap: 8}}>
            {['256GB', '5G', '108MP'].map((c) => <span key={c} style={{padding: '4px 12px', borderRadius: 9, border: '1.5px solid #d9d9df', background: '#fff', fontFamily: F, fontWeight: 800, fontSize: 15, color: '#17150f', direction: 'ltr'}}>{c}</span>)}
          </div>
          <div style={{marginTop: 12, padding: '9px 12px', borderRadius: 12, background: '#fff8e1', border: `1.5px solid ${GOLD}`, fontFamily: F, fontWeight: 800, fontSize: 16, color: '#5a4300'}}>🚚 توصيل مجاني لكل المحافظات</div>
        </div>
        <div style={{position: 'absolute', left: 16, right: 16, bottom: 26, height: 62, borderRadius: 16, transform: `scale(${1 - 0.06 * tap})`,
          background: `linear-gradient(135deg,#FFD966,${GOLD})`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: F, fontWeight: 900, fontSize: 24, color: '#2a1f05', boxShadow: `0 0 ${10 + tap * 30}px rgba(243,180,6,0.9)`}}>اشترِ الآن</div>
        {lf > 100 ? <div style={{position: 'absolute', left: 150, bottom: 28, width: 58, height: 58, borderRadius: '50%', border: '4px solid #fff', background: 'rgba(255,255,255,0.35)', opacity: 1 - ring, transform: `scale(${0.6 + ring * 1.4})`}} /> : null}
      </BigPhone>
      <Caption lf={lf} top={1336}>اختار اللي يعجبك واكبس</Caption>
    </AbsoluteFill>
  );
};

const StepRow: React.FC<{lf: number; at: number; label: string; value: string}> = ({lf, at, label, value}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf - at, fps, config: {damping: 12, stiffness: 150}});
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 14, background: '#fff', border: '1.5px solid #ececf0', marginTop: 9, direction: 'rtl'}}>
      <div style={{width: 30, height: 30, borderRadius: '50%', background: a > 0.05 ? '#1fa855' : '#e4e4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.7 + 0.3 * a})`}}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{opacity: a}}><path d="M4 12l5 5L20 6" /></svg>
      </div>
      <div style={{flex: 1, fontFamily: F, fontWeight: 900, fontSize: 18, color: '#17150f'}}>{label}</div>
      <div style={{fontFamily: F, fontWeight: 800, fontSize: 16, color: '#7a7a85'}}>{value}</div>
    </div>
  );
};

// completing the order
const OrderDone: React.FC<{lf: number}> = ({lf: raw}) => {
  const lf = raw * 1.3;
  const {fps} = useVideoConfig();
  const pin = spring({frame: lf, fps, config: {damping: 16}});
  const done = spring({frame: lf - 62, fps, config: {damping: 11, stiffness: 130}});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 50% 25%,#2a2113,#120d07 60%,#060402)', alignItems: 'center'}}>
      <div style={{marginTop: 236, height: 96}} />
      <BigPhone k={0.94 + 0.06 * pin} dy={0}>
        <AbsoluteFill style={{background: '#f6f6f8'}} />
        <AppBar title="إتمام الطلب" />
        <div style={{position: 'absolute', top: 76, left: 12, right: 12}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 16, background: '#fff', border: '1.5px solid #ececf0', direction: 'rtl'}}>
            <div style={{width: 74, height: 74, borderRadius: 12, background: '#000', overflow: 'hidden'}}><Img src={staticFile('disc25b/honor.jpg')} style={{width: '100%', height: '100%', objectFit: 'contain'}} /></div>
            <div style={{flex: 1}}>
              <div style={{fontFamily: F, fontWeight: 900, fontSize: 18, color: '#17150f', direction: 'ltr', textAlign: 'right'}}>HONOR X9e Pro 5G</div>
              <div style={{fontFamily: F, fontWeight: 800, fontSize: 15, color: '#7a7a85'}}>الكمية: 1</div>
            </div>
          </div>
          <StepRow lf={lf} at={12} label="السلة" value="جاهزة" />
          <StepRow lf={lf} at={28} label="عنوان التوصيل" value="باب البيت" />
          <StepRow lf={lf} at={44} label="التوصيل" value="مجاني" />
        </div>
        <div style={{position: 'absolute', left: 12, right: 12, bottom: 22, height: 250, borderRadius: 20, background: '#fff', border: `2px solid ${GOLD}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: done, transform: `scale(${0.85 + 0.15 * done})`}}>
          <div style={{width: 96, height: 96, borderRadius: '50%', background: '#1fa855', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${done})`}}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
          </div>
          <div style={{marginTop: 12, fontFamily: F, fontWeight: 900, fontSize: 27, color: '#17150f', direction: 'rtl'}}>تم الطلب بنجاح</div>
          <div style={{fontFamily: F, fontWeight: 800, fontSize: 17, color: '#7a7a85', direction: 'rtl'}}>طلبك بالطريق إلك</div>
        </div>
      </BigPhone>
      <Caption lf={lf} top={1336}>وكمّل طلبك بثواني</Caption>
    </AbsoluteFill>
  );
};

const CodeStep: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 15}});
  const chk = spring({frame: lf - 22, fps, config: {damping: 11, stiffness: 140}});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 50% 30%,#2a2113,#120d07 60%,#060402)', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 760, padding: '40px 36px', borderRadius: 28, background: '#FFFDF6', border: `3px dashed ${GOLDD}`, textAlign: 'center',
        opacity: a, transform: `scale(${0.9 + 0.1 * a})`, direction: 'rtl'}}>
        <div style={{fontFamily: F, fontSize: 36, fontWeight: 800, color: '#9a7b2e'}}>إذا أكو كود خصم</div>
        <div style={{marginTop: 10, fontFamily: F, fontSize: 70, fontWeight: 900, color: '#17150f'}}>حطّه ← يتطبّق فوراً</div>
      </div>
      <div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{width: 74, height: 74, borderRadius: '50%', background: `linear-gradient(135deg,#FFD966,${GOLD})`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${chk})`}}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#2a1f05" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
        </div>
        <div style={{fontFamily: F, fontWeight: 900, fontSize: 48, color: W, opacity: chk}}>السعر ينزل</div>
      </div>
      <Caption lf={lf}>وإذا أكو كود، يتطبّق</Caption>
    </AbsoluteFill>
  );
};

const Deliver: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const t = ease(Math.min(1, lf / 44));
  const x = 1120 - t * 790;
  const moving = lf < 44;
  const box = spring({frame: lf - 46, fps, config: {damping: 11, stiffness: 140}});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#7cc8ff,#d8f1ff 62%)'}} />
      {[0, 1].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 520 + Math.sin(lf / 40 + i) * 14, top: 560 + i * 90, width: 230, height: 70, borderRadius: 40, background: '#fff', opacity: 0.9}} />)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1330, height: 90, background: '#6fbf5a'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1400, bottom: 0, background: '#55504c'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1600, height: 14, background: 'repeating-linear-gradient(90deg,#e8e0c8 0 90px,transparent 90px 170px)', opacity: 0.7}} />
      <div style={{position: 'absolute', left: 6, top: 1062, transform: 'scale(1.2)', transformOrigin: 'top left'}}><House open={box} /></div>
      <div style={{position: 'absolute', left: x, top: 1075, transform: 'scale(1.15)', transformOrigin: 'top left'}}><Van roll={-(1120 - x) * 0.9} moving={moving} lf={lf} /></div>
      <div style={{position: 'absolute', left: 236, top: 1284, transform: `scale(${box})`, transformOrigin: 'bottom center'}}><Box w={130} /></div>
      <Caption lf={lf} top={400}>ويوصلك لباب بيتك</Caption>
    </AbsoluteFill>
  );
};

const FreeDelivery: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 12, stiffness: 120}});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 50% 35%,#2a2113,#120d07 60%,#060402)', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'inline-block', padding: '30px 52px', borderRadius: 30, background: `linear-gradient(135deg,#FFE79A,${GOLD} 55%,${GOLDD})`,
        transform: `scale(${a})`, boxShadow: '0 20px 50px rgba(243,180,6,0.4)'}}>
        <div style={{fontFamily: F, fontWeight: 900, fontSize: 92, color: '#1b1405', direction: 'rtl'}}>توصيل مجاني</div>
      </div>
      <div style={{marginTop: 22, fontFamily: F, fontWeight: 900, fontSize: 44, color: W, direction: 'rtl', opacity: a}}>لكل محافظات العراق</div>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 15}});
  const p = spring({frame: lf - 14, fps, config: {damping: 15}});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 50% 30%,#2a2113,#120d07 60%,#060402)', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{fontFamily: F, fontWeight: 900, fontSize: 84, color: W, direction: 'rtl', opacity: a, transform: `translateY(${(1 - a) * 40}px)`}}>
        تسوّق <span style={{color: GOLD}}>بكل راحة</span>
      </div>
      <div style={{marginTop: 34, display: 'flex', gap: 20, opacity: p, transform: `translateY(${(1 - p) * 26}px)`}}>
        <div style={{padding: '18px 30px', borderRadius: 18, background: `linear-gradient(135deg,#FFD966,${GOLD})`, fontFamily: F, fontSize: 40, fontWeight: 900, color: '#2a1f05'}}>التطبيق</div>
        <div style={{padding: '18px 30px', borderRadius: 18, background: 'rgba(255,255,255,0.1)', border: '1.6px solid rgba(255,255,255,0.3)', fontFamily: F, fontSize: 40, fontWeight: 900, color: W}}>أو الموقع</div>
      </div>
    </AbsoluteFill>
  );
};

const SCENES = [Title, Traffic, CrowdShop, Pivot, HomeRelax, AppProduct, CodeStep, OrderDone, Deliver, FreeDelivery, Cta];

export const VsReel: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  let idx = 0;
  for (let i = 0; i < DUR.length; i++) { if (sec >= STARTS[i]) idx = i; }
  const isEnd = idx === DUR.length - 1;
  const lf = f - S(STARTS[idx]);
  const enterP = Math.min(1, lf / S(0.2));
  const fade = ease(enterP);

  return (
    <AbsoluteFill style={{background: color.black}}>
      {isEnd ? <EndCard /> : (
        <>
          <AbsoluteFill style={{opacity: fade}}>{React.createElement(SCENES[idx], {lf})}</AbsoluteFill>
          {idx !== 0 && idx !== 2 && idx !== 5 && <LogoBug />}
        </>
      )}
    </AbsoluteFill>
  );
};
