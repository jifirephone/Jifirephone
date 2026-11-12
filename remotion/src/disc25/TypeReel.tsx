// Ji Fire — Arabic kinetic-typography reel (2026-11-13), after the owner's 2nd reference (technique only):
// every word moves the way it means (scramble, cycle, strike, stretch, weight, type, stamp, echo, morph),
// hard cuts between cream and black, brand gold instead of the reference's orange.
// Content from the owner's site/store: brands in stock, jifirecode 25,000 (min 200,000), free delivery (on site),
// warranty 1 year new / 1 month used + receipt (owner 2026-11-12), address, links.
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color} from '../brand';
import {EndCard} from '../components/Brand';

const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
const F = 'Cairo';
const GOLD = color.gold, GD = '#B98800', INK = '#141210', CREAM = '#F3EFE6';
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

const DUR = [2.3, 2.3, 2.6, 2.6, 2.9, 2.5, 2.4, 2.6, 2.9, 2.3, 3.0, 3.2, 3.4];
const STARTS: number[] = [];
DUR.reduce((a, d, i) => { STARTS[i] = a; return a + d; }, 0);
export const TYPE_STARTS = STARTS;
export const TYPE_FRAMES = S(DUR.reduce((a, b) => a + b, 0));

const AR = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
const Center: React.FC<{children: React.ReactNode; dark: boolean; y?: number}> = ({children, dark, y = 0}) => (
  <AbsoluteFill style={{background: dark ? INK : CREAM, alignItems: 'center', justifyContent: 'center', fontFamily: F, direction: 'rtl', color: dark ? '#fff' : INK}}>
    <div style={{transform: `translateY(${y}px)`, textAlign: 'center', width: '100%'}}>{children}</div>
  </AbsoluteFill>
);
const Label: React.FC<{t: string; lf: number; at?: number; dark?: boolean}> = ({t, lf, at = 0, dark}) => {
  const n = Math.floor(clamp((lf - at) / 10) * t.length);
  return <div style={{fontSize: 46, fontWeight: 800, color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(20,18,16,0.6)', marginBottom: 20}}>{t.slice(0, n)}</div>;
};

// 1 scramble → «تدور موبايل؟»
const Scramble: React.FC<{lf: number}> = ({lf}) => {
  const target = 'تدور موبايل؟';
  const out = target.split('').map((ch, i) => {
    const lock = 6 + i * 2.2;
    if (ch === ' ' || ch === '؟' || lf >= lock) return ch;
    if (lf < i * 1.2) return '';
    return AR[Math.floor(random(`s${i}-${Math.floor(lf / 2)}`) * AR.length)];
  }).join('');
  const done = lf >= 6 + target.length * 2.2;
  return <Center dark><div style={{fontSize: 150, fontWeight: 900, color: done ? '#fff' : 'rgba(255,255,255,0.85)'}}>{out}</div>
    <div style={{height: 10, width: done ? 360 : 0, background: GOLD, margin: '18px auto 0', transition: 'none'}} /></Center>;
};

// 2 assemble → «كل الماركات»
const Assemble: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const letters = 'كل الماركات'.split('');
  const joined = clamp((lf - 30) / 6);
  return (
    <Center dark={false}>
      <Label t="الماركات..." lf={lf} />
      <div style={{position: 'relative', height: 200}}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', direction: 'rtl', opacity: 1 - joined}}>
          {letters.map((ch, i) => {
            const a = spring({frame: lf - i * 2, fps, config: {damping: 14, stiffness: 120}});
            const rx = (random(`ax${i}`) - 0.5) * 900, ry = (random(`ay${i}`) - 0.5) * 900;
            return <span key={i} style={{display: 'inline-block', fontSize: 160, fontWeight: 900, width: ch === ' ' ? 50 : 'auto', transform: `translate(${(1 - a) * rx}px, ${(1 - a) * ry}px) rotate(${(1 - a) * (rx / 6)}deg)`, opacity: a}}>{ch}</span>;
          })}
        </div>
        <div style={{position: 'absolute', inset: 0, fontSize: 160, fontWeight: 900, opacity: joined}}>كل الماركات</div>
      </div>
    </Center>
  );
};

// 3 cycle brand names → «كلها عدنا»
const Cycle: React.FC<{lf: number}> = ({lf}) => {
  const names = ['iPhone', 'Samsung', 'realme', 'Xiaomi', 'TECNO', 'Infinix', 'Tablets'];
  const k = Math.floor(lf / 7);
  const final = k >= names.length;
  const w = final ? 'كلها عدنا' : names[k];
  const pop = clamp((lf % 7) / 3);
  return (
    <Center dark>
      <div style={{fontSize: final ? 150 : 170, fontWeight: 900, direction: final ? 'rtl' : 'ltr', color: final ? GOLD : '#fff', transform: `scale(${final ? 1 : 0.9 + 0.1 * pop})`}}>{w}</div>
      <div style={{marginTop: 26, fontSize: 40, fontWeight: 800, color: 'rgba(255,255,255,0.55)', direction: 'ltr'}}>{final ? '' : `${String(k + 1).padStart(2, '0')} / ${String(names.length).padStart(2, '0')}`}</div>
    </Center>
  );
};

// 4 strike «تدوّر بالسوق» → «اطلب من بيتك»
const Strike: React.FC<{lf: number}> = ({lf}) => {
  const line = ease((lf - 18) / 10);
  const nxt = spring({frame: lf - 40, fps: FPS, config: {damping: 13, stiffness: 160}});
  return (
    <Center dark={false}>
      <div style={{position: 'relative', display: 'inline-block', fontSize: 130, fontWeight: 900, opacity: 1 - 0.55 * line}}>
        تدوّر بالسوق
        <div style={{position: 'absolute', top: '52%', right: 0, height: 16, width: `${line * 104}%`, background: '#C8312B', borderRadius: 8, transform: 'rotate(-3deg)'}} />
      </div>
      <div style={{marginTop: 40, fontSize: 130, fontWeight: 900, color: GD, opacity: nxt, transform: `translateY(${(1 - nxt) * 60}px)`}}>اطلب من بيتك</div>
    </Center>
  );
};

// 5 the real site in a phone + typed address with highlight block
const Site: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const url = 'jifirephone.com';
  const n = Math.floor(clamp((lf - 4) / 20) * url.length);
  const ph = spring({frame: lf - 6, fps, config: {damping: 15, stiffness: 110}});
  const sc = interpolate(lf, [16, S(2.9)], [0, -1100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: INK, alignItems: 'center', fontFamily: F}}>
      <div style={{marginTop: 300, direction: 'ltr', display: 'flex', alignItems: 'center'}}>
        <span style={{fontSize: 72, fontWeight: 900, color: INK, background: GOLD, padding: '0 18px', borderRadius: 12}}>{url.slice(0, n)}</span>
        <span style={{width: 8, height: 80, background: '#fff', marginLeft: 6, opacity: lf % 14 < 7 ? 1 : 0}} />
      </div>
      <div style={{marginTop: 50, width: 450, height: 900, borderRadius: 60, border: '10px solid #2c2a27', background: '#fff', overflow: 'hidden', position: 'relative',
        transform: `translateY(${(1 - ph) * 500}px)`, boxShadow: '0 40px 80px rgba(0,0,0,0.6)'}}>
        <Img src={staticFile('type/site.jpg')} style={{position: 'absolute', top: sc, left: 0, width: 430}} />
      </div>
    </AbsoluteFill>
  );
};

