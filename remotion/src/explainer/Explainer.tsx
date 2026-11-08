// Ji Fire explainer (2026-11-08): a story cartoon "close to reality", cut to the owner's ElevenLabs voiceover.
// Our own cast (Toon.tsx), the real storefront cartoonised from brand/storefront.jpg, brand black/gold boards,
// word-by-word captions, a camera push on every scene and a different soft transition (with its own sound) at every cut.
// Technique from the owner's TikTok reference (refs/ref4_tiktok.mp4), never its characters or art.
import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EndCard, LogoBug} from '../components/Brand';
import {color, font} from '../brand';
import {Person} from './Toon';
import caps from './captions.json';

const FPS = 30;
const gold = color.gold;
const ink = '#2a1c14';
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const fr = (s: number) => Math.round(s * FPS);

// scene cuts sit in the real pauses of the voiceover (silencedetect), video time = VO + 0.1 s
const CUTS = [0, 2.96, 5.97, 8.12, 10.63, 14.6, 17.32, 19.47, 23.24, 26.6, 28.26, 32.25, 33.77, 36.15, 39.4];
const END_FROM = fr(39.4);
export const EXPLAINER_FRAMES = fr(42.6);

// ---------- shared bits ----------
const useS = (f: number, at: number, cfg = {damping: 12, stiffness: 170}) => {
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: cfg});
};
const blinkAt = (f: number, seed = 0) => ((f + seed * 37) % 97) < 4;

const Board: React.FC<{f: number; at: number; lines: string[]; goldLine?: number; tilt?: number; w?: number; size?: number; red?: boolean}> = (
  {f, at, lines, goldLine, tilt = -3, w = 700, size = 84, red = true}) => {
  const s = useS(f, at, {damping: 10, stiffness: 160});
  if (f < at) return null;
  return (
    <div style={{width: w, padding: '22px 26px', background: '#FFF7E3', border: '10px solid #3b2a1c', borderRadius: 20, direction: 'rtl', textAlign: 'center',
      boxShadow: '0 16px 0 rgba(0,0,0,0.22)', transform: `rotate(${tilt + Math.sin(f / 20) * 0.6}deg) scale(${0.3 + 0.7 * s})`, opacity: clamp(s * 2)}}>
      {lines.map((l, i) => (
        <div key={i} style={{fontFamily: font.family, fontWeight: 900, fontSize: size, lineHeight: 1.15, color: i === goldLine ? '#000' : red ? '#b8322a' : '#1a1a1a',
          background: i === goldLine ? gold : 'transparent', borderRadius: 14, padding: i === goldLine ? '0 16px' : 0, marginTop: i ? 8 : 0}}>{l}</div>
      ))}
    </div>
  );
};

const At: React.FC<{x: number; y: number; children: React.ReactNode; z?: number}> = ({x, y, children, z}) => (
  <div style={{position: 'absolute', left: x, top: y, zIndex: z}}>{children}</div>
);
const Center: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', top: y, left: 64, right: 230, display: 'flex', justifyContent: 'center'}}>{children}</div>
);

const Pop: React.FC<{f: number; at: number; children: React.ReactNode; from?: 'up' | 'down' | 'scale'}> = ({f, at, children, from = 'scale'}) => {
  const s = useS(f, at, {damping: 11, stiffness: 190});
  if (f < at) return null;
  const t = from === 'up' ? `translateY(${(1 - s) * -120}px)` : from === 'down' ? `translateY(${(1 - s) * 160}px)` : `scale(${0.2 + 0.8 * s})`;
  return <div style={{transform: t, opacity: clamp(s * 2)}}>{children}</div>;
};

// Our studio wall: warm cream with a black-and-gold tile band (brand colours, not the reference's tiles).
const Wall: React.FC<{tone?: string}> = ({tone = '#F4EAD4'}) => (
  <AbsoluteFill style={{background: tone}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1150, bottom: 0,
      backgroundImage: `linear-gradient(45deg, #1d1a17 25%, transparent 25%, transparent 75%, #1d1a17 75%), linear-gradient(45deg, #1d1a17 25%, #d9a521 25%, #d9a521 75%, #1d1a17 75%)`,
      backgroundSize: '120px 120px', backgroundPosition: '0 0, 60px 60px', opacity: 0.9}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1130, height: 26, background: '#3b2a1c'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1560, bottom: 0, background: 'linear-gradient(180deg,#8a6a4c,#5d452f)'}} />
  </AbsoluteFill>
);

