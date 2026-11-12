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
const DUR = [2.6, 3.4, 3.2, 2.0, 2.8, 3.8, 3.0, 3.4, 2.4, 3.0, 3.4];
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

const Caption: React.FC<{lf: number; children: React.ReactNode; red?: boolean}> = ({lf, children, red}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf - 2, fps, config: {damping: 16}});
  return (
    <div style={{position: 'absolute', bottom: 510, left: 64, right: 64, textAlign: 'center', direction: 'rtl', fontFamily: F,
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

const Scooter: React.FC<{lf: number}> = ({lf}) => (
  <svg width="420" height="240" viewBox="0 0 420 240">
    <circle cx={90} cy={190} r={40} fill="#222" stroke={INK} strokeWidth={6} /><circle cx={90} cy={190} r={13} fill="#999" />
    <circle cx={330} cy={190} r={40} fill="#222" stroke={INK} strokeWidth={6} /><circle cx={330} cy={190} r={13} fill="#999" />
    <path d="M90 190 L210 190 L250 120 L150 120 Z" fill="#F3B406" stroke={INK} strokeWidth={6} />
    <rect x={150} y={70} width={120} height={70} rx={12} fill="#141216" stroke={INK} strokeWidth={6} />
    <path d="M250 120 L330 190" stroke={INK} strokeWidth={10} strokeLinecap="round" />
    <path d="M250 120 L300 80" stroke={INK} strokeWidth={10} strokeLinecap="round" />
    {[...Array(3)].map((_, i) => <rect key={i} x={-20 - i * 30 - (lf * 6) % 40} y={150 + i * 14} width={26} height={5} rx={2} fill="#fff" opacity={0.5} />)}
  </svg>
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
    <Caption lf={lf} red>تدز وتنطر دورك</Caption>
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

const ButtonSite: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const pin = spring({frame: lf, fps, config: {damping: 15, stiffness: 95}});
  const tap = Math.max(0, Math.sin((lf - 30) / FPS * 7)) * interpolate(lf, [30, 42], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const press = 1 - 0.08 * tap;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 50% 25%,#2a2113,#120d07 60%,#060402)', alignItems: 'center'}}>
      <div style={{marginTop: 270, fontFamily: F, fontWeight: 900, fontSize: 70, color: W, direction: 'rtl', opacity: pin}}>بكبسة زر داخل <span style={{color: GOLD}}>موقعنا</span></div>
      <div style={{marginTop: 40, transform: `translateY(${(1 - pin) * 60}px) scale(${pin})`}}>
        <Phone lf={lf}>
          <Img src={staticFile('disc25b/honor_page.jpg')} style={{position: 'absolute', top: -120, left: 0, width: 360}} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg,transparent 55%,rgba(0,0,0,0.5))'}} />
          {/* glowing buy button */}
          <div style={{position: 'absolute', left: 40, right: 40, bottom: 70, height: 96, borderRadius: 22, transform: `scale(${press})`,
            background: `linear-gradient(135deg,#FFD966,${GOLD})`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F, fontWeight: 900, fontSize: 40, color: '#2a1f05', boxShadow: `0 0 ${20 + tap * 40}px rgba(243,180,6,0.8)`}}>اشترِ الآن</div>
          {/* finger */}
          <div style={{position: 'absolute', left: 230, bottom: 20 + tap * 20, fontSize: 90, transform: 'rotate(-10deg)'}}>👆</div>
        </Phone>
      </div>
      <Caption lf={lf}>اختار اللي يعجبك واكبس</Caption>
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
  const x = interpolate(lf, [0, 60], [1180, 360], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#2a2440,#4a3f63)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 520, background: '#4a4440'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 300, height: 14, background: 'repeating-linear-gradient(90deg,#e8e0c8 0 90px,transparent 90px 170px)', opacity: 0.6}} />
      <At x={560} y={980}><House /></At>
      <At x={x} y={1120}><Scooter lf={lf} /></At>
      <Caption lf={lf}>ويوصلك لباب البيت</Caption>
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

const SCENES = [Title, Traffic, CrowdShop, Pivot, HomeRelax, ButtonSite, CodeStep, Deliver, FreeDelivery, Cta];

export const VsReel: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  let idx = 0;
  for (let i = 0; i < DUR.length; i++) { if (sec >= STARTS[i]) idx = i; }
  const isEnd = idx === DUR.length - 1;
  const lf = f - S(STARTS[idx]);
  const enterP = Math.min(1, lf / S(0.4));
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