// 6 kashida stretch «توصيل مجاني»
const Stretch: React.FC<{lf: number}> = ({lf}) => {
  const k = Math.round(ease((lf - 6) / 30) * 6);
  return (
    <Center dark={false}>
      <Label t="لكل العراق..." lf={lf} />
      <div style={{fontSize: 112, fontWeight: 900, whiteSpace: 'nowrap'}}>توصيـ{'ـ'.repeat(k)}ـل <span style={{color: GD}}>مجاني</span></div>
      <div style={{height: 8, width: 260 + k * 50, background: GOLD, margin: '10px auto 0', borderRadius: 4}} />
    </Center>
  );
};

// 7 weight thin → heavy «خصم 25,000»
const Weight: React.FC<{lf: number}> = ({lf}) => {
  const w = Math.round(200 + 800 * ease((lf - 8) / 26));
  const arrows = clamp((lf - 8) / 6) * (1 - clamp((lf - 40) / 8));
  return (
    <Center dark>
      <div style={{fontSize: 46, color: GOLD, letterSpacing: 12, opacity: arrows}}>▼ ▼ ▼</div>
      <div style={{fontSize: 140, fontWeight: w, lineHeight: 1.1}}>خصم</div>
      <div style={{fontSize: 190, fontWeight: w, lineHeight: 1, color: GOLD, direction: 'ltr'}}>25,000</div>
      <div style={{fontSize: 56, fontWeight: 800, marginTop: 8}}>دينار</div>
    </Center>
  );
};

