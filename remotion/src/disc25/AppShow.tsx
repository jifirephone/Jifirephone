// Ji Fire — app showcase in the owner's reference style (2026-11-13): soft cream "clay" look, white floating
// cards with soft shadows and gentle 3D tilt, chaos → logo in a soft disc with orbiting icons → UI cards build up
// with a pill label on each, logo reveal. UI pieces are cropped from the owner's own app recordings (rebuilt, not shown raw).
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color} from '../brand';
import {EndCard} from '../components/Brand';

const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
const F = 'Cairo';
const GOLD = color.gold, INK = '#1d1a14', BG = '#EFEBE3';
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const ltr = (s: string) => <span style={{direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block'}}>{s}</span>;

const DUR = [2.8, 3.4, 3.0, 3.3, 3.8, 3.3, 3.4, 3.4, 3.0, 3.4];
const STARTS: number[] = [];
DUR.reduce((a, d, i) => { STARTS[i] = a; return a + d; }, 0);
export const APPSHOW_STARTS = STARTS;
export const APPSHOW_FRAMES = S(DUR.reduce((a, b) => a + b, 0));

const shadow = '0 34px 70px rgba(70,55,25,0.20), 0 8px 18px rgba(70,55,25,0.10)';

const Stage: React.FC<{lf: number; children: React.ReactNode}> = ({lf, children}) => (
  <AbsoluteFill style={{background: `radial-gradient(85% 60% at 50% 42%, #FBF9F5 0%, ${BG} 62%, #E2DDD2 100%)`, overflow: 'hidden'}}>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} style={{position: 'absolute', left: (random(`dx${i}`) * 1000), top: 300 + random(`dy${i}`) * 1400 - (lf * (0.3 + i * 0.05)) % 200, width: 10, height: 10, borderRadius: 5,
        background: i % 2 ? 'rgba(243,180,6,0.35)' : 'rgba(255,255,255,0.9)', boxShadow: '0 2px 6px rgba(0,0,0,0.08)'}} />
    ))}
    {children}
  </AbsoluteFill>
);

const Pill: React.FC<{lf: number; t: string; at?: number; top?: number}> = ({lf, t, at = 6, top = 300}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf - at, fps, config: {damping: 14, stiffness: 170}});
  return (
    <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: a, transform: `translateY(${(1 - a) * -24}px) scale(${0.85 + 0.15 * a})`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 34px', borderRadius: 999, background: '#fff', boxShadow: '0 12px 30px rgba(70,55,25,0.16)', direction: 'rtl'}}>
        <div style={{width: 16, height: 16, borderRadius: 8, background: GOLD}} />
        <span style={{fontFamily: F, fontWeight: 900, fontSize: 52, color: INK}}>{t}</span>
      </div>
    </div>
  );
};

const Card: React.FC<{src: string; lf: number; at?: number; w: number; x: number; y: number; rot?: number; ry?: number; from?: 'up' | 'down' | 'left' | 'right' | 'scale'; z?: number}> = (
  {src, lf, at = 0, w, x, y, rot = 0, ry = 0, from = 'up', z = 1}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf - at, fps, config: {damping: 16, stiffness: 120}});
  const off = (1 - a) * 260;
  const tr = from === 'up' ? `translateY(${off}px)` : from === 'down' ? `translateY(${-off}px)` : from === 'left' ? `translateX(${-off}px)` : from === 'right' ? `translateX(${off}px)` : `scale(${0.6 + 0.4 * a})`;
  const fl = Math.sin((lf + at * 3) / 22) * 6;
  return (
    <div style={{position: 'absolute', left: x, top: y + fl, width: w, zIndex: z, opacity: clamp(a * 1.6), transform: `${tr} perspective(1600px) rotateY(${ry * (1 - 0.3 * a)}deg) rotate(${rot}deg)`}}>
      <div style={{borderRadius: 34, overflow: 'hidden', background: '#fff', boxShadow: shadow, border: '6px solid #fff'}}>
        <Img src={staticFile('appshow/' + src)} style={{width: '100%', display: 'block'}} />
      </div>
    </div>
  );
};

