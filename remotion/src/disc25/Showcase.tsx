// Ji Fire — brand & device showcase (light style), 2026-11-12.
// Real catalog images (in-stock products read from the store). No prices shown.
// Offers: jifirecode 25,000 IQD (min 200,000, verified), free delivery (on site), warranty 1 year new / 1 month used + receipt (owner, 2026-11-12).
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color} from '../brand';
import {EndCard} from '../components/Brand';

const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
const F = 'Cairo';
const GOLD = color.gold, GOLDD = color.goldDeep, INK = '#15130e', CREAM = '#FBF7EC';
const ltr = (s: string) => <span style={{direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block'}}>{s}</span>;

type Dev = {img: string; name: string};
type Brand = {en: string; ar: string; tint: string; devs: Dev[]};
const BRANDS: Brand[] = [
  {en: 'iPhone', ar: 'آيفون', tint: '#F4F1EA', devs: [{img: 'ip17.jpg', name: 'iPhone 17 Pro Max'}, {img: 'ip18.png', name: 'iPhone 18 Pro Max'}, {img: 'ip13.jpg', name: 'iPhone 13 Pro Max'}]},
  {en: 'Samsung', ar: 'سامسونج', tint: '#EEF2FB', devs: [{img: 's26.png', name: 'Galaxy S26 Ultra'}, {img: 'a56.jpg', name: 'Galaxy A56 5G'}, {img: 'a17.png', name: 'Galaxy A17 5G'}]},
  {en: 'realme', ar: 'ريلمي', tint: '#FFF6DA', devs: [{img: 'rm16.jpg', name: 'realme 16 Pro+'}, {img: 'rm15.jpg', name: 'realme 15 5G'}, {img: 'rm14.jpg', name: 'realme 14 Pro+'}]},
  {en: 'Xiaomi', ar: 'شاومي', tint: '#FFEFE6', devs: [{img: 'rn14.jpg', name: 'Redmi Note 14 Pro+'}, {img: 'pf7.jpg', name: 'POCO F7 Ultra'}]},
  {en: 'TECNO', ar: 'تكنو', tint: '#E9F4FF', devs: [{img: 'tc40.jpg', name: 'Camon 40 Pro'}, {img: 'tp7.png', name: 'Pova 7 Ultra'}, {img: 'tps.jpg', name: 'Pova Slim'}]},
  {en: 'Infinix', ar: 'إنفنكس', tint: '#ECFBEF', devs: [{img: 'in60.png', name: 'Note 60 Pro'}, {img: 'gt50.jpg', name: 'GT 50 Pro'}]},
  {en: 'Tablets', ar: 'تابات', tint: '#F3EEFB', devs: [{img: 'x8b.png', name: 'Pad X8B'}, {img: 'bv60.jpg', name: 'Blackview Tab 60'}]},
];
// Cuts follow the owner's voice (Arafat Almnshid take 2, starts at 0.15 s; music-only gaps after the first brand names so they read slower): hook, 7 brands, used, app, discount, offers, end card.
const STARTS = [0, 2.2, 3.72, 5.15, 6.09, 7.14, 7.55, 8.73, 9.22, 11.41, 14.15, 20.9, 25.03];
const DUR = STARTS.map((t, i) => (STARTS[i + 1] ?? 28.5) - t);
export const SHOW_STARTS = STARTS;
export const SHOW_FRAMES = S(28.5);
// spoken letters of «jifirecode», seconds from the start of the discount scene
const LET = [3.18, 3.64, 3.98, 4.34, 4.6, 4.74, 5.18, 5.62, 5.92, 6.14];

const Chip: React.FC = () => (
  <div style={{position: 'absolute', top: 230, right: 64, width: 220, height: 132, borderRadius: 26, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.25)'}}>
    <Img src={staticFile('logo.png')} style={{width: 176}} />
  </div>
);

const Card: React.FC<{d: Dev; w: number; lf: number; i: number; dir: number}> = ({d, w, lf, i, dir}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf - 1 - i * 2, fps, config: {damping: 15, stiffness: 200}});
  const off = (1 - a) * 260;
  const tr = dir === 0 ? `translateY(${off}px)` : dir === 1 ? `translateX(${off}px)` : dir === 2 ? `translateX(${-off}px)` : `scale(${0.6 + 0.4 * a})`;
  const fl = Math.sin(lf / 14 + i * 1.7) * 7;
  return (
    <div style={{width: w, borderRadius: 34, background: '#fff', boxShadow: '0 26px 50px rgba(60,45,10,0.16)', border: '1.5px solid #efe7d3', overflow: 'hidden',
      opacity: a, transform: `${tr} translateY(${fl + (i % 2) * 36}px) rotate(${(i - 1) * 1.6 * (1 - a * 0.4)}deg)`}}>
      <div style={{width: w, height: w, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff'}}>
        <Img src={staticFile('show/' + d.img)} style={{width: w - 36, height: w - 36, objectFit: 'contain'}} />
      </div>
      <div style={{padding: '12px 8px 20px', textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: w > 400 ? 38 : 28, color: INK, direction: 'ltr', borderTop: `4px solid ${GOLD}`}}>{d.name}</div>
    </div>
  );
};

const BrandScene: React.FC<{b: Brand; lf: number; n: number}> = ({b, lf, n}) => {
  const {fps} = useVideoConfig();
  const t = spring({frame: lf, fps, config: {damping: 16, stiffness: 220}});
  const w = b.devs.length === 3 ? 312 : 440;
  const zoom = 1 + lf * 0.0009;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${b.tint}, ${CREAM})`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 1180, left: -40, right: -40, textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: 300, color: 'rgba(0,0,0,0.045)', direction: 'ltr', whiteSpace: 'nowrap', transform: `translateX(${(n % 2 ? 1 : -1) * (40 - lf * 1.4)}px)`}}>{b.en}</div>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <div style={{position: 'absolute', top: 420, left: 64, right: 64, textAlign: 'center', opacity: t, transform: `translateY(${(1 - t) * -40}px)`}}>
          <div style={{fontFamily: F, fontWeight: 900, fontSize: 150, lineHeight: 1, color: INK, direction: 'ltr'}}>{b.en}</div>
          <div style={{display: 'inline-block', marginTop: 16, padding: '6px 34px', borderRadius: 999, background: GOLD, fontFamily: F, fontWeight: 900, fontSize: 44, color: '#1b1405', direction: 'rtl'}}>{b.ar}</div>
        </div>
        <div style={{position: 'absolute', top: 760, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22, direction: 'ltr'}}>
          {b.devs.map((d, i) => <Card key={d.img} d={d} w={w} lf={lf} i={i} dir={n % 4} />)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Hook: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 13, stiffness: 150}});
  const b = spring({frame: lf - 12, fps, config: {damping: 13, stiffness: 150}});
  const fan = [{img: 'tp7.png', r: -16, x: -250}, {img: 's26.png', r: 0, x: 0}, {img: 'ip18.png', r: 16, x: 250}];
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 60% at 50% 30%, #fff, ${CREAM})`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 420, left: 64, right: 64, textAlign: 'center', fontFamily: F, fontWeight: 900, direction: 'rtl'}}>
        <div style={{fontSize: 128, lineHeight: 1.1, color: INK, opacity: a, transform: `translateY(${(1 - a) * 50}px)`}}>كل الماركات</div>
        <div style={{fontSize: 128, lineHeight: 1.15, color: GOLDD, opacity: b, transform: `translateY(${(1 - b) * 50}px)`}}>بمكان واحد</div>
      </div>
      {fan.map((p, i) => {
        const s = spring({frame: lf - 16 - i * 5, fps, config: {damping: 13, stiffness: 110}});
        return <Img key={p.img} src={staticFile('show/' + p.img)} style={{position: 'absolute', left: 540 - 210 + p.x, top: 880 + (i === 1 ? -30 : 30) + (1 - s) * 500, width: 420, height: 420, objectFit: 'contain',
          transform: `rotate(${p.r * s}deg) translateY(${Math.sin(lf / 12 + i) * 8}px)`, zIndex: i === 1 ? 2 : 1}} />;
      })}
    </AbsoluteFill>
  );
};