// ---------- props ----------
const House: React.FC<{open?: number}> = ({open = 0}) => (
  <svg width={520} height={560} viewBox="0 0 520 560">
    <path d="M20 230 L260 40 L500 230 Z" fill="#b8322a" stroke={ink} strokeWidth={8} />
    <rect x={60} y={220} width={400} height={330} fill="#F1DDB5" stroke={ink} strokeWidth={8} />
    <rect x={90} y={280} width={110} height={100} fill="#9fd3f0" stroke={ink} strokeWidth={6} />
    <rect x={300} y={330} width={120} height={220} fill="#3b2a1c" stroke={ink} strokeWidth={6} />
    <rect x={300} y={330} width={120 * (1 - open * 0.8)} height={220} fill="#7a4e2a" stroke={ink} strokeWidth={6} />
    <circle cx={300 + 120 * (1 - open * 0.8) - 18} cy={445} r={7} fill={gold} />
  </svg>
);

const Box: React.FC<{w?: number}> = ({w = 150}) => (
  <svg width={w} height={w} viewBox="0 0 100 100">
    <rect x={8} y={24} width={84} height={68} fill="#d7a35c" stroke={ink} strokeWidth={5} />
    <path d="M8 24 L50 8 L92 24" fill="#e6b877" stroke={ink} strokeWidth={5} />
    <rect x={42} y={24} width={16} height={68} fill={gold} />
    <text x={50} y={70} fontSize={14} textAnchor="middle" fontFamily="Cairo" fontWeight={900} fill="#000">JI</text>
  </svg>
);

const Scooter: React.FC<{f: number}> = ({f}) => {
  const wheel = f * 18;
  return (
    <svg width={520} height={420} viewBox="0 0 520 420" style={{overflow: 'visible'}}>
      <rect x={300} y={120} width={150} height={130} rx={12} fill="#141216" stroke={ink} strokeWidth={6} />
      <text x={375} y={200} fontSize={44} textAnchor="middle" fontFamily="Cairo" fontWeight={900} fill={gold}>جي فاير</text>
      <path d="M90 300 L170 300 L210 220 L320 250 L400 300 L440 300" fill="none" stroke="#b8322a" strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 300 L120 170 L80 160" fill="none" stroke="#333" strokeWidth={12} strokeLinecap="round" />
      {[110, 420].map((cx) => (
        <g key={cx} transform={`rotate(${wheel} ${cx} 330)`}>
          <circle cx={cx} cy={330} r={58} fill="#222" stroke={ink} strokeWidth={6} />
          <circle cx={cx} cy={330} r={22} fill="#bbb" /><path d={`M${cx - 40} 330 L${cx + 40} 330`} stroke="#bbb" strokeWidth={6} />
        </g>
      ))}
      {/* rider */}
      <path d="M230 210 L210 120 Q240 70 280 120 L290 220 Z" fill="#141216" stroke={ink} strokeWidth={6} />
      <circle cx={245} cy={70} r={48} fill="#E6B48C" stroke={ink} strokeWidth={6} />
      <path d="M195 60 Q245 0 295 60 L295 45 Q245 -10 195 45 Z" fill={gold} stroke={ink} strokeWidth={5} />
      <path d="M215 140 L130 170" stroke="#141216" strokeWidth={26} strokeLinecap="round" />
      <circle cx={232} cy={70} r={6} fill={ink} /><path d="M225 92 Q240 104 255 92" stroke={ink} strokeWidth={5} fill="none" />
    </svg>
  );
};