// ---- icons for the orbit ----
const ICONS: React.ReactNode[] = [
  <path key="p" d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2" />,
  <path key="t" d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2" />,
  <path key="h" d="M3 14v-2a9 9 0 0 1 18 0v2M3 14h3v6H3zM18 14h3v6h-3z" />,
  <path key="c" d="M9 2v5M15 2v5M7 7h10v5a5 5 0 0 1-10 0zM12 17v5" />,
  <path key="w" d="M8 4h8v3H8zM8 17h8v3H8zM7 7h10v10H7zM12 10v2l1 1" />,
  <path key="g" d="M6 9h12a4 4 0 0 1 4 4v1a3 3 0 0 1-5.3 2L15 14H9l-1.7 2A3 3 0 0 1 2 14v-1a4 4 0 0 1 4-4zM8 11v4M6 13h4" />,
  <path key="l" d="M4 5h16v10H4zM2 19h20" />,
  <path key="s" d="M3 7h18l-2 12H5zM8 7a4 4 0 0 1 8 0" />,
];

const Chaos: React.FC<{lf: number}> = ({lf}) => {
  const imgs = ['../show/ip17.jpg', '../show/s26.png', '../show/rm16.jpg', '../show/tc40.jpg', '../show/x8b.png', '../show/gt50.jpg', '../show/rn14.jpg', '../show/a56.jpg', '../show/pf7.jpg', '../show/in60.png', '../show/bv60.jpg', '../show/rm15.jpg'];
  const out = ease((lf - S(2.0)) / 18);
  return (
    <Stage lf={lf}>
      {imgs.map((src, i) => {
        const x = 40 + random(`cx${i}`) * 760, y = 330 + random(`cy${i}`) * 900, r = (random(`cr${i}`) - 0.5) * 50;
        const a = clamp((lf - i * 1.5) / 8);
        return <div key={i} style={{position: 'absolute', left: x + (540 - x) * out, top: y + (900 - y) * out, width: 230, height: 230, borderRadius: 26, background: '#fff', boxShadow: shadow,
          transform: `rotate(${r * (1 - out)}deg) scale(${(0.6 + 0.4 * a) * (1 - 0.85 * out)})`, opacity: a * (1 - out)}}>
          <Img src={staticFile('show/' + src.split('/').pop())} style={{width: 230, height: 230, objectFit: 'contain', padding: 18, boxSizing: 'border-box'}} /></div>;
      })}
      <Pill lf={lf} t="تدوّر بين المحلات؟" at={10} top={1330} />
    </Stage>
  );
};

const Orbit: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const disc = spring({frame: lf, fps, config: {damping: 14, stiffness: 90}});
  const logo = spring({frame: lf - 12, fps, config: {damping: 13, stiffness: 140}});
  const ring = clamp((lf - 22) / 16);
  const R = 360;
  return (
    <Stage lf={lf}>
      <div style={{position: 'absolute', left: 540 - 250, top: 800 - 250, width: 500, height: 500, borderRadius: '50%', background: 'linear-gradient(145deg,#ffffff,#e7e2d8)',
        boxShadow: '30px 30px 70px rgba(120,100,60,0.22), -24px -24px 60px rgba(255,255,255,0.95)', transform: `scale(${disc})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: 300, height: 300, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${logo})`}}>
          <Img src={staticFile('logo.png')} style={{width: 240}} />
        </div>
      </div>
      <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={540} cy={800} r={R} fill="none" stroke="rgba(243,180,6,0.55)" strokeWidth={4} strokeDasharray={`${2 * Math.PI * R * ring} ${2 * Math.PI * R}`} transform="rotate(-90 540 800)" />
      </svg>
      {ICONS.map((ic, i) => {
        const ang = (i / ICONS.length) * Math.PI * 2 + lf / 70;
        const a = clamp((lf - 22 - i * 2) / 8);
        return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(ang) * R - 54, top: 800 + Math.sin(ang) * R - 54, width: 108, height: 108, borderRadius: 30, background: '#fff', boxShadow: '0 14px 30px rgba(70,55,25,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${a})`}}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={i % 2 ? '#b98800' : INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ic}</svg></div>;
      })}
      <Pill lf={lf} t="كلشي بتطبيق واحد" at={30} top={1300} />
    </Stage>
  );
};

