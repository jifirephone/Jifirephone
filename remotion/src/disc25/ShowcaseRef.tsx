// Ji Fire brand showcase, re-styled after the owner's reference reel (technique only, 2026-11-13):
// dark teal blurred backdrop, frosted glass panel, word-by-word captions with a boxed active word,
// stacked kinetic words, ring counter, typed input, zoom-blur transitions with a light sweep.
// Our own content, images, voice and SFX. Brand gold replaces the reference's lime.
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color} from '../brand';
import {EndCard} from '../components/Brand';
import CAPS from './refCaps.json';

const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
const F = 'Cairo';
const GOLD = color.gold, W = '#fff', MUTED = 'rgba(255,255,255,0.62)';
const ltr = (s: string) => <span style={{direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block'}}>{s}</span>;
const clamp = (v: number) => Math.max(0, Math.min(1, v));

// cuts follow the voice (same edited take as Showcase vo2)
const STARTS = [0, 2.2, 3.72, 5.15, 6.09, 7.14, 7.55, 8.73, 9.22, 11.41, 13.9, 20.9, 25.03];
export const REF_FRAMES = S(28.5);
const LET = [17.34, 17.8, 18.12, 18.5, 18.76, 18.9, 19.34, 19.76, 20.06, 20.3]; // spoken letters of the code (video s)

type Dev = {img: string; name: string};
const BR: {en: string; ar: string; devs: Dev[]}[] = [
  {en: 'iPhone', ar: 'آيفون', devs: [{img: 'ip17.jpg', name: 'iPhone 17 Pro Max'}, {img: 'ip18.png', name: 'iPhone 18 Pro Max'}, {img: 'ip13.jpg', name: 'iPhone 13 Pro Max'}]},
  {en: 'Samsung', ar: 'سامسونج', devs: [{img: 's26.png', name: 'Galaxy S26 Ultra'}, {img: 'a56.jpg', name: 'Galaxy A56 5G'}, {img: 'a17.png', name: 'Galaxy A17 5G'}]},
  {en: 'realme', ar: 'ريلمي', devs: [{img: 'rm16.jpg', name: 'realme 16 Pro+'}, {img: 'rm15.jpg', name: 'realme 15 5G'}, {img: 'rm14.jpg', name: 'realme 14 Pro+'}]},
  {en: 'Xiaomi', ar: 'شاومي', devs: [{img: 'rn14.jpg', name: 'Redmi Note 14 Pro+'}, {img: 'pf7.jpg', name: 'POCO F7 Ultra'}]},
  {en: 'TECNO', ar: 'تكنو', devs: [{img: 'tc40.jpg', name: 'Camon 40 Pro'}, {img: 'tp7.png', name: 'Pova 7 Ultra'}, {img: 'tps.jpg', name: 'Pova Slim'}]},
  {en: 'Infinix', ar: 'إنفنكس', devs: [{img: 'in60.png', name: 'Note 60 Pro'}, {img: 'gt50.jpg', name: 'GT 50 Pro'}]},
  {en: 'Tablets', ar: 'تابات', devs: [{img: 'x8b.png', name: 'Pad X8B'}, {img: 'bv60.jpg', name: 'Blackview Tab 60'}]},
];

// ---------- backdrop ----------
const Backdrop: React.FC<{f: number}> = ({f}) => {
  const d = f / FPS;
  const blobs = [[160, 520, 620, '#0f6f78'], [860, 300, 520, '#0b4f5a'], [760, 1500, 700, '#0d5d66'], [120, 1650, 520, '#123c44']] as const;
  return (
    <AbsoluteFill style={{background: '#04161a', overflow: 'hidden'}}>
      {blobs.map(([x, y, r, c], i) => (
        <div key={i} style={{position: 'absolute', left: x - r / 2 + Math.sin(d * 0.35 + i) * 40, top: y - r / 2 + Math.cos(d * 0.3 + i) * 50, width: r, height: r, borderRadius: '50%',
          background: `radial-gradient(circle, ${c} 0%, rgba(4,22,26,0) 68%)`, opacity: 0.85}} />
      ))}
      {[0, 1, 2, 3].map((i) => {
        const x = [140, 820, 300, 900][i], y = [380, 980, 1560, 1700][i], s = [170, 220, 140, 190][i];
        return <div key={'p' + i} style={{position: 'absolute', left: x + Math.sin(d * 0.4 + i) * 20, top: y + Math.cos(d * 0.3 + i) * 24, width: s, height: s, opacity: 0.16,
          background: 'linear-gradient(#1fa3ad,#1fa3ad) center/34% 100% no-repeat, linear-gradient(#1fa3ad,#1fa3ad) center/100% 34% no-repeat', borderRadius: 18, filter: 'blur(14px)'}} />;
      })}
      <AbsoluteFill style={{boxShadow: 'inset 0 0 320px rgba(0,0,0,0.75)'}} />
    </AbsoluteFill>
  );
};

const Panel: React.FC<{children: React.ReactNode; top?: number; h?: number}> = ({children, top = 300, h = 940}) => (
  <div style={{position: 'absolute', top, left: 50, right: 50, height: h, borderRadius: 46, background: 'rgba(255,255,255,0.055)', border: '1.5px solid rgba(255,255,255,0.13)',
    boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)', overflow: 'hidden'}}>
    <div style={{position: 'absolute', top: 26, left: 30, display: 'flex', gap: 10}}>{['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.7}} />)}</div>
    {children}
  </div>
);

// ---------- captions (word by word, boxed active word) ----------
type Cap = [string, number][];
const Captions: React.FC<{t: number}> = ({t}) => {
  const groups = CAPS as Cap[];
  let gi = -1;
  for (let i = 0; i < groups.length; i++) if (t >= groups[i][0][1] - 0.05) gi = i;
  if (gi < 0) return null;
  const g = groups[gi];
  const next = groups[gi + 1]?.[0][1] ?? 99;
  if (t > Math.min(next, g[g.length - 1][1] + 1.6)) return null;
  const since = t - g[0][1];
  const pop = clamp(since / 0.12);
  return (
    <div style={{position: 'absolute', top: 1300, left: 64, right: 64, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 14px', direction: 'rtl',
      opacity: pop, transform: `translateY(${(1 - pop) * 14}px) scale(${0.96 + 0.04 * pop})`}}>
      {g.map(([w, s], i) => {
        const on = t >= s - 0.04 && (i === g.length - 1 || t < g[i + 1][1] - 0.04);
        const lat = /[A-Za-z0-9]/.test(w);
        return <span key={i} style={{fontFamily: F, fontWeight: 900, fontSize: 74, lineHeight: 1.25, padding: '0 14px', borderRadius: 14,
          background: on ? GOLD : 'transparent', color: on ? '#161208' : W, direction: lat ? 'ltr' : 'rtl',
          textShadow: on ? 'none' : '0 4px 14px rgba(0,0,0,0.6)'}}>{w}</span>;
      })}
    </div>
  );
};

// ---------- scenes ----------
const Stack: React.FC<{lf: number; lines: {t: React.ReactNode; at: number; gold?: boolean; size?: number}[]; top?: number}> = ({lf, lines, top = 240}) => {
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top, left: 40, right: 40, textAlign: 'center', fontFamily: F, fontWeight: 900, direction: 'rtl'}}>
      {lines.map((l, i) => {
        const a = spring({frame: lf - l.at, fps, config: {damping: 14, stiffness: 180}});
        return <div key={i} style={{fontSize: l.size ?? 118, lineHeight: 1.3, color: l.gold ? GOLD : W, opacity: a, filter: `blur(${(1 - a) * 10}px)`, transform: `translateY(${(1 - a) * 40}px) scale(${0.9 + 0.1 * a})`}}>{l.t}</div>;
      })}
    </div>
  );
};

const PillType: React.FC<{lf: number; text: string; at: number; badge: string}> = ({lf, text, at, badge}) => {
  const n = Math.floor(clamp((lf - at) / 22) * text.length);
  const b = spring({frame: lf - at - 26, fps: FPS, config: {damping: 11, stiffness: 200}});
  return (
    <div style={{position: 'absolute', top: 240, left: 80, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 22, background: 'rgba(255,255,255,0.08)',
      border: '1.5px solid rgba(255,255,255,0.18)', direction: 'ltr', opacity: clamp((lf - at) / 6)}}>
      <Img src={staticFile('logo.png')} style={{height: 40}} />
      <span style={{fontFamily: F, fontWeight: 900, fontSize: 38, color: W}}>{text.slice(0, n)}<span style={{opacity: lf % 16 < 8 ? 1 : 0}}>|</span></span>
      <span style={{fontFamily: F, fontWeight: 900, fontSize: 30, color: '#161208', background: GOLD, borderRadius: 10, padding: '2px 12px', transform: `scale(${b})`}}>{badge}</span>
    </div>
  );
};

const Hook: React.FC<{lf: number}> = ({lf}) => (
  <>
    <PillType lf={lf} text="Ji Fire for Mobile" at={0} badge="2026" />
    <Panel>
      <Stack lf={lf} top={250} lines={[{t: 'كل', at: 4, size: 150}, {t: 'الماركات', at: 9, size: 150}, {t: 'بمكان واحد', at: 29, gold: true, size: 150}]} />
    </Panel>
  </>
);

const BrandS: React.FC<{lf: number; i: number}> = ({lf, i}) => {
  const {fps} = useVideoConfig();
  const b = BR[i];
  const t = spring({frame: lf, fps, config: {damping: 16, stiffness: 220}});
  const w = b.devs.length === 3 ? 282 : 400;
  return (
    <Panel>
      <div style={{position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center', opacity: t, transform: `translateY(${(1 - t) * -30}px)`}}>
        <div style={{fontFamily: F, fontWeight: 900, fontSize: 140, lineHeight: 1, color: W, direction: 'ltr'}}>{b.en}</div>
        <div style={{display: 'inline-block', marginTop: 14, padding: '4px 30px', borderRadius: 14, background: GOLD, fontFamily: F, fontWeight: 900, fontSize: 42, color: '#161208'}}>{b.ar}</div>
      </div>
      <div style={{position: 'absolute', top: 400, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18, direction: 'ltr'}}>
        {b.devs.map((d, k) => {
          const a = spring({frame: lf - 2 - k * 3, fps, config: {damping: 15, stiffness: 200}});
          return (
            <div key={d.img} style={{width: w, borderRadius: 28, background: '#fff', overflow: 'hidden', opacity: a, transform: `translateY(${(1 - a) * 120 + (k % 2) * 28}px) scale(${0.85 + 0.15 * a})`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>
              <Img src={staticFile('show/' + d.img)} style={{width: w, height: w, objectFit: 'contain', padding: 14, boxSizing: 'border-box'}} />
              <div style={{padding: '8px 6px 14px', textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: w > 300 ? 30 : 24, color: '#161208', borderTop: `4px solid ${GOLD}`}}>{d.name}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

const Used: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const ph = ['u16.jpg', 'utc.jpg', 'u17.jpg', 'uinf.jpg'];
  return (
    <Panel>
      <Stack lf={lf} top={80} lines={[{t: 'وأجهزة مستعملة', at: 6, size: 92}, {t: 'نظيفة', at: 40, gold: true, size: 92}]} />
      <div style={{position: 'absolute', top: 360, left: 36, right: 36, display: 'flex', gap: 16, direction: 'ltr'}}>
        {ph.map((p, i) => {
          const a = spring({frame: lf - 8 - i * 4, fps, config: {damping: 15}});
          return <div key={p} style={{flex: 1, height: 480, borderRadius: 24, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.25)', opacity: a, transform: `translateY(${(1 - a) * 160 + (i % 2) * 30}px)`}}>
            <Img src={staticFile('show/' + p)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>;
        })}
      </div>
    </Panel>
  );
};

const App: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const p = spring({frame: lf, fps, config: {damping: 15, stiffness: 120}});
  const all = BR.flatMap((b) => b.devs).slice(0, 12);
  const scroll = interpolate(lf, [6, S(2.0)], [0, -520], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const card = spring({frame: lf - S(1.75), fps, config: {damping: 14, stiffness: 150}});
  const press = lf > S(2.2) && lf < S(2.45);
  const done = lf >= S(2.45);
  return (
    <Panel>
      <div style={{position: 'absolute', top: 70, left: '50%', marginLeft: -205, width: 410, height: 760, borderRadius: 54, background: '#0c0c0f', border: '9px solid #26262b', overflow: 'hidden',
        transform: `translateY(${(1 - p) * 220}px) scale(${0.9 + 0.1 * p})`, opacity: p}}>
        <AbsoluteFill style={{background: '#f5f5f7'}} />
        <div style={{position: 'absolute', top: 76 + scroll, left: 10, right: 10, display: 'flex', flexWrap: 'wrap', gap: 10, direction: 'ltr'}}>
          {all.map((d) => (
            <div key={d.img} style={{width: 181, borderRadius: 16, background: '#fff', border: '1px solid #ececf0', overflow: 'hidden'}}>
              <Img src={staticFile('show/' + d.img)} style={{width: 181, height: 165, objectFit: 'contain'}} />
              <div style={{padding: '2px 4px 8px', fontFamily: F, fontWeight: 800, fontSize: 16, color: '#161208', textAlign: 'center'}}>{d.name}</div>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 66, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Img src={staticFile('logo.png')} style={{height: 50}} /></div>
      </div>
      {/* app card, like a profile card with a follow button */}
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 40, padding: '22px 26px', borderRadius: 30, background: 'rgba(20,30,32,0.92)', border: '1.5px solid rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl', opacity: card, transform: `translateY(${(1 - card) * 80}px)`}}>
        <div style={{width: 92, height: 92, borderRadius: 22, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Img src={staticFile('logo.png')} style={{width: 78}} /></div>
        <div style={{flex: 1}}>
          <div style={{fontFamily: F, fontWeight: 900, fontSize: 38, color: W}}>تطبيق جي فاير</div>
          <div style={{fontFamily: F, fontWeight: 700, fontSize: 26, color: MUTED}}>Google Play · App Store</div>
        </div>
        <div style={{padding: '14px 26px', borderRadius: 18, fontFamily: F, fontWeight: 900, fontSize: 30, transform: `scale(${press ? 0.92 : 1})`,
          background: done ? 'transparent' : GOLD, color: done ? W : '#161208', border: done ? '2px solid rgba(255,255,255,0.4)' : '2px solid transparent'}}>{done ? 'تم ✓' : 'حمّل'}</div>
      </div>
    </Panel>
  );
};

const Discount: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const t0 = 13.9;
  const prog = clamp((lf / FPS + t0 - 14.66) / (16.44 - 14.66));
  const e = 1 - Math.pow(1 - prog, 3);
  const val = Math.round(e * 25000);
  const ring = spring({frame: lf - 4, fps, config: {damping: 15}});
  const inp = spring({frame: lf - S(16.3 - t0), fps, config: {damping: 15, stiffness: 160}});
  const typed = LET.filter((s) => lf / FPS + t0 >= s - 0.02).length;
  const R = 190, C = 2 * Math.PI * R;
  return (
    <Panel>
      <div style={{position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: 46, color: MUTED, direction: 'rtl'}}>خصم بكل طلب</div>
      <div style={{position: 'absolute', top: 150, left: '50%', marginLeft: -220, width: 440, height: 440, opacity: ring, transform: `scale(${0.85 + 0.15 * ring})`}}>
        <svg width="440" height="440" viewBox="0 0 440 440">
          <circle cx="220" cy="220" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="22" />
          <circle cx="220" cy="220" r={R} fill="none" stroke={GOLD} strokeWidth="22" strokeLinecap="round" strokeDasharray={`${C * e} ${C}`} transform="rotate(-90 220 220)" />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 900}}>
          <div style={{fontSize: 104, color: W, direction: 'ltr', lineHeight: 1}}>{val.toLocaleString('en-US')}</div>
          <div style={{fontSize: 44, color: GOLD, marginTop: 6}}>دينار</div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 650, left: 60, right: 60, opacity: inp, transform: `translateY(${(1 - inp) * 50}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '22px 28px', borderRadius: 26, background: 'rgba(255,255,255,0.08)', border: `2px solid ${typed ? GOLD : 'rgba(255,255,255,0.2)'}`, direction: 'ltr'}}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v8H4v-8M2 7h20v5H2zM12 22V7M12 7S10 2 7.5 3.5 9 7 12 7zM12 7s2-5 4.5-3.5S15 7 12 7z" /></svg>
          <div style={{flex: 1, fontFamily: F, fontWeight: 900, fontSize: 72, color: W, letterSpacing: 2}}>{'jifirecode'.slice(0, typed)}<span style={{opacity: lf % 16 < 8 ? 1 : 0, color: GOLD}}>|</span></div>
          <div style={{padding: '10px 20px', borderRadius: 14, background: typed >= 10 ? GOLD : 'rgba(255,255,255,0.12)', fontFamily: F, fontWeight: 900, fontSize: 30, color: typed >= 10 ? '#161208' : MUTED, direction: 'rtl'}}>{typed >= 10 ? 'تم ✓' : 'تطبيق'}</div>
        </div>
        <div style={{marginTop: 16, textAlign: 'center', fontFamily: F, fontWeight: 800, fontSize: 34, color: MUTED, direction: 'rtl'}}>للطلبات من {ltr('200,000')} د.ع وفوك</div>
      </div>
    </Panel>
  );
};

const Offers: React.FC<{lf: number}> = ({lf}) => (
  <Panel>
    <Stack lf={lf} top={90} lines={[
      {t: 'توصيل مجاني', at: 2, size: 112},
      {t: 'لكل العراق', at: S(21.9 - 20.9), gold: true, size: 112},
      {t: 'ضمان سنة للجديد', at: S(22.88 - 20.9), size: 92},
      {t: 'وشهر للمستعمل', at: S(23.3 - 20.9), gold: true, size: 92},
      {t: 'مع وصل ضمان', at: S(23.89 - 20.9), size: 62},
    ]} />
  </Panel>
);

const scene = (idx: number, lf: number) => {
  if (idx === 0) return <Hook lf={lf} />;
  if (idx <= 7) return <BrandS lf={lf} i={idx - 1} />;
  if (idx === 8) return <Used lf={lf} />;
  if (idx === 9) return <App lf={lf} />;
  if (idx === 10) return <Discount lf={lf} />;
  return <Offers lf={lf} />;
};
const idxAt = (f: number) => { let k = 0; for (let i = 0; i < STARTS.length; i++) if (f >= S(STARTS[i])) k = i; return k; };

export const ShowcaseRef: React.FC = () => {
  const f = useCurrentFrame();
  const idx = idxAt(f);
  const lf = f - S(STARTS[idx]);
  const end = STARTS.length - 1;
  if (idx === end) return <AbsoluteFill style={{background: '#000'}}><EndCard /></AbsoluteFill>;
  const T = 8; // zoom-blur transition frames
  const p = clamp(lf / T);
  const prev = idx > 0 && lf < T ? idx - 1 : -1;
  const sweep = [1, 8, 9, 10, 11].includes(idx) && lf < 12; // light sweep on the bigger section changes
  return (
    <AbsoluteFill>
      <Backdrop f={f} />
      {prev >= 0 ? (
        <AbsoluteFill style={{opacity: 1 - p, transform: `scale(${1 + 0.14 * p})`, filter: `blur(${p * 18}px)`}}>{scene(prev, f - S(STARTS[prev]))}</AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{opacity: idx === 0 ? 1 : p, transform: `scale(${idx === 0 ? 1 : 0.9 + 0.1 * p})`, filter: idx === 0 || p >= 1 ? 'none' : `blur(${(1 - p) * 16}px)`}}>{scene(idx, lf)}</AbsoluteFill>
      {sweep ? <AbsoluteFill style={{background: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)', transform: `translateX(${interpolate(lf, [0, 12], [-1100, 1100])}px)`, opacity: 0.8}} /> : null}
      <Captions t={f / FPS} />
    </AbsoluteFill>
  );
};