const Icon: React.FC<{kind: 'phone' | 'acc' | 'repair' | 'sim'; label: string; f: number; at: number}> = ({kind, label, f, at}) => {
  const s = useS(f, at, {damping: 9, stiffness: 200});
  if (f < at) return <div style={{width: 360, height: 300}} />;
  const d = {
    phone: <><rect x={32} y={8} width={36} height={84} rx={8} fill="#141216" stroke={ink} strokeWidth={5} /><rect x={38} y={18} width={24} height={60} rx={3} fill={gold} /></>,
    acc: <><path d="M20 60 V48 A30 30 0 0 1 80 48 V60" fill="none" stroke="#141216" strokeWidth={9} /><rect x={12} y={56} width={18} height={30} rx={6} fill={gold} stroke={ink} strokeWidth={4} /><rect x={70} y={56} width={18} height={30} rx={6} fill={gold} stroke={ink} strokeWidth={4} /></>,
    repair: <><path d="M25 80 L60 45" stroke="#141216" strokeWidth={12} strokeLinecap="round" /><circle cx={68} cy={34} r={18} fill="none" stroke="#141216" strokeWidth={10} /><path d="M58 24 L80 46" stroke="#FFF7E3" strokeWidth={10} /><circle cx={28} cy={78} r={8} fill={gold} /></>,
    sim: <><path d="M28 10 H62 L76 24 V90 H28 Z" fill={gold} stroke={ink} strokeWidth={5} /><rect x={38} y={44} width={28} height={30} rx={4} fill="#c9c9c9" stroke={ink} strokeWidth={4} /></>,
  }[kind];
  return (
    <div style={{width: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${0.3 + 0.7 * s}) rotate(${(1 - s) * -20}deg)`, opacity: clamp(s * 2)}}>
      <div style={{width: 210, height: 210, borderRadius: 40, background: '#FFF7E3', border: '8px solid #3b2a1c', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 0 rgba(0,0,0,0.25)'}}>
        <svg width={150} height={150} viewBox="0 0 100 100">{d}</svg>
      </div>
      <div style={{marginTop: 10, fontFamily: font.family, fontWeight: 900, fontSize: 62, color: '#fff', WebkitTextStroke: '8px #000', paintOrder: 'stroke fill'}}>{label}</div>
    </div>
  );
};

const Store: React.FC<{f: number; x0: number; x1: number; w: number; y?: number}> = ({f, x0, x1, w, y = 330}) => {
  const h = w * 0.75;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #070a1c 0%, #121a3a 45%, #1b1f33 70%)'}}>
      {[...Array(36)].map((_, i) => <div key={i} style={{position: 'absolute', left: (i * 263) % 1080, top: 40 + ((i * 97) % 300), width: 4, height: 4,
        borderRadius: 2, background: '#fff', opacity: 0.25 + 0.5 * Math.abs(Math.sin(f / 12 + i))}} />)}
      <div style={{position: 'absolute', left: 0, right: 0, top: y + h - 160, bottom: 0, background: 'linear-gradient(180deg,#5b5450,#3a3431)'}} />
      <Img src={staticFile('explainer/store_toon.jpg')} style={{position: 'absolute', width: w, height: h, left: interpolate(f, [0, 120], [x0, x1], {extrapolateRight: 'clamp'}), top: y,
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 6%, #000 88%, transparent 100%)'}} />
    </AbsoluteFill>
  );
};

const Coins: React.FC<{f: number; at: number}> = ({f, at}) => (
  <div style={{display: 'flex', gap: 18, alignItems: 'flex-end'}}>
    {[0, 1, 2].map((k) => {
      const s = useS(f, at + k * 4, {damping: 10, stiffness: 200});
      return f < at + k * 4 ? <div key={k} style={{width: 150}} /> : (
        <div key={k} style={{width: 150, height: 90 + k * 50, transform: `translateY(${(1 - s) * -300}px)`, opacity: clamp(s * 2),
          background: 'repeating-linear-gradient(180deg,#2e7d32 0 18px,#1b5e20 18px 22px)', border: `6px solid ${ink}`, borderRadius: 10}} />
      );
    })}
  </div>
);

// ---------- scenes (f = frames since the scene start) ----------
type SceneEl = React.FC<{f: number}>;
const T = (sec: number, scene: number) => fr(sec) - fr(CUTS[scene]); // absolute video second -> local frame of scene

const S1: SceneEl = ({f}) => (
  <>
    <Wall />
    <Center y={300}><Board f={f} at={2} lines={['موبايل', 'بالقسط']} goldLine={1} w={640} size={104} /></Center>
    <At x={90} y={980}><Pop f={f} at={T(1.1, 0)} from="up"><House /></Pop></At>
    <At x={600} y={1040}><Person mood="happy" phone blink={blinkAt(f)} wave={14} scale={0.95} /></At>
  </>
);

const S2: SceneEl = ({f}) => {
  const bubble = useS(f, T(4.9, 1));
  return (
    <>
      <AbsoluteFill style={{background: '#cfe0ea'}}>
        <div style={{position: 'absolute', left: 120, top: 420, width: 300, height: 360, background: '#9fd3f0', border: `12px solid #f5f5f5`, boxShadow: `0 0 0 8px ${ink}`}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1450, bottom: 0, background: '#b08b62'}} />
        <div style={{position: 'absolute', left: 40, top: 1180, width: 640, height: 300, background: '#6d4c8a', borderRadius: 40, border: `8px solid ${ink}`}} />
      </AbsoluteFill>
      <At x={340} y={900}><Person mood="smile" phone crackedPhone blink={blinkAt(f, 1)} scale={1.0} /></At>
      <At x={360} y={760}><Pop f={f} at={T(3.9, 1)}><div style={{padding: '8px 30px', background: gold, border: `6px solid ${ink}`, borderRadius: 16,
        fontFamily: font.family, fontWeight: 900, fontSize: 64}}>حيدر</div></Pop></At>
      {f >= T(4.9, 1) ? (
        <At x={560} y={330}>
          <div style={{transform: `scale(${bubble})`, transformOrigin: '20% 100%', width: 360, height: 360, borderRadius: '50%', background: '#fff', border: `8px solid ${ink}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Img src={staticFile('shop/p17.png')} style={{width: 230, transform: `rotate(${Math.sin(f / 10) * 6}deg)`}} />
          </div>
          <div style={{position: 'absolute', left: 10, top: 360, width: 50, height: 50, borderRadius: '50%', background: '#fff', border: `6px solid ${ink}`}} />
        </At>
      ) : null}
    </>
  );
};

const S3: SceneEl = ({f}) => {
  const fall = (k: number) => clamp((f - T(6.9, 2) - k * 6) / 24);
  return (
    <>
      <Wall tone="#EADFCB" />
      <Center y={300}><Board f={f} at={T(7.3, 2)} lines={['كاش؟', 'ما يكفي']} goldLine={0} tilt={4} w={560} size={100} /></Center>
      <At x={300} y={950}><Person mood="worried" blink={blinkAt(f, 2)} scale={1.0} /></At>
      {/* empty wallet */}
      <At x={640} y={1180}><Pop f={f} at={T(6.3, 2)}>
        <svg width={260} height={180} viewBox="0 0 260 180"><rect x={10} y={30} width={240} height={140} rx={20} fill="#6b3e1f" stroke={ink} strokeWidth={8} />
          <path d="M10 70 H250" stroke={ink} strokeWidth={6} /><circle cx={210} cy={100} r={12} fill={gold} /></svg>
      </Pop></At>
      {[0, 1].map((k) => f > T(6.9, 2) ? <At key={k} x={700 + k * 70} y={1150 + fall(k) * 420}><div style={{width: 110, height: 56, background: '#2e7d32', border: `5px solid ${ink}`,
        transform: `rotate(${fall(k) * 140 + k * 30}deg)`, opacity: 1 - fall(k) * 0.6}} /></At> : null)}
    </>
  );
};

const S4: SceneEl = ({f}) => {
  const walk = clamp(f / 60);
  return (
    <>
      <Store f={f} x0={-120} x1={-300} w={1500} />
      <Center y={250}><Pop f={f} at={T(9.7, 3)} from="up"><div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 34px', background: '#FFF7E3',
        border: `8px solid ${ink}`, borderRadius: 999, direction: 'rtl', fontFamily: font.family, fontWeight: 900, fontSize: 66}}>
        <svg width={60} height={60} viewBox="0 0 100 100"><path d="M50 92 C50 92 18 58 18 38 A32 32 0 0 1 82 38 C82 58 50 92 50 92 Z" fill="#b8322a" /><circle cx={50} cy={38} r={12} fill="#fff" /></svg>
        النجف</div></Pop></Center>
      <At x={-300 + walk * 520} y={1180 + Math.abs(Math.sin(f / 4)) * -16}><Person mood="smile" blink={blinkAt(f, 3)} scale={0.85} /></At>
    </>
  );
};

const S5: SceneEl = ({f}) => (
  <>
    <Store f={f} x0={-330} x1={-380} w={1700} y={260} />
    <AbsoluteFill style={{background: 'rgba(0,0,0,0.35)'}} />
    <div style={{position: 'absolute', top: 500, left: 0, right: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', rowGap: 40, direction: 'rtl'}}>
      <Icon kind="phone" label="أجهزة" f={f} at={T(11.48, 4)} />
      <Icon kind="acc" label="اكسسوارات" f={f} at={T(12.1, 4)} />
      <Icon kind="repair" label="صيانة" f={f} at={T(13.14, 4)} />
      <Icon kind="sim" label="خطوط" f={f} at={T(13.74, 4)} />
    </div>
  </>
);

const Tick: React.FC<{f: number; at: number; text: string}> = ({f, at, text}) => {
  const s = useS(f, at, {damping: 10, stiffness: 180});
  if (f < at) return <div style={{height: 150}} />;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 24, direction: 'rtl', padding: '18px 40px', background: '#FFF7E3', border: `8px solid ${ink}`, borderRadius: 26,
      transform: `translateX(${(1 - s) * 400}px)`, opacity: clamp(s * 2), boxShadow: '0 12px 0 rgba(0,0,0,0.22)'}}>
      <svg width={90} height={90} viewBox="0 0 100 100"><circle cx={50} cy={50} r={46} fill={gold} stroke={ink} strokeWidth={6} />
        <path d="M26 52 L44 70 L76 34" fill="none" stroke="#000" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - clamp((f - at - 4) / 10))} /></svg>
      <span style={{fontFamily: font.family, fontWeight: 900, fontSize: 80, color: '#1a1a1a'}}>{text}</span>
    </div>
  );
};

const S6: SceneEl = ({f}) => (
  <>
    <Wall tone="#F4EAD4" />
    <div style={{position: 'absolute', top: 330, left: 64, right: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
      <Tick f={f} at={T(14.5, 5)} text="جودة عالية" />
      <Tick f={f} at={T(15.9, 5)} text="سعر مناسب" />
    </div>
    <At x={330} y={1060}><Person mood="happy" blink={blinkAt(f, 4)} wave={20 + Math.sin(f / 5) * 8} scale={0.9} /></At>
  </>
);

const Counter: React.FC = () => (
  <AbsoluteFill style={{background: '#1a1714'}}>
    {[0, 1, 2].map((r) => <div key={r} style={{position: 'absolute', left: 60, right: 60, top: 300 + r * 180, height: 14, background: '#5a4a3a'}} />)}
    {[...Array(15)].map((_, i) => <div key={i} style={{position: 'absolute', left: 90 + (i % 5) * 190, top: 210 + Math.floor(i / 5) * 180, width: 60, height: 88, borderRadius: 10,
      background: ['#e9e9ee', '#b2c7d9', '#2b2b30', gold, '#c9a98a'][i % 5], border: `4px solid ${ink}`}} />)}
    <div style={{position: 'absolute', left: 0, right: 0, top: 1400, bottom: 0, background: 'linear-gradient(180deg,#2c2520,#14110e)', borderTop: `10px solid ${gold}`}} />
    <Img src={staticFile('logo.png')} style={{position: 'absolute', left: 420, top: 1460, width: 240, opacity: 0.9}} />
  </AbsoluteFill>
);

const S7: SceneEl = ({f}) => (
  <>
    <Counter />
    <Center y={300}><Board f={f} at={T(18.6, 6)} lines={['بالقسط']} goldLine={0} w={520} size={110} /></Center>
    <At x={330} y={760}><Person mood="happy" phone blink={blinkAt(f, 5)} wave={24} scale={0.95} /></At>
  </>
);

const S8: SceneEl = ({f}) => (
  <>
    <Counter />
    <Center y={260}><Board f={f} at={T(20.8, 7)} lines={['iPhone 18 Pro Max']} red={false} w={640} size={66} tilt={2} /></Center>
    <Center y={470}><Board f={f} at={T(22.35, 7)} lines={['نقد']} goldLine={0} w={360} size={110} tilt={-4} /></Center>
    <At x={420} y={800}><Person mood="smile" phone glasses shirt="#f2f2f2" hair="#3b2a1c" skin="#D9A57E" blink={blinkAt(f, 6)} scale={0.95} /></At>
    <At x={80} y={1100}><Pop f={f} at={T(20.05, 7)}><div style={{padding: '8px 30px', background: gold, border: `6px solid ${ink}`, borderRadius: 16,
      fontFamily: font.family, fontWeight: 900, fontSize: 64}}>علي</div></Pop></At>
    <At x={60} y={1300}><Coins f={f} at={T(22.4, 7)} /></At>
  </>
);

const AppPhone: React.FC<{f: number; cartAt: number[]}> = ({f, cartAt}) => {
  const n = cartAt.filter((a) => f >= a).length;
  const items = [{src: 'shop/p17.png', t: 'iPhone 17'}, {src: 'shop/p18.png', t: 'iPhone 18'}, {src: 'shop/s26.png', t: 'S26 Ultra'}, {src: '', t: 'اكسسوارات'}];
  return (
    <div style={{width: 600, height: 1180, borderRadius: 80, background: '#0d0d10', border: `10px solid #cfcfd4`, padding: 26, boxShadow: '0 30px 60px rgba(0,0,0,0.45)'}}>
      <div style={{width: '100%', height: '100%', borderRadius: 56, background: '#f6f2ea', overflow: 'hidden', position: 'relative'}}>
        <div style={{height: 150, background: '#0d0d10', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px', direction: 'rtl'}}>
          <span style={{fontFamily: font.family, fontWeight: 900, fontSize: 52, color: gold}}>جي فاير</span>
          <div style={{position: 'relative'}}>
            <svg width={70} height={70} viewBox="0 0 100 100"><path d="M10 20 H25 L38 70 H82 L92 35 H30" fill="none" stroke="#fff" strokeWidth={8} strokeLinejoin="round" />
              <circle cx={42} cy={84} r={7} fill="#fff" /><circle cx={78} cy={84} r={7} fill="#fff" /></svg>
            {n ? <div style={{position: 'absolute', top: -10, right: -14, width: 46, height: 46, borderRadius: 23, background: '#b8322a', color: '#fff',
              fontFamily: font.family, fontWeight: 900, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.3 * Math.max(0, 1 - (f - Math.max(...cartAt.filter((a) => f >= a))) / 8)})`}}>{n}</div> : null}
          </div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, padding: 24, direction: 'rtl'}}>
          {items.map((it, i) => {
            const fly = cartAt[i] !== undefined ? clamp((f - cartAt[i] + 10) / 10) : 0;
            return (
              <div key={i} style={{height: 380, borderRadius: 28, background: '#fff', border: '4px solid #e2dccf', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transform: `scale(${1 - fly * 0.06})`}}>
                {it.src ? <Img src={staticFile(it.src)} style={{height: 230, transform: `translate(${fly * 60}px, ${fly * -220}px) scale(${1 - fly * 0.6})`, opacity: 1 - fly * 0.7}} />
                  : <svg width={170} height={170} viewBox="0 0 100 100"><path d="M20 60 V48 A30 30 0 0 1 80 48 V60" fill="none" stroke="#141216" strokeWidth={9} />
                    <rect x={12} y={56} width={18} height={30} rx={6} fill={gold} /><rect x={70} y={56} width={18} height={30} rx={6} fill={gold} /></svg>}
                <div style={{fontFamily: font.family, fontWeight: 900, fontSize: 36, marginTop: 10, direction: 'ltr'}}>{it.t}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const S9: SceneEl = ({f}) => {
  const s = useS(f, 2, {damping: 14, stiffness: 120});
  return (
    <>
      <Wall tone="#EFE3CC" />
      <Center y={250}><Board f={f} at={T(24.5, 8)} lines={['تطبيق جي فاير']} goldLine={0} w={680} size={84} tilt={-2} /></Center>
      <div style={{position: 'absolute', left: 170, top: 520, transform: `translateY(${(1 - s) * 900}px) rotate(${(1 - s) * 8}deg) scale(0.92)`, transformOrigin: '50% 0'}}>
        <AppPhone f={f} cartAt={[T(25.1, 8), T(25.6, 8), T(26.0, 8), T(26.3, 8)]} />
      </div>
    </>
  );
};

const Street: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg,#9fd3f0 0%,#d9eef7 55%)'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1420, bottom: 0, background: '#5b5450'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1640, height: 16, background: 'repeating-linear-gradient(90deg,#f2e9cf 0 100px,transparent 100px 190px)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1400, height: 30, background: '#c9bfae'}} />
  </AbsoluteFill>
);

const S10: SceneEl = ({f}) => {
  const x = interpolate(f, [0, 40], [-560, 120], {extrapolateRight: 'clamp', easing: ease});
  return (
    <>
      <Street />
      <At x={520} y={880}><House /></At>
      <At x={x} y={1100 + Math.sin(f / 2) * 3}><Scooter f={f} /></At>
    </>
  );
};

const AddressCard: React.FC<{f: number; at: number}> = ({f, at}) => {
  const s = useS(f, at, {damping: 14, stiffness: 130});
  if (f < at) return null;
  return (
    <div style={{width: 760, padding: '30px 40px', borderRadius: 36, direction: 'rtl', background: '#FFF7E3', border: `8px solid ${ink}`, boxShadow: '0 14px 0 rgba(0,0,0,0.25)',
      display: 'flex', gap: 26, alignItems: 'center', transform: `translateY(${(1 - s) * 300}px)`, opacity: clamp(s * 2)}}>
      <svg width={120} height={120} viewBox="0 0 100 100"><path d="M50 92 C50 92 18 58 18 38 A32 32 0 0 1 82 38 C82 58 50 92 50 92 Z" fill="#b8322a" stroke={ink} strokeWidth={4} /><circle cx={50} cy={38} r={12} fill="#fff" /></svg>
      <div style={{fontFamily: font.family, color: '#1a1a1a'}}>
        <div style={{fontWeight: 900, fontSize: 60, color: '#b8322a'}}>جي فاير للموبايل</div>
        <div style={{fontWeight: 900, fontSize: 50}}>النجف • ميلاد • شارع الحولي</div>
        <div style={{fontWeight: 700, fontSize: 36}}>قرب جامع المنتظر</div>
      </div>
    </div>
  );
};

const S11: SceneEl = ({f}) => (
  <>
    <Store f={f} x0={-200} x1={-140} w={1450} y={300} />
    <Center y={850}><AddressCard f={f} at={T(29.6, 10)} /></Center>
  </>
);

const S12: SceneEl = ({f}) => (
  <>
    <Wall />
    <Center y={300}><Board f={f} at={2} lines={['تريد موبايل', 'بالقسط؟']} goldLine={1} w={700} size={96} /></Center>
    <At x={320} y={980}><Person mood="happy" phone blink={blinkAt(f, 7)} wave={28 + Math.sin(f / 4) * 10} scale={0.95} /></At>
  </>
);

const S13: SceneEl = ({f}) => (
  <>
    <Wall tone="#EADFCB" />
    <div style={{position: 'absolute', top: 330, left: 40, right: 40, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', direction: 'rtl'}}>
      <Pop f={f} at={T(33.9, 12) + 2}><div style={{width: 440, borderRadius: 30, overflow: 'hidden', border: `8px solid ${ink}`, boxShadow: '0 14px 0 rgba(0,0,0,0.25)'}}>
        <Img src={staticFile('explainer/store_toon.jpg')} style={{width: 640, marginLeft: -100, display: 'block'}} />
        <div style={{background: gold, textAlign: 'center', fontFamily: font.family, fontWeight: 900, fontSize: 64}}>زورنا</div></div></Pop>
      <Pop f={f} at={T(34.95, 12)}><div style={{width: 440, borderRadius: 30, overflow: 'hidden', border: `8px solid ${ink}`, background: '#0d0d10', boxShadow: '0 14px 0 rgba(0,0,0,0.25)'}}>
        <div style={{height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Img src={staticFile('logo.png')} style={{width: 220}} /></div>
        <div style={{background: gold, textAlign: 'center', fontFamily: font.family, fontWeight: 900, fontSize: 64}}>اطلب من التطبيق</div></div></Pop>
    </div>
    <Center y={1000}><Pop f={f} at={T(35.7, 12)} from="down"><div style={{padding: '14px 34px', background: '#0d0d10', borderRadius: 999, border: `4px solid ${gold}`,
      fontFamily: font.family, fontWeight: 800, fontSize: 40, color: '#fff', direction: 'ltr'}}>app.jifrephone.workers.dev</div></Pop></Center>
  </>
);

const S14: SceneEl = ({f}) => {
  const x = interpolate(f, [0, 30], [-560, 80], {extrapolateRight: 'clamp', easing: ease});
  const open = clamp((f - T(38.3, 13)) / 12);
  return (
    <>
      <Street />
      <At x={540} y={880}><House open={open} /></At>
      <Center y={300}><Board f={f} at={T(37.0, 13)} lines={['ثاني يوم', 'يوصلك']} goldLine={0} w={560} size={96} tilt={3} /></Center>
      <At x={x} y={1100}><Scooter f={f < 30 ? f : 30} /></At>
      {f > T(38.0, 13) ? <At x={interpolate(f, [T(38.0, 13), T(38.8, 13)], [520, 780], {extrapolateRight: 'clamp'})} y={1220}><Box /></At> : null}
    </>
  );
};

const SCENES: SceneEl[] = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14];
type Trans = 'whip' | 'zoom' | 'iris' | 'slideUp' | 'flip' | 'push' | 'dip';
const TRANS: Trans[] = ['whip', 'iris', 'zoom', 'push', 'slideUp', 'flip', 'iris', 'zoom', 'whip', 'dip', 'slideUp', 'push', 'zoom', 'dip'];
export const EXPLAINER_CUTS = CUTS.slice(1).map((t, i) => ({at: t, type: TRANS[i]}));
const D = 12;

const tStyles = (t: Trans, p: number): {out: React.CSSProperties; in: React.CSSProperties} => {
  const q = ease(clamp(p));
  switch (t) {
    case 'whip': return {out: {transform: `translateX(${q * -1080}px)`, filter: `blur(${q * 12}px)`}, in: {transform: `translateX(${(1 - q) * 1080}px)`, filter: `blur(${(1 - q) * 12}px)`}};
    case 'zoom': return {out: {transform: `scale(${1 + q * 0.7})`, opacity: 1 - q}, in: {transform: `scale(${0.85 + 0.15 * q})`, opacity: clamp(q * 1.6)}};
    case 'iris': return {out: {}, in: {clipPath: `circle(${q * 120}% at 50% 55%)`}};
    case 'slideUp': return {out: {transform: `translateY(${-q * 600}px)`}, in: {transform: `translateY(${(1 - q) * 1920}px)`}};
    case 'flip': return {out: {transform: `perspective(2200px) rotateY(${q * 90}deg)`, opacity: q < 0.5 ? 1 : 0}, in: {transform: `perspective(2200px) rotateY(${(q - 1) * 90}deg)`, opacity: q < 0.5 ? 0 : 1}};
    case 'push': return {out: {transform: `translateX(${q * 1080}px)`}, in: {transform: `translateX(${(q - 1) * 1080}px)`}};
    case 'dip': return {out: {opacity: clamp(1 - q * 2)}, in: {opacity: clamp(q * 2 - 1)}};
  }
};

// camera: a slow push and drift inside every scene
const Cam: React.FC<{local: number; len: number; children: React.ReactNode}> = ({local, len, children}) => {
  const k = clamp(local / len);
  return <AbsoluteFill style={{transform: `scale(${1 + 0.06 * ease(k)}) translate(${Math.sin(local / 40) * 6}px, ${Math.cos(local / 50) * 5}px)`, transformOrigin: '50% 45%'}}>{children}</AbsoluteFill>;
};
const Scene: React.FC<{i: number; f: number}> = ({i, f}) => {
  const a = fr(CUTS[i]), b = fr(CUTS[i + 1]);
  const El = SCENES[i];
  return <Cam local={f - a} len={b - a}><El f={f - a} /></Cam>;
};

const Captions: React.FC<{f: number}> = ({f}) => {
  const t = f / FPS;
  let cur = -1;
  for (let i = 0; i < caps.length; i++) if (caps[i].t <= t) cur = i;
  if (cur < 0 || t > (caps[cur + 1]?.t ?? caps[cur].t + 0.8) + 0.1 || t >= END_FROM / FPS) return null;
  const c = caps[cur];
  const local = f - fr(c.t);
  const s = clamp(local / 4);
  const key = ['بالقسط', 'نقد', 'تطبيق', 'جي', 'فاير', 'للموبايل', 'كاش', 'مناسب', 'نظيف', 'البيت', 'بيتك', 'تطبيقنا', 'زورنا', 'iPhone 18 Pro Max', 'يوم'].includes(c.w);
  const latin = !/[ء-ي]/.test(c.w);
  return (
    <div style={{position: 'absolute', top: 1300, left: 64, right: 230, textAlign: 'center', direction: latin ? 'ltr' : 'rtl'}}>
      <span style={{display: 'inline-block', fontFamily: font.family, fontWeight: 900, fontSize: latin ? 84 : 104, color: key ? gold : '#fff',
        WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${0.7 + 0.3 * s}) translateY(${(1 - s) * 20}px)`, textShadow: '0 8px 0 rgba(0,0,0,0.3)'}}>{c.w}</span>
    </div>
  );
};

export const Explainer: React.FC = () => {
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
      <Captions f={f} />
      {f < END_FROM ? <LogoBug /> : null}
      {f >= END_FROM ? <AbsoluteFill style={{opacity: clamp((f - END_FROM) / 12)}}><EndCardAt f={f - END_FROM} /></AbsoluteFill> : null}
    </AbsoluteFill>
  );
};

// EndCard reads useCurrentFrame(); shift it so its animation starts at END_FROM
const EndCardAt: React.FC<{f: number}> = () => (
  <Sequence from={END_FROM} layout="none"><EndCard /></Sequence>
);