// 8 typed code in a highlight block
const Code: React.FC<{lf: number}> = ({lf}) => {
  const code = 'jifirecode';
  const n = Math.floor(clamp((lf - 12) / 26) * code.length);
  const box = ease((lf - 10) / 6);
  return (
    <Center dark={false}>
      <Label t="بالكود..." lf={lf} />
      <div style={{display: 'inline-flex', alignItems: 'center', direction: 'ltr'}}>
        <span style={{fontSize: 140, fontWeight: 900, background: GOLD, color: INK, padding: '0 26px', borderRadius: 18, minWidth: 40, transform: `scaleX(${box})`, transformOrigin: 'left'}}>{code.slice(0, n) || ' '}</span>
        <span style={{width: 10, height: 150, background: INK, marginLeft: 8, opacity: lf % 14 < 7 ? 1 : 0}} />
      </div>
      <div style={{marginTop: 34, fontSize: 46, fontWeight: 800, color: 'rgba(20,18,16,0.6)', opacity: clamp((lf - 44) / 8)}}>للطلبات من <span style={{direction: 'ltr', unicodeBidi: 'isolate'}}>200,000</span> د.ع وفوك</div>
    </Center>
  );
};

// 9 stamp «مضمون» on «وصل ضمان»
const Stamp: React.FC<{lf: number}> = ({lf}) => {
  const at = 22;
  const p = clamp((lf - at) / 5);
  const sc = lf < at ? 0 : 2.6 - 1.6 * ease(p);
  const shake = lf >= at + 5 && lf < at + 11 ? Math.sin((lf - at) * 3) * 10 * (1 - (lf - at - 5) / 6) : 0;
  const sub = clamp((lf - at - 12) / 8);
  return (
    <AbsoluteFill style={{background: INK, transform: `translate(${shake}px, ${-shake / 2}px)`}}>
      <Center dark>
        <Label t="وصل ضمان..." lf={lf} dark />
        <div style={{display: 'inline-block', marginTop: 10, padding: '6px 46px', border: `10px solid ${GOLD}`, outline: `3px solid ${GOLD}`, outlineOffset: 8, borderRadius: 18,
          fontSize: 150, fontWeight: 900, color: GOLD, transform: `rotate(-9deg) scale(${sc})`, opacity: lf < at ? 0 : clamp(p * 1.5),
          maskImage: 'radial-gradient(circle at 30% 40%, #000 55%, rgba(0,0,0,0.75) 70%, #000 85%)', WebkitMaskImage: 'radial-gradient(circle at 30% 40%, #000 55%, rgba(0,0,0,0.75) 70%, #000 85%)'}}>مضمون</div>
        <div style={{marginTop: 70, fontSize: 54, fontWeight: 900, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)`}}>سنة للجديد <span style={{color: GOLD}}>·</span> شهر للمستعمل</div>
      </Center>
    </AbsoluteFill>
  );
};

// 10 echo «مستعمل نظيف»
const Echo: React.FC<{lf: number}> = ({lf}) => {
  const n = 5;
  return (
    <Center dark={false}>
      <Label t="وأجهزة..." lf={lf} />
      <div style={{position: 'relative', height: 220}}>
        {[...Array(n)].map((_, i) => {
          const a = clamp((lf - 8 - i * 3) / 6);
          return [-1, 1].map((s) => <div key={i + '' + s} style={{position: 'absolute', left: 0, right: 0, fontSize: 118, fontWeight: 900, whiteSpace: 'nowrap', color: 'transparent', WebkitTextStroke: '2px rgba(20,18,16,0.35)',
            transform: `translateY(${s * (i + 1) * 64 * a}px)`, opacity: a * (1 - i / n)}}>مستعمل نظيف</div>);
        })}
        <div style={{position: 'absolute', left: 0, right: 0, fontSize: 118, fontWeight: 900, whiteSpace: 'nowrap', color: GD}}>مستعمل نظيف</div>
      </div>
    </Center>
  );
};

// 11 morph «حمّل التطبيق» → «جي فاير للموبايل»
const Morph: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const inA = spring({frame: lf, fps, config: {damping: 14, stiffness: 160}});
  const out = ease((lf - 36) / 10);
  const inB = spring({frame: lf - 42, fps, config: {damping: 13, stiffness: 150}});
  const flash = clamp(1 - Math.abs(lf - 42) / 5);
  return (
    <Center dark>
      <div style={{position: 'relative', height: 360}}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: inA * (1 - out), filter: `blur(${out * 18}px)`, transform: `scaleX(${1 - 0.7 * out}) scale(${0.85 + 0.15 * inA})`}}>
          <div style={{width: 130, height: 130, borderRadius: 32, background: '#000', border: `3px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
            <Img src={staticFile('logo.png')} style={{width: 110}} /></div>
          <div style={{fontSize: 130, fontWeight: 900}}>حمّل <span style={{color: GOLD}}>التطبيق</span></div>
        </div>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: clamp(inB * 1.3),
          filter: `blur(${(1 - inB) * 16}px)`, transform: `scaleX(${0.3 + 0.7 * inB})`}}>
          <div style={{fontSize: 140, fontWeight: 900, lineHeight: 1.15}}>جي فاير</div>
          <div style={{fontSize: 140, fontWeight: 900, lineHeight: 1.15, color: GOLD}}>للموبايل</div>
        </div>
      </div>
      <AbsoluteFill style={{background: `radial-gradient(circle, rgba(243,180,6,${0.55 * flash}) 0%, rgba(243,180,6,0) 60%)`}} />
    </Center>
  );
};

