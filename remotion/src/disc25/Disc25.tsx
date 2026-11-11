// Ji Fire — 25,000 IQD discount + free delivery promo (2026-11-11).
// Motion graphics (no talking head): strong hook, varied transitions, on-screen captions.
// Facts verified read-only on Shopify: code jifirecode ACTIVE, 25,000 IQD off, min 200,000 IQD.
// Free delivery is owner-stated. Built brand-forward from the real store (jifirephone.com).
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color} from '../brand';
import {EndCard, LogoBug} from '../components/Brand';

const FPS = 30;
const S = (s: number) => Math.round(s * FPS);

// scene durations (seconds)
const DUR = [4.0, 5.6, 4.6, 5.6, 2.6, 3.6];
const STARTS: number[] = [];
DUR.reduce((acc, d, i) => { STARTS[i] = acc; return acc + d; }, 0);
const TOTAL = DUR.reduce((a, b) => a + b, 0);
export const DISC25_FRAMES = S(TOTAL);
const TW = 0.46; // crossfade window (s)

const F = 'Cairo';
const GOLD = color.gold, GOLDD = color.goldDeep, W = color.white;

const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

// ---- shared background: luxury black-gold, never fully still ----
const Bg: React.FC<{lf: number; tone?: number}> = ({lf, tone = 0}) => {
  const d = lf / FPS;
  const drift = Math.sin(d * 0.5) * 18;
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 90% at ${50 + drift / 6}% ${18 + tone * 4}%, #2a2113 0%, #140f08 46%, #070502 100%)`}}>
      <div style={{position: 'absolute', width: 900, height: 900, left: -220 + drift, top: 180 - drift, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(243,180,6,0.16), rgba(243,180,6,0) 68%)', filter: 'blur(8px)'}} />
      <div style={{position: 'absolute', width: 760, height: 760, right: -200 - drift, bottom: 120 + drift, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,217,102,0.12), rgba(255,217,102,0) 66%)', filter: 'blur(8px)'}} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 420px rgba(0,0,0,0.85)'}} />
    </AbsoluteFill>
  );
};

