// Ji Fire — pick a phone on the site + apply the discount (2026-11-11).
// Motion graphics + on-screen captions, timed to an 8-line VO (voiceover_disc25b).
// Products & price read live from the store (HONOR X9e Pro from 639,000 IQD; POCO F9 Ultra 1,425,000 IQD).
// Code jifirecode verified ACTIVE (25,000 IQD, min 200,000). Free delivery shown on the site.
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color} from '../brand';
import {EndCard, LogoBug} from '../components/Brand';

const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
const DUR = [2.9, 2.9, 4.5, 3.0, 3.3, 3.8, 2.5, 3.3, 3.5];
const STARTS: number[] = [];
DUR.reduce((a, d, i) => { STARTS[i] = a; return a + d; }, 0);
const TOTAL = DUR.reduce((a, b) => a + b, 0);
export const DISC25B_FRAMES = S(TOTAL);
const TW = 0.46;
const F = 'Cairo';
const GOLD = color.gold, GOLDD = color.goldDeep, W = color.white;
const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const latin = (s: string) => <span style={{direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block'}}>{s}</span>;
const shadow = {textShadow: '0 5px 0 rgba(0,0,0,0.6), 0 12px 26px rgba(0,0,0,0.6)'} as const;

const Bg: React.FC<{lf: number; tone?: number}> = ({lf, tone = 0}) => {
  const d = lf / FPS; const drift = Math.sin(d * 0.5) * 18;
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 90% at ${50 + drift / 6}% ${18 + tone * 4}%, #2a2113 0%, #140f08 46%, #070502 100%)`}}>
      <div style={{position: 'absolute', width: 900, height: 900, left: -220 + drift, top: 180 - drift, borderRadius: '50%', background: 'radial-gradient(circle, rgba(243,180,6,0.15), rgba(243,180,6,0) 68%)', filter: 'blur(8px)'}} />
      <div style={{position: 'absolute', width: 760, height: 760, right: -200 - drift, bottom: 120 + drift, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,217,102,0.11), rgba(255,217,102,0) 66%)', filter: 'blur(8px)'}} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 420px rgba(0,0,0,0.85)'}} />
    </AbsoluteFill>
  );
};

const Caption: React.FC<{lf: number; children: React.ReactNode}> = ({lf, children}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf - 2, fps, config: {damping: 16}});
  return (
    <div style={{position: 'absolute', bottom: 470, right: 64, left: 64, textAlign: 'center', fontFamily: F, direction: 'rtl',
      fontSize: 58, fontWeight: 900, color: W, opacity: a, transform: `translateY(${(1 - a) * 26}px)`, ...shadow}}>{children}</div>
  );
};

const Truck: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 3h13v11H1zM14 7h4l3 3v4h-7z" /><circle cx="5.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" />
  </svg>
);

// ---- scenes ----
const Hook: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 14, stiffness: 150}});
  const b = spring({frame: lf - 20, fps, config: {damping: 13, stiffness: 160}});
  return (
    <AbsoluteFill style={{fontFamily: F, direction: 'rtl', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{width: 960, marginTop: -30}}>
        <div style={{fontSize: 110, fontWeight: 900, color: W, lineHeight: 1.1, opacity: a, transform: `translateY(${(1 - a) * 60}px)`, ...shadow}}>تدور موبايل جديد</div>
        <div style={{fontSize: 110, fontWeight: 900, color: GOLD, lineHeight: 1.12, marginTop: 10, opacity: b, transform: `translateY(${(1 - b) * 60}px)`, ...shadow}}>وبسعر يعجبك؟</div>
      </div>
    </AbsoluteFill>
  );
};