const Used: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const t = spring({frame: lf, fps, config: {damping: 15}});
  const ph = ['u16.jpg', 'utc.jpg', 'u17.jpg', 'uinf.jpg'];
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg,#F1ECE0,${CREAM})`}}>
      <div style={{position: 'absolute', top: 420, left: 64, right: 64, textAlign: 'center', fontFamily: F, fontWeight: 900, direction: 'rtl', opacity: t}}>
        <div style={{fontSize: 108, color: INK, lineHeight: 1.1}}>وأجهزة <span style={{color: GOLDD}}>مستعملة</span></div>
        <div style={{fontSize: 44, color: '#5b5140', marginTop: 6}}>صور حقيقية من المحل</div>
      </div>
      <div style={{position: 'absolute', top: 760, left: 64, right: 64, display: 'flex', gap: 18, direction: 'ltr'}}>
        {ph.map((p, i) => {
          const a = spring({frame: lf - 6 - i * 4, fps, config: {damping: 14}});
          return <div key={p} style={{flex: 1, height: 560, borderRadius: 26, overflow: 'hidden', border: '5px solid #fff', boxShadow: '0 20px 40px rgba(60,45,10,0.2)', opacity: a,
            transform: `translateY(${(1 - a) * 200 + (i % 2) * 40}px) rotate(${(i - 1.5) * 1.5}deg)`}}><Img src={staticFile('show/' + p)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.05 + lf * 0.0012})`}} /></div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const AppScene: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const t = spring({frame: lf, fps, config: {damping: 15}});
  const p = spring({frame: lf - 6, fps, config: {damping: 15, stiffness: 100}});
  const all = BRANDS.flatMap((b) => b.devs).slice(0, 12);
  const scroll = interpolate(lf, [10, S(2.7)], [0, -560], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 60% at 50% 30%, #fff, ${CREAM})`, alignItems: 'center'}}>
      <div style={{marginTop: 400, fontFamily: F, fontWeight: 900, fontSize: 84, color: INK, direction: 'rtl', opacity: t}}>كلها بـ<span style={{color: GOLDD}}>تطبيق جي فاير</span></div>
      <div style={{marginTop: 30, width: 470, height: 860, borderRadius: 60, background: '#0c0c0f', border: '10px solid #26262b', boxShadow: '0 40px 70px rgba(60,45,10,0.3)', overflow: 'hidden', position: 'relative',
        transform: `translateY(${(1 - p) * 200}px) scale(${0.9 + 0.1 * p})`, opacity: p}}>
        <AbsoluteFill style={{background: '#f5f5f7'}} />
        <div style={{position: 'absolute', top: 84 + scroll, left: 12, right: 12, display: 'flex', flexWrap: 'wrap', gap: 12, direction: 'ltr'}}>
          {all.map((d) => (
            <div key={d.img} style={{width: 207, borderRadius: 18, background: '#fff', border: '1px solid #ececf0', overflow: 'hidden'}}>
              <Img src={staticFile('show/' + d.img)} style={{width: 207, height: 190, objectFit: 'contain'}} />
              <div style={{padding: '4px 6px 10px', fontFamily: F, fontWeight: 800, fontSize: 19, color: INK, textAlign: 'center'}}>{d.name}</div>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 76, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Img src={staticFile('logo.png')} style={{height: 58}} /></div>
      </div>
    </AbsoluteFill>
  );
};

const Row: React.FC<{lf: number; at: number; big: React.ReactNode; sub: React.ReactNode; icon: React.ReactNode}> = ({lf, at, big, sub, icon}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf - at, fps, config: {damping: 13, stiffness: 130}});
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 26, padding: '26px 34px', marginTop: 26, borderRadius: 34, background: '#fff', border: `3px solid ${GOLD}`, boxShadow: '0 20px 44px rgba(60,45,10,0.14)', direction: 'rtl',
      opacity: a, transform: `translateX(${(1 - a) * 160}px) scale(${0.94 + 0.06 * a})`}}>
      <div style={{width: 124, height: 124, borderRadius: 30, flexShrink: 0, background: `linear-gradient(135deg,#FFD966,${GOLD})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div>
      <div>
        <div style={{fontFamily: F, fontWeight: 900, fontSize: 72, lineHeight: 1.15, color: INK}}>{big}</div>
        <div style={{fontFamily: F, fontWeight: 800, fontSize: 38, color: '#5b5140'}}>{sub}</div>
      </div>
    </div>
  );
};
const ic = (d: React.ReactNode) => <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#1b1405" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;

const Offers: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const t = spring({frame: lf, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 60% at 50% 30%, #fff, ${CREAM})`}}>
      <div style={{position: 'absolute', top: 400, left: 64, right: 64}}>
        <div style={{height: 60, opacity: t}} />
        <Row lf={lf} at={-30} big={<>خصم {ltr('25,000')} د.ع</>} sub={<>كود {ltr('jifirecode')} · أقل فاتورة {ltr('200,000')}</>} icon={ic(<><path d="M20 12v8H4v-8M2 7h20v5H2zM12 22V7M12 7S10 2 7.5 3.5 9 7 12 7zM12 7s2-5 4.5-3.5S15 7 12 7z" /></>)} />
        <Row lf={lf} at={2} big="توصيل مجاني" sub="لكل محافظات العراق" icon={ic(<><path d="M1 4h13v11H1zM14 8h4l3 3v4h-7z" /><circle cx="5.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></>)} />
        <Row lf={lf} at={66} big="ضمان سنة للجديد" sub="وشهر للمستعمل · مع وصل ضمان" icon={ic(<><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>)} />
      </div>
    </AbsoluteFill>
  );
};