const Coin: React.FC<{x: number; y: number; r: number; lf: number; delay: number}> = ({x, y, r, lf, delay}) => {
  const d = (lf - delay) / FPS;
  const yy = y - ((d * 60) % 420);
  const op = interpolate((d * 60) % 420, [0, 60, 360, 420], [0, 0.5, 0.5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sp = Math.sin(d * 3 + delay) * 0.5 + 0.5;
  return (
    <div style={{position: 'absolute', left: x, top: yy, width: r, height: r, borderRadius: '50%',
      background: `linear-gradient(135deg, #FFE79A, ${GOLD} 55%, ${GOLDD})`, opacity: op,
      transform: `scaleX(${0.5 + 0.5 * sp})`, boxShadow: '0 4px 10px rgba(0,0,0,0.4)'}} />
  );
};

// English runs stay LTR inside RTL text
const latin = (s: string) => <span style={{direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block'}}>{s}</span>;

const shadow = {textShadow: '0 5px 0 rgba(0,0,0,0.6), 0 12px 26px rgba(0,0,0,0.6)'} as const;

// ============ SCENES ============

// S1 — hook
const Hook: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 14, stiffness: 150}});
  const b = spring({frame: lf - 22, fps, config: {damping: 13, stiffness: 160}});
  const c = interpolate(lf, [40, 58], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{fontFamily: F, direction: 'rtl', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{width: 940, marginTop: -40}}>
        <div style={{fontSize: 118, fontWeight: 900, color: W, lineHeight: 1.08, transform: `translateY(${(1 - a) * 70}px)`, opacity: a, ...shadow}}>
          تريد خصم <span style={{color: GOLD, whiteSpace: 'nowrap'}}>25 ألف؟</span>
        </div>
        <div style={{fontSize: 118, fontWeight: 900, color: W, lineHeight: 1.1, marginTop: 14, transform: `translateY(${(1 - b) * 70}px)`, opacity: b, ...shadow}}>
          و<span style={{color: GOLD}}>توصيل مجاني؟</span>
        </div>
        <div style={{marginTop: 40, fontSize: 46, fontWeight: 800, color: '#E7Dcc3', opacity: c}}>
          من <span style={{color: GOLD}}>جي فاير للموبايل</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// S2 — offer badges + hero phone
const Offer: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 15}});
  const b = spring({frame: lf - 18, fps, config: {damping: 14}});
  const ph = spring({frame: lf - 10, fps, config: {damping: 18, stiffness: 90}});
  const sub = interpolate(lf, [40, 58], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const float = Math.sin(lf / FPS * 1.4) * 12;
  return (
    <AbsoluteFill style={{fontFamily: F, direction: 'rtl'}}>
      {/* hero phone, right, drifting */}
      <Img src={staticFile('disc25/iphone16.png')} style={{position: 'absolute', right: -70, bottom: 300,
        width: 520, transform: `translateY(${float - (1 - ph) * 60}px) rotate(${8 - (1 - ph) * 6}deg)`, opacity: ph,
        filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))'}} />
      <div style={{position: 'absolute', top: 410, right: 64, left: 64}}>
        <div style={{fontSize: 44, fontWeight: 800, color: '#E7DCC3', opacity: a, transform: `translateX(${(1 - a) * 50}px)`}}>عرض خاص</div>
        {/* 25,000 badge */}
        <div style={{display: 'inline-block', marginTop: 16, padding: '18px 34px', borderRadius: 26,
          background: `linear-gradient(135deg, #FFE79A, ${GOLD} 55%, ${GOLDD})`, opacity: a,
          transform: `translateX(${(1 - a) * 80}px) scale(${0.9 + 0.1 * a})`, boxShadow: '0 16px 40px rgba(243,180,6,0.35)'}}>
          <span style={{fontSize: 40, fontWeight: 900, color: '#2a1f05'}}>خصم </span>
          <span style={{fontSize: 96, fontWeight: 900, color: '#1b1405'}}>{latin('25,000')}</span>
          <span style={{fontSize: 44, fontWeight: 900, color: '#2a1f05'}}> د.ع</span>
        </div>
        {/* free delivery */}
        <div style={{marginTop: 22, opacity: b, transform: `translateX(${(1 - b) * 80}px)`, display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{width: 74, height: 74, borderRadius: 18, background: 'rgba(243,180,6,0.14)', border: `2px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Truck />
          </div>
          <div style={{fontSize: 62, fontWeight: 900, color: W, ...shadow}}>توصيل <span style={{color: GOLD}}>مجاني</span></div>
        </div>
        <div style={{marginTop: 26, fontSize: 40, fontWeight: 800, color: '#CFC7B2', opacity: sub}}>كل المنتجات مشمولة</div>
      </div>
    </AbsoluteFill>
  );
};

const Truck: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 3h13v11H1zM14 7h4l3 3v4h-7z" /><circle cx="5.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" />
  </svg>
);

// S3 — download the app
const App: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 15}});
  const ph = spring({frame: lf - 12, fps, config: {damping: 16, stiffness: 95}});
  const pills = interpolate(lf, [34, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const blur = (1 - a) * 14;
  const float = Math.sin(lf / FPS * 1.5) * 10;
  return (
    <AbsoluteFill style={{fontFamily: F, direction: 'rtl', alignItems: 'center'}}>
      <div style={{marginTop: 300, fontSize: 86, fontWeight: 900, color: W, opacity: a, filter: `blur(${blur}px)`, ...shadow, textAlign: 'center'}}>
        نزّل <span style={{color: GOLD}}>التطبيق</span>
      </div>
      {/* phone with app */}
      <div style={{marginTop: 50, width: 360, height: 740, borderRadius: 54, background: 'linear-gradient(160deg,#1b1b1f,#0a0a0c)',
        border: '8px solid #2b2b31', boxShadow: '0 40px 70px rgba(0,0,0,0.6)', opacity: ph,
        transform: `translateY(${float - (1 - ph) * 50}px) scale(${0.92 + 0.08 * ph})`, overflow: 'hidden', position: 'relative'}}>
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 150, background: `linear-gradient(135deg, ${GOLDD}, ${GOLD})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Img src={staticFile('logo.png')} style={{width: 150, filter: 'brightness(0) invert(1)'}} />
        </div>
        <div style={{position: 'absolute', top: 180, left: 22, right: 22, display: 'flex', flexDirection: 'column', gap: 16}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{height: 120, borderRadius: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: 14, gap: 14}}>
              <div style={{width: 92, height: 92, borderRadius: 12, background: `linear-gradient(135deg,#3a3320,${i === 1 ? GOLD : '#2a2a30'})`}} />
              <div style={{flex: 1}}>
                <div style={{height: 20, width: '72%', borderRadius: 6, background: 'rgba(255,255,255,0.22)'}} />
                <div style={{height: 24, width: 150, borderRadius: 6, background: GOLD, marginTop: 14}} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* store pills */}
      <div style={{marginTop: 34, display: 'flex', gap: 20, opacity: pills, transform: `translateY(${(1 - pills) * 30}px)`}}>
        <StorePill top="قريباً على" big="App Store" />
        <StorePill top="حمّله من" big="Google Play" />
      </div>
    </AbsoluteFill>
  );
};

const StorePill: React.FC<{top: string; big: string}> = ({top, big}) => (
  <div style={{padding: '14px 26px', borderRadius: 16, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.25)', textAlign: 'center'}}>
    <div style={{fontSize: 24, fontWeight: 700, color: '#CFC7B2'}}>{top}</div>
    <div style={{fontSize: 36, fontWeight: 900, color: W, direction: 'ltr'}}>{big}</div>
  </div>
);

// S4 — the code (gift coupon)
const Code: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 15}});
  const drop = spring({frame: lf - 10, fps, config: {damping: 12, stiffness: 120}});
  const copy = interpolate(lf, [46, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shine = interpolate(lf % 90, [0, 45, 90], [-200, 200, -200]);
  return (
    <AbsoluteFill style={{fontFamily: F, direction: 'rtl', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontSize: 70, fontWeight: 900, color: W, marginTop: -120, opacity: a, transform: `translateY(${(1 - a) * 40}px)`, ...shadow}}>
        حطّ <span style={{color: GOLD}}>كود الخصم</span>
      </div>
      {/* coupon ticket */}
      <div style={{position: 'relative', marginTop: 44, width: 820, padding: '48px 40px', borderRadius: 30,
        background: '#FFFDF6', border: `3px dashed ${GOLDD}`, opacity: drop,
        transform: `translateY(${(1 - drop) * 90}px) scale(${0.92 + 0.08 * drop})`, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', overflow: 'hidden', textAlign: 'center'}}>
        <div style={{position: 'absolute', top: 0, bottom: 0, width: 120, left: shine, background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.7), transparent)', transform: 'skewX(-18deg)'}} />
        <div style={{fontSize: 34, fontWeight: 800, color: '#9a7b2e'}}>كود الخصم</div>
        <div style={{fontSize: 108, fontWeight: 900, color: '#17150f', letterSpacing: 2, direction: 'ltr', lineHeight: 1.1}}>jifirecode</div>
        <div style={{display: 'inline-block', marginTop: 20, padding: '14px 40px', borderRadius: 16, opacity: copy,
          background: `linear-gradient(135deg, #FFD966, ${GOLD})`, fontSize: 36, fontWeight: 900, color: '#2a1f05'}}>انسخه وحطّه بالتطبيق</div>
      </div>
      <div style={{marginTop: 34, fontSize: 40, fontWeight: 800, color: '#E7DCC3', opacity: copy}}>واستفد من الخصم فوراً</div>
    </AbsoluteFill>
  );
};

// S5 — note
const Note: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 16}});
  return (
    <AbsoluteFill style={{fontFamily: F, direction: 'rtl', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '34px 48px', borderRadius: 24,
        background: 'rgba(243,180,6,0.1)', border: `2px solid ${GOLD}`, opacity: a, transform: `scale(${0.9 + 0.1 * a})`}}>
        <div style={{width: 64, height: 64, borderRadius: '50%', border: `3px solid ${GOLD}`, color: GOLD, fontSize: 44, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>!</div>
        <div style={{fontSize: 54, fontWeight: 900, color: W}}>أقل فاتورة <span style={{color: GOLD}}>{latin('200,000')} د.ع</span></div>
      </div>
    </AbsoluteFill>
  );
};

// ---- transition wrappers (varied per scene) ----
const enterStyle = (idx: number, p: number): React.CSSProperties => {
  const e = ease(p);
  switch (idx) {
    case 1: return {transform: `translateX(${(1 - e) * 120}px)`, opacity: e};           // slide
    case 2: return {transform: `scale(${0.8 + 0.2 * e})`, opacity: e, filter: `blur(${(1 - e) * 16}px)`}; // blur-scale
    case 3: return {transform: `translateY(${(1 - e) * -120}px)`, opacity: e};          // drop
    case 4: return {clipPath: `inset(0 ${(1 - e) * 100}% 0 0)`, opacity: 1};             // wipe (RTL)
    case 5: return {transform: `scale(${1.08 - 0.08 * e})`, opacity: e};                 // settle
    default: return {opacity: e};
  }
};

const SCENES = [Hook, Offer, App, Code, Note];

export const Disc25: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  // find current scene
  let idx = 0;
  for (let i = 0; i < DUR.length; i++) { if (sec >= STARTS[i]) idx = i; }
  const isEnd = idx === DUR.length - 1;
  const lf = f - S(STARTS[idx]);
  const enterP = Math.min(1, lf / S(TW));

  return (
    <AbsoluteFill style={{background: color.black}}>
      {isEnd ? (
        <EndCard />
      ) : (
        <>
          <Bg lf={lf} tone={idx} />
          <Coin x={180} y={1500} r={26} lf={lf} delay={0} />
          <Coin x={840} y={1600} r={20} lf={lf} delay={30} />
          <Coin x={520} y={1700} r={16} lf={lf} delay={60} />
          <AbsoluteFill style={enterStyle(idx, enterP)}>
            {React.createElement(SCENES[idx], {lf})}
          </AbsoluteFill>
          <LogoBug />
        </>
      )}
    </AbsoluteFill>
  );
};