const Home: React.FC<{lf: number}> = ({lf}) => (
  <Stage lf={lf}>
    <Pill lf={lf} t="العروض أول ما تفتح" />
    <Card src="banner.jpg" lf={lf} at={4} w={940} x={70} y={470} from="scale" ry={-10} z={2} />
    <Card src="brands_row.jpg" lf={lf} at={18} w={900} x={90} y={1020} from="up" ry={8} />
    <Card src="nav.jpg" lf={lf} at={28} w={860} x={110} y={1330} from="up" />
  </Stage>
);

const Picker: React.FC<{lf: number}> = ({lf}) => (
  <Stage lf={lf}>
    <Pill lf={lf} t="اختار نوع جهازك" />
    <Card src="picker.jpg" lf={lf} at={4} w={640} x={220} y={420} from="up" ry={-14} z={2} />
    <Card src="cats.jpg" lf={lf} at={20} w={430} x={20} y={760} rot={-4} from="left" ry={16} />
  </Stage>
);

const Brands: React.FC<{lf: number}> = ({lf}) => (
  <Stage lf={lf}>
    <Pill lf={lf} t="كل الماركات" />
    <Card src="samsung.jpg" lf={lf} at={4} w={470} x={40} y={430} rot={-5} from="left" ry={14} />
    <Card src="poco.jpg" lf={lf} at={12} w={470} x={570} y={470} rot={5} from="right" ry={-14} />
    <Card src="iphone.jpg" lf={lf} at={24} w={500} x={50} y={940} rot={-3} from="up" z={3} />
    <Card src="honor.jpg" lf={lf} at={36} w={500} x={530} y={1010} rot={3} from="up" z={4} />
  </Stage>
);

const Tabs: React.FC<{lf: number}> = ({lf}) => (
  <Stage lf={lf}>
    <Pill lf={lf} t="تابات وألعاب وحاسبات" />
    <Card src="tabs.jpg" lf={lf} at={4} w={620} x={230} y={430} from="scale" ry={-12} z={2} />
    <Card src="cats.jpg" lf={lf} at={18} w={480} x={40} y={900} rot={-3} from="left" ry={12} z={3} />
  </Stage>
);

const Acc: React.FC<{lf: number}> = ({lf}) => (
  <Stage lf={lf}>
    <Pill lf={lf} t="اكسسوارات بماركات عالمية" />
    <Card src="acc.jpg" lf={lf} at={4} w={600} x={40} y={430} rot={-3} from="left" ry={12} />
    <Card src="accbrands.jpg" lf={lf} at={18} w={520} x={520} y={600} rot={3} from="right" ry={-12} z={2} />
  </Stage>
);

const Row: React.FC<{lf: number; at: number; big: React.ReactNode; sub: React.ReactNode; y: number}> = ({lf, at, big, sub, y}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf - at, fps, config: {damping: 14, stiffness: 140}});
  return (
    <div style={{position: 'absolute', top: y, left: 90, right: 90, padding: '30px 40px', borderRadius: 40, background: '#fff', boxShadow: shadow, direction: 'rtl', display: 'flex', alignItems: 'center', gap: 26,
      opacity: clamp(a * 1.6), transform: `translateY(${(1 - a) * 120}px) perspective(1600px) rotateX(${(1 - a) * 30}deg)`}}>
      <div style={{width: 26, height: 96, borderRadius: 13, background: GOLD}} />
      <div>
        <div style={{fontFamily: F, fontWeight: 900, fontSize: 66, color: INK, lineHeight: 1.15}}>{big}</div>
        <div style={{fontFamily: F, fontWeight: 800, fontSize: 36, color: '#7a6d55'}}>{sub}</div>
      </div>
    </div>
  );
};