const Discount: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 14, stiffness: 150}});
  const b = spring({frame: lf - 12, fps, config: {damping: 12, stiffness: 140}});
  const box = spring({frame: lf - S(2.6), fps, config: {damping: 14, stiffness: 140}});
  const min = spring({frame: lf - S(6.4), fps, config: {damping: 15}});
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 60% at 50% 30%, #fff, ${CREAM})`}}>
      <div style={{position: 'absolute', top: 420, left: 64, right: 64, textAlign: 'center', fontFamily: F, fontWeight: 900, direction: 'rtl'}}>
        <div style={{fontSize: 70, color: '#5b5140', opacity: a}}>وفوكاها</div>
        <div style={{display: 'inline-block', marginTop: 10, padding: '14px 46px', borderRadius: 36, background: `linear-gradient(135deg,#FFE79A,${GOLD} 55%,${GOLDD})`,
          boxShadow: '0 24px 50px rgba(201,143,0,0.35)', opacity: b, transform: `scale(${0.7 + 0.3 * b})`}}>
          <span style={{fontSize: 70, color: '#2a1f05'}}>خصم </span><span style={{fontSize: 140, color: '#1b1405'}}>{ltr('25,000')}</span><span style={{fontSize: 70, color: '#2a1f05'}}> د.ع</span>
        </div>
      </div>
      <div style={{position: 'absolute', top: 870, left: 64, right: 64, textAlign: 'center', opacity: box, transform: `translateY(${(1 - box) * 80}px)`}}>
        <div style={{fontFamily: F, fontWeight: 900, fontSize: 52, color: INK, direction: 'rtl'}}>بالكود</div>
        <div style={{marginTop: 16, padding: '34px 20px', borderRadius: 34, background: '#fff', border: `4px dashed ${GOLDD}`, boxShadow: '0 24px 50px rgba(60,45,10,0.14)', direction: 'ltr', whiteSpace: 'nowrap'}}>
          {'jifirecode'.split('').map((ch, i) => {
            const on = spring({frame: lf - S(LET[i]), fps, config: {damping: 10, stiffness: 220}});
            return <span key={i} style={{display: 'inline-block', fontFamily: F, fontWeight: 900, fontSize: 132, lineHeight: 1, color: on > 0.05 ? INK : '#d4ccb8',
              transform: `translateY(${-24 * Math.sin(Math.min(1, on) * Math.PI)}px)`, textShadow: on > 0.05 ? `0 0 ${18 * (1 - Math.min(1, on))}px ${GOLD}` : 'none'}}>{ch}</span>;
          })}
        </div>
        <div style={{marginTop: 26, fontFamily: F, fontWeight: 800, fontSize: 42, color: '#5b5140', direction: 'rtl', opacity: min}}>للطلبات من {ltr('200,000')} د.ع وفوك</div>
      </div>
    </AbsoluteFill>
  );
};

export const Showcase: React.FC = () => {
  const f = useCurrentFrame();
  let idx = 0;
  for (let i = 0; i < DUR.length; i++) if (f >= S(STARTS[i])) idx = i;
  const lf = f - S(STARTS[idx]);
  const nb = BRANDS.length;
  if (idx === DUR.length - 1) return <AbsoluteFill style={{background: '#000'}}><EndCard /></AbsoluteFill>;
  const body = idx === 0 ? <Hook lf={lf} /> : idx <= nb ? <BrandScene b={BRANDS[idx - 1]} lf={lf} n={idx - 1} /> : idx === nb + 1 ? <Used lf={lf} /> : idx === nb + 2 ? <AppScene lf={lf} /> : idx === nb + 3 ? <Discount lf={lf} /> : <Offers lf={lf} />;
  // quick white flash between scenes (soft, 5 frames)
  const flash = interpolate(lf, [0, 5], [0.85, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: CREAM}}>
      {body}
      <AbsoluteFill style={{background: '#fff', opacity: idx === 0 ? 0 : flash, pointerEvents: 'none'}} />
      <Chip />
    </AbsoluteFill>
  );
};