// 12 brand card (address + links), like the reference's profile card
const Card: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 15}});
  const rows: [string, string][] = [['الموقع', 'jifirephone.com'], ['التطبيق', 'app.jifrephone.workers.dev'], ['المحل', 'النجف · ميلاد · شارع الحولي']];
  return (
    <Center dark={false}>
      <div style={{width: 130 * a + 60, height: 190, margin: '0 auto', borderRadius: 40, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: a}}>
        <Img src={staticFile('logo.png')} style={{width: 160 * a}} /></div>
      <div style={{marginTop: 26, fontSize: 84, fontWeight: 900, opacity: a}}>جي فاير للموبايل</div>
      <div style={{fontSize: 40, fontWeight: 800, color: GD, opacity: a}}>التقنية باعلى ذروتها</div>
      <div style={{width: 820, margin: '36px auto 0'}}>
        {rows.map(([k, v], i) => {
          const r = spring({frame: lf - 12 - i * 6, fps, config: {damping: 15}});
          return <div key={k} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 26px', marginTop: 14, borderRadius: 20, background: '#fff', border: '1.5px solid #e4dccb',
            opacity: r, transform: `translateX(${(1 - r) * 120}px)`}}>
            <span style={{fontSize: 36, fontWeight: 900, color: GD}}>{k}</span>
            <span style={{fontSize: 36, fontWeight: 800, direction: /[a-z]/.test(v) ? 'ltr' : 'rtl'}}>{v}</span></div>;
        })}
      </div>
    </Center>
  );
};

const SCENES = [Scramble, Assemble, Cycle, Strike, Site, Stretch, Weight, Code, Stamp, Echo, Morph, Card];

export const TypeReel: React.FC = () => {
  const f = useCurrentFrame();
  let idx = 0;
  for (let i = 0; i < STARTS.length; i++) if (f >= S(STARTS[i])) idx = i;
  const lf = f - S(STARTS[idx]);
  if (idx === STARTS.length - 1) return <AbsoluteFill style={{background: '#000'}}><EndCard /></AbsoluteFill>;
  // cut styles alternate: hard cut + quick flash / diagonal slice / vertical push
  const kind = idx % 3;
  const p = clamp(lf / 7);
  const style: React.CSSProperties = idx === 0 ? {} : kind === 0 ? {} : kind === 1
    ? {clipPath: `polygon(0 0, ${ease(p) * 140}% 0, ${ease(p) * 140 - 40}% 100%, 0 100%)`}
    : {transform: `translateY(${(1 - ease(p)) * 260}px)`};
  const flash = idx > 0 && kind === 0 ? clamp(1 - lf / 3) : 0;
  return (
    <AbsoluteFill style={{background: idx % 2 ? INK : CREAM}}>
      <AbsoluteFill style={style}>{React.createElement(SCENES[idx], {lf})}</AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: flash * 0.8}} />
      <div style={{position: 'absolute', top: 236, right: 64, width: 150, height: 90, borderRadius: 20, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Img src={staticFile('logo.png')} style={{width: 124}} /></div>
    </AbsoluteFill>
  );
};