const Offers: React.FC<{lf: number}> = ({lf}) => (
  <Stage lf={lf}>
    <Pill lf={lf} t="وفوكاها" at={2} />
    <Row lf={lf} at={8} y={460} big={<>خصم {ltr('25,000')} د.ع</>} sub={<>كود {ltr('jifirecode')} · للطلبات من {ltr('200,000')}</>} />
    <Row lf={lf} at={22} y={760} big="توصيل مجاني" sub="لكل محافظات العراق" />
    <Row lf={lf} at={36} y={1060} big="ضمان سنة للجديد" sub="وشهر للمستعمل · مع وصل ضمان" />
  </Stage>
);

const Reveal: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 12, stiffness: 120}});
  const b = spring({frame: lf - 16, fps, config: {damping: 14}});
  const glow = 0.5 + 0.5 * Math.sin(lf / 8);
  return (
    <Stage lf={lf}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1660, height: 260, background: `radial-gradient(50% 100% at 50% 100%, rgba(243,180,6,${0.25 + 0.15 * glow}), transparent 70%)`}} />
      <div style={{position: 'absolute', top: 520, left: '50%', marginLeft: -230, width: 460, height: 460, borderRadius: 110, background: '#000', boxShadow: '0 40px 90px rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `perspective(1600px) rotateY(${(1 - a) * 70}deg) scale(${0.7 + 0.3 * a})`}}>
        <Img src={staticFile('logo.png')} style={{width: 380}} /></div>
      <div style={{position: 'absolute', top: 1040, left: 0, right: 0, textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: 86, color: INK, direction: 'rtl', opacity: b, transform: `translateY(${(1 - b) * 30}px)`}}>تطبيق جي فاير</div>
      <Pill lf={lf} t="حمّله هسه" at={24} top={1170} />
      <div style={{position: 'absolute', top: 1300, left: 0, right: 0, textAlign: 'center', fontFamily: F, fontWeight: 800, fontSize: 38, color: '#7a6d55', direction: 'ltr', opacity: clamp((lf - 34) / 10)}}>app.jifrephone.workers.dev</div>
    </Stage>
  );
};

const SCENES = [Chaos, Orbit, Home, Picker, Brands, Tabs, Acc, Offers, Reveal];

export const AppShow: React.FC = () => {
  const f = useCurrentFrame();
  let idx = 0;
  for (let i = 0; i < STARTS.length; i++) if (f >= S(STARTS[i])) idx = i;
  const lf = f - S(STARTS[idx]);
  if (idx === STARTS.length - 1) return <AbsoluteFill style={{background: '#000'}}><EndCard /></AbsoluteFill>;
  // soft transitions, varied: fade-from-cream, blur-rise, scale-settle, slide
  const p = ease(lf / 10);
  const kind = idx % 4;
  const st: React.CSSProperties = idx === 0 ? {} : kind === 1 ? {opacity: p, filter: p < 1 ? `blur(${(1 - p) * 14}px)` : 'none', transform: `translateY(${(1 - p) * 60}px)`}
    : kind === 2 ? {opacity: p, transform: `scale(${1.08 - 0.08 * p})`} : kind === 3 ? {opacity: p, transform: `translateX(${(1 - p) * -120}px)`} : {opacity: p};
  const outP = clamp((S(DUR[idx]) - lf) / 8);
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{...st, opacity: (st.opacity as number ?? 1) * (idx === STARTS.length - 2 ? 1 : outP)}}>{React.createElement(SCENES[idx], {lf})}</AbsoluteFill>
      {idx > 0 ? <div style={{position: 'absolute', top: 236, right: 64, width: 150, height: 90, borderRadius: 20, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Img src={staticFile('logo.png')} style={{width: 124}} /></div> : null}
    </AbsoluteFill>
  );
};