// phone frame showing the real site, with a tap marker
const Browse: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const ph = spring({frame: lf, fps, config: {damping: 16, stiffness: 95}});
  const scroll = interpolate(lf, [10, 60], [0, -260], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tap = Math.max(0, Math.sin((lf - 40) / FPS * 6)) * interpolate(lf, [40, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const float = Math.sin(lf / FPS * 1.4) * 8;
  return (
    <AbsoluteFill style={{fontFamily: F, direction: 'rtl', alignItems: 'center'}}>
      <div style={{marginTop: 430, width: 430, height: 880, borderRadius: 56, background: '#000', border: '9px solid #2b2b31',
        boxShadow: '0 44px 80px rgba(0,0,0,0.6)', overflow: 'hidden', position: 'relative', opacity: ph,
        transform: `translateY(${float - (1 - ph) * 50}px) scale(${0.92 + 0.08 * ph})`}}>
        <Img src={staticFile('disc25b/honor_page.jpg')} style={{position: 'absolute', top: scroll, left: 0, width: 430}} />
        {/* tap marker over add-to-cart area */}
        <div style={{position: 'absolute', left: 150, top: 560 + scroll, width: 90, height: 90, borderRadius: '50%', border: `5px solid ${GOLD}`, opacity: tap, transform: `scale(${0.7 + 0.5 * tap})`}} />
      </div>
      <Caption lf={lf}>ادخل الموقع واختار</Caption>
    </AbsoluteFill>
  );
};

const Chip: React.FC<{children: React.ReactNode; d: number; lf: number}> = ({children, d, lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf - d, fps, config: {damping: 15}});
  return <span style={{display: 'inline-block', margin: '6px 6px', padding: '10px 20px', borderRadius: 14, background: 'rgba(243,180,6,0.14)', border: `1.6px solid ${GOLD}`, color: W, fontSize: 32, fontWeight: 800, opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>{children}</span>;
};

const Product: React.FC<{lf: number; img: string; name: string; price: React.ReactNode; chips?: string[]; cap: string; white?: boolean}> = ({lf, img, name, price, chips, cap, white}) => {
  const {fps} = useVideoConfig();
  const card = spring({frame: lf, fps, config: {damping: 16, stiffness: 95}});
  const info = spring({frame: lf - 10, fps, config: {damping: 15}});
  const float = Math.sin(lf / FPS * 1.4) * 10;
  return (
    <AbsoluteFill style={{fontFamily: F, direction: 'rtl', alignItems: 'center'}}>
      <div style={{marginTop: 360, width: 560, borderRadius: 34, background: white ? '#fff' : 'linear-gradient(160deg,#1c1813,#0b0906)',
        border: `2px solid ${GOLD}`, boxShadow: '0 36px 70px rgba(0,0,0,0.55)', overflow: 'hidden', opacity: card,
        transform: `translateY(${float - (1 - card) * 60}px) scale(${0.9 + 0.1 * card})`}}>
        <Img src={staticFile(img)} style={{width: 560, height: 560, objectFit: 'contain', background: white ? '#fff' : 'transparent'}} />
      </div>
      <div style={{marginTop: 26, textAlign: 'center', opacity: info, transform: `translateY(${(1 - info) * 26}px)`}}>
        <div style={{fontSize: 56, fontWeight: 900, color: W, direction: 'ltr', ...shadow}}>{name}</div>
        <div style={{marginTop: 10, fontSize: 48, fontWeight: 900, color: GOLD}}>{price}</div>
        {chips && <div style={{marginTop: 10, maxWidth: 880}}>{chips.map((c, i) => <Chip key={i} d={16 + i * 4} lf={lf}>{latin(c)}</Chip>)}</div>}
      </div>
      <Caption lf={lf}>{cap}</Caption>
    </AbsoluteFill>
  );
};

const Code: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 15}});
  const drop = spring({frame: lf - 8, fps, config: {damping: 12, stiffness: 120}});
  const shine = interpolate(lf % 80, [0, 40, 80], [-200, 220, -200]);
  return (
    <AbsoluteFill style={{fontFamily: F, direction: 'rtl', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontSize: 64, fontWeight: 900, color: W, marginTop: -150, opacity: a, ...shadow}}>وقت الطلب حطّ <span style={{color: GOLD}}>الكود</span></div>
      <div style={{position: 'relative', marginTop: 40, width: 820, padding: '46px 40px', borderRadius: 30, background: '#FFFDF6', border: `3px dashed ${GOLDD}`,
        opacity: drop, transform: `translateY(${(1 - drop) * 90}px) scale(${0.92 + 0.08 * drop})`, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', overflow: 'hidden', textAlign: 'center'}}>
        <div style={{position: 'absolute', top: 0, bottom: 0, width: 120, left: shine, background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.7), transparent)', transform: 'skewX(-18deg)'}} />
        <div style={{fontSize: 34, fontWeight: 800, color: '#9a7b2e'}}>كود الخصم</div>
        <div style={{fontSize: 104, fontWeight: 900, color: '#17150f', letterSpacing: 2, direction: 'ltr', lineHeight: 1.1}}>jifirecode</div>
      </div>
    </AbsoluteFill>
  );
};

const Applied: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 15}});
  const chk = spring({frame: lf - 6, fps, config: {damping: 11, stiffness: 140}});
  const del = spring({frame: lf - 26, fps, config: {damping: 15}});
  return (
    <AbsoluteFill style={{fontFamily: F, direction: 'rtl', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, opacity: a}}>
        <div style={{width: 92, height: 92, borderRadius: '50%', background: `linear-gradient(135deg,#FFD966,${GOLD})`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${chk})`}}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#2a1f05" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
        </div>
        <div style={{fontSize: 50, fontWeight: 900, color: W, ...shadow}}>تم تطبيق الكود</div>
      </div>
      <div style={{marginTop: 30, display: 'inline-block', padding: '20px 40px', borderRadius: 24, background: `linear-gradient(135deg,#FFE79A,${GOLD} 55%,${GOLDD})`, opacity: a, transform: `scale(${0.9 + 0.1 * a})`, boxShadow: '0 16px 40px rgba(243,180,6,0.35)'}}>
        <span style={{fontSize: 44, fontWeight: 900, color: '#2a1f05'}}>خصم </span>
        <span style={{fontSize: 92, fontWeight: 900, color: '#1b1405'}}>{latin('25,000')}</span>
        <span style={{fontSize: 44, fontWeight: 900, color: '#2a1f05'}}> د.ع</span>
      </div>
      <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 16, opacity: del, transform: `translateY(${(1 - del) * 24}px)`}}>
        <Truck /><div style={{fontSize: 48, fontWeight: 900, color: W, ...shadow}}>توصيل <span style={{color: GOLD}}>مجاني</span> لكل العراق</div>
      </div>
    </AbsoluteFill>
  );
};

const Note: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 16}});
  return (
    <AbsoluteFill style={{fontFamily: F, direction: 'rtl', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '32px 46px', borderRadius: 24, background: 'rgba(243,180,6,0.1)', border: `2px solid ${GOLD}`, opacity: a, transform: `scale(${0.9 + 0.1 * a})`}}>
        <div style={{width: 60, height: 60, borderRadius: '50%', border: `3px solid ${GOLD}`, color: GOLD, fontSize: 42, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>!</div>
        <div style={{fontSize: 52, fontWeight: 900, color: W}}>أقل فاتورة <span style={{color: GOLD}}>{latin('200,000')} د.ع</span></div>
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 15}});
  const pills = spring({frame: lf - 14, fps, config: {damping: 15}});
  return (
    <AbsoluteFill style={{fontFamily: F, direction: 'rtl', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{fontSize: 92, fontWeight: 900, color: W, opacity: a, transform: `translateY(${(1 - a) * 40}px)`, ...shadow}}>اطلب <span style={{color: GOLD}}>هسه</span></div>
      <div style={{marginTop: 34, display: 'flex', gap: 20, opacity: pills, transform: `translateY(${(1 - pills) * 26}px)`}}>
        <div style={{padding: '18px 30px', borderRadius: 18, background: `linear-gradient(135deg,#FFD966,${GOLD})`, fontSize: 40, fontWeight: 900, color: '#2a1f05'}}>من التطبيق</div>
        <div style={{padding: '18px 30px', borderRadius: 18, background: 'rgba(255,255,255,0.1)', border: '1.6px solid rgba(255,255,255,0.3)', fontSize: 40, fontWeight: 900, color: W}}>أو الموقع</div>
      </div>
    </AbsoluteFill>
  );
};

const enterStyle = (idx: number, p: number): React.CSSProperties => {
  const e = ease(p);
  switch (idx % 5) {
    case 1: return {transform: `translateX(${(1 - e) * 120}px)`, opacity: e};
    case 2: return {transform: `scale(${0.82 + 0.18 * e})`, opacity: e, filter: `blur(${(1 - e) * 14}px)`};
    case 3: return {transform: `translateY(${(1 - e) * -120}px)`, opacity: e};
    case 4: return {clipPath: `inset(0 ${(1 - e) * 100}% 0 0)`};
    default: return {opacity: e};
  }
};

export const Disc25b: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  let idx = 0;
  for (let i = 0; i < DUR.length; i++) { if (sec >= STARTS[i]) idx = i; }
  const isEnd = idx === DUR.length - 1;
  const lf = f - S(STARTS[idx]);
  const enterP = Math.min(1, lf / S(TW));

  const scene = () => {
    switch (idx) {
      case 0: return <Hook lf={lf} />;
      case 1: return <Browse lf={lf} />;
      case 2: return <Product lf={lf} img="disc25b/honor.jpg" name="HONOR X9e Pro" price={<>يبدأ من {latin('639,000')} د.ع</>} chips={['108MP', '11000mAh', 'AMOLED 120Hz', '5G']} cap="هونر X9e Pro" />;
      case 3: return <Product lf={lf} img="disc25b/poco.jpg" name="POCO F9 Ultra 5G" price={<>{latin('1,425,000')} د.ع</>} cap="أو POCO F9 Ultra" white />;
      case 4: return <Code lf={lf} />;
      case 5: return <Applied lf={lf} />;
      case 6: return <Note lf={lf} />;
      case 7: return <Cta lf={lf} />;
      default: return null;
    }
  };

  return (
    <AbsoluteFill style={{background: color.black}}>
      {isEnd ? <EndCard /> : (
        <>
          <Bg lf={lf} tone={idx} />
          <AbsoluteFill style={enterStyle(idx, enterP)}>{scene()}</AbsoluteFill>
          <LogoBug />
        </>
      )}
    </AbsoluteFill>
  );
};
