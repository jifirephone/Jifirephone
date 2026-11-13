// Ji Fire — beat-cut "seamless transition" reel on stills (2026-11-13), after the owner's reference
// (live-action whip pans / cover wipes / B&W hits cut on a 130 BPM beat; technique only).
// Storefront photo (owner's) → through the door → the real website → phones → offers → delivery → back to the shop.
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color} from '../brand';
import {EndCard} from '../components/Brand';

const FPS = 30;
export const BEAT_BPM = 130;
const U = (60 / BEAT_BPM) * 2; // one cut unit = 2 beats
const fU = (u: number) => Math.round(u * U * FPS);
const F = 'Cairo';
const GOLD = color.gold, INK = '#0d0c0a';
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 4);
const ltr = (s: string) => <span style={{direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block'}}>{s}</span>;

// unit starts: 0 wide, 2 sign, 4 brands, 6 door (+zoom through), 8 site, 10..15 six phones, 16 fly-wipe→discount, 18 delivery, 20 warranty, 22 back to shop, 24 end
export const BEAT_UNITS = 24;
export const BEAT_FRAMES = fU(24) + Math.round(3.4 * FPS);
const PH: [string, string][] = [['ip17.jpg', 'iPhone 17 Pro Max'], ['s26.png', 'Galaxy S26 Ultra'], ['rm16.jpg', 'realme 16 Pro+'], ['rn14.jpg', 'Redmi Note 14 Pro+'], ['tc40.jpg', 'TECNO Camon 40 Pro'], ['gt50.jpg', 'Infinix GT 50 Pro']];

// ---- storefront camera: photo 1280x960, base cover scale 2 (2560x1920) ----
type Shot = {cx: number; cy: number; z: number};
const SHOTS: Shot[] = [{cx: 640, cy: 470, z: 0.9}, {cx: 640, cy: 160, z: 1.5}, {cx: 430, cy: 390, z: 2.2}, {cx: 440, cy: 700, z: 2.0}];
const Store: React.FC<{shot: Shot; drift: number; extra?: number; gray?: boolean; hblur?: number}> = ({shot, drift, extra = 1, gray, hblur = 0}) => {
  const z = shot.z * (1 + drift * 0.05) * extra;
  const s = z;
  let tx = 540 - shot.cx * s;
  const ty = 900 - shot.cy * s;
  if (1280 * s >= 1080) tx = Math.min(0, Math.max(1080 - 1280 * s, tx));
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden', filter: `${gray ? 'grayscale(1) contrast(1.35)' : ''} ${hblur ? `blur(${hblur}px)` : ''}`}}>
      <Img src={staticFile('type/store_blur.jpg')} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}} />
      <Img src={staticFile('type/store.jpg')} style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 960, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.6) 100%)'}} />
    </AbsoluteFill>
  );
};

const Cap: React.FC<{lf: number; children: React.ReactNode; top?: number; size?: number}> = ({lf, children, top = 1250, size = 92}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf - 1, fps, config: {damping: 11, stiffness: 240}});
  return <div style={{position: 'absolute', top, left: 64, right: 64, textAlign: 'center', direction: 'rtl', fontFamily: F, fontWeight: 900, fontSize: size, lineHeight: 1.2, color: '#fff',
    transform: `scale(${0.7 + 0.3 * a}) rotate(${(1 - a) * -4}deg)`, opacity: clamp(a * 2), WebkitTextStroke: '10px rgba(0,0,0,0.85)', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>{children}</div>;
};
const G: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: GOLD}}>{children}</span>;

const Dark: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(90% 60% at 50% 40%, #2a2416, ${INK} 70%)`, fontFamily: F}}>{children}</AbsoluteFill>
);

const Phone: React.FC<{i: number; lf: number}> = ({i, lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 12, stiffness: 200}});
  const [img, name] = PH[i];
  return (
    <Dark>
      <div style={{position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center', fontWeight: 900, fontSize: 260, color: 'rgba(255,255,255,0.05)', direction: 'ltr'}}>{String(i + 1).padStart(2, '0')}</div>
      <div style={{position: 'absolute', top: 420, left: 190, width: 700, height: 700, borderRadius: 60, background: '#fff', overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,0.6)',
        transform: `scale(${0.82 + 0.18 * a + lf * 0.0012}) rotate(${(i % 2 ? 1 : -1) * (1 - a) * 8}deg)`}}>
        <Img src={staticFile('show/' + img)} style={{width: 700, height: 700, objectFit: 'contain', padding: 30, boxSizing: 'border-box'}} />
      </div>
      <div style={{position: 'absolute', top: 1170, left: 0, right: 0, textAlign: 'center', fontWeight: 900, fontSize: 76, color: '#fff', direction: 'ltr', opacity: a}}>{name}</div>
      <div style={{position: 'absolute', top: 1290, left: 440, width: 200 * a, height: 10, borderRadius: 5, background: GOLD}} />
    </Dark>
  );
};

const Site: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf, fps, config: {damping: 14, stiffness: 160}});
  const sc = interpolate(lf, [4, fU(2)], [0, -900], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Dark>
      <div style={{position: 'absolute', top: 290, left: '50%', marginLeft: -260, width: 520, height: 1010, borderRadius: 66, border: '11px solid #2c2a27', background: '#fff', overflow: 'hidden',
        transform: `scale(${1.5 - 0.5 * a}) rotate(${(1 - a) * 6}deg)`, boxShadow: '0 50px 100px rgba(0,0,0,0.7)'}}>
        <Img src={staticFile('type/site.jpg')} style={{position: 'absolute', top: sc, left: 0, width: 498}} />
      </div>
      <Cap lf={lf - 4} top={1330} size={78}>نفس المحل... <G>بموبايلك</G></Cap>
    </Dark>
  );
};

const Discount: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf - 2, fps, config: {damping: 10, stiffness: 200}});
  const b = spring({frame: lf - fU(1), fps, config: {damping: 12, stiffness: 200}});
  return (
    <Dark>
      <div style={{position: 'absolute', top: 430, left: 0, right: 0, textAlign: 'center', direction: 'rtl', fontWeight: 900, color: '#fff', transform: `scale(${0.6 + 0.4 * a})`, opacity: clamp(a * 2)}}>
        <div style={{fontSize: 120}}>خصم</div>
        <div style={{fontSize: 250, lineHeight: 1, color: GOLD, direction: 'ltr'}}>25,000</div>
        <div style={{fontSize: 70}}>دينار</div>
      </div>
      <div style={{position: 'absolute', top: 1010, left: 110, right: 110, padding: '26px 0', borderRadius: 30, background: GOLD, textAlign: 'center', fontWeight: 900, fontSize: 110, color: INK, direction: 'ltr',
        transform: `scale(${b}) rotate(${(1 - b) * -6}deg)`}}>jifirecode</div>
      <div style={{position: 'absolute', top: 1230, left: 0, right: 0, textAlign: 'center', direction: 'rtl', fontWeight: 800, fontSize: 44, color: 'rgba(255,255,255,0.7)', opacity: b}}>للطلبات من {ltr('200,000')} د.ع وفوك</div>
    </Dark>
  );
};

const Delivery: React.FC<{lf: number}> = ({lf}) => {
  const p = ease(lf / (fU(2) - 8));
  const pts: [number, number][] = [[250, 620], [250, 800], [560, 800], [560, 1010], [830, 1010]];
  const lens = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1])); const tot = lens.reduce((x, y) => x + y, 0);
  let d = p * tot, cx = pts[0][0], cy = pts[0][1];
  for (let i = 0; i < lens.length; i++) { if (d <= lens[i]) { const t = d / lens[i]; cx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t; cy = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t; break; } d -= lens[i]; cx = pts[i + 1][0]; cy = pts[i + 1][1]; }
  return (
    <Dark>
      <svg width="1080" height="1920" style={{position: 'absolute'}}>
        {[...Array(9)].map((_, i) => <line key={'v' + i} x1={120 + i * 105} y1={480} x2={120 + i * 105} y2={1130} stroke="rgba(255,255,255,0.06)" strokeWidth="3" />)}
        {[...Array(7)].map((_, i) => <line key={'h' + i} x1={120} y1={480 + i * 108} x2={960} y2={480 + i * 108} stroke="rgba(255,255,255,0.06)" strokeWidth="3" />)}
        <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={GOLD} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${p * tot} ${tot}`} />
        <circle cx={250} cy={620} r={26} fill={GOLD} /><circle cx={250} cy={620} r={10} fill={INK} />
        <g transform="translate(830 1010)" opacity={p > 0.95 ? 1 : 0.35}><path d="M-46 0 L0 -44 L46 0 L46 46 L-46 46 Z" fill="#fff" /><rect x={-12} y={10} width={24} height={36} fill={INK} /></g>
        <g transform={`translate(${cx} ${cy})`}><rect x={-44} y={-30} width={88} height={52} rx={10} fill="#fff" stroke={INK} strokeWidth="5" /><rect x={-44} y={2} width={88} height={12} fill={GOLD} /><circle cx={-24} cy={26} r={11} fill={INK} /><circle cx={24} cy={26} r={11} fill={INK} /></g>
      </svg>
      <div style={{position: 'absolute', top: 540, left: 290, fontFamily: F, fontWeight: 900, fontSize: 38, color: '#fff', direction: 'rtl'}}>المحل</div>
      <div style={{position: 'absolute', top: 1080, left: 760, fontFamily: F, fontWeight: 900, fontSize: 38, color: '#fff', direction: 'rtl'}}>بيتك</div>
      <Cap lf={lf} top={1220}>توصيل <G>مجاني</G><br /><span style={{fontSize: 64}}>لكل العراق</span></Cap>
    </Dark>
  );
};

const Warranty: React.FC<{lf: number}> = ({lf}) => {
  const p = clamp((lf - 4) / 5); const sc = lf < 4 ? 0 : 2.4 - 1.4 * ease(p);
  return (
    <Dark>
      <div style={{position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{display: 'inline-block', padding: '4px 50px', border: `11px solid ${GOLD}`, outline: `3px solid ${GOLD}`, outlineOffset: 9, borderRadius: 20, fontWeight: 900, fontSize: 170, color: GOLD, direction: 'rtl',
          transform: `rotate(-8deg) scale(${sc})`, opacity: lf < 4 ? 0 : 1}}>مضمون</div>
      </div>
      <Cap lf={lf - 10} top={1010} size={74}>سنة للجديد <G>·</G> شهر للمستعمل<br /><span style={{fontSize: 56}}>مع وصل ضمان</span></Cap>
    </Dark>
  );
};

// scene at unit index
const sceneAt = (u: number, lf: number, f: number): React.ReactNode => {
  const drift = lf / fU(2);
  if (u < 2) return <><Store shot={SHOTS[0]} drift={drift} /><Cap lf={lf - 6} top={1340}>هذا <G>محلنا</G></Cap></>;
  if (u < 4) return <><Store shot={SHOTS[1]} drift={drift} gray={lf < 3} /><Cap lf={lf}><G>جي فاير</G> للموبايل</Cap></>;
  if (u < 6) return <><Store shot={SHOTS[2]} drift={drift} gray={lf < 3} /><Cap lf={lf}>كل <G>الماركات</G></Cap></>;
  if (u < 8) { const zt = clamp((lf - (fU(2) - 9)) / 9); return <><Store shot={SHOTS[3]} drift={drift} extra={1 + Math.pow(zt, 3) * 4.5} hblur={zt * 14} /><Cap lf={lf}>تفضّل <G>ادخل</G></Cap></>; }
  if (u < 10) return <Site lf={lf} />;
  if (u < 16) return <Phone i={u - 10} lf={lf} />;
  if (u < 18) return <Discount lf={lf} />;
  if (u < 20) return <Delivery lf={lf} />;
  if (u < 22) return <Warranty lf={lf} />;
  return <><Store shot={{cx: 640, cy: 470, z: 1.3 - 0.4 * ease(lf / 20)}} drift={0} /><Cap lf={lf - 6} top={1340} size={70}>النجف · ميلاد · <G>شارع الحولي</G></Cap></>;
};
const STARTS = [0, 2, 4, 6, 8, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22];
// transition INTO each segment: punch (scale pop), whipL/whipR (slide + blur), flash (white), fly (object wipe)
const TR = ['none', 'punch', 'whipL', 'punch', 'flash', 'whipR', 'whipL', 'whipR', 'whipL', 'whipR', 'whipL', 'fly', 'whipR', 'punch', 'whipL'];

export const StoreBeat: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= fU(24)) return <AbsoluteFill style={{background: '#000'}}><EndCard /></AbsoluteFill>;
  let k = 0;
  for (let i = 0; i < STARTS.length; i++) if (f >= fU(STARTS[i])) k = i;
  const lf = f - fU(STARTS[k]);
  const tr = TR[k];
  const T = 6;
  const p = clamp(lf / T), e = ease(p);
  const prevK = k - 1;
  const showPrev = k > 0 && lf < T && (tr === 'whipL' || tr === 'whipR');
  const dir = tr === 'whipL' ? -1 : 1;
  const cur: React.CSSProperties = tr === 'punch' ? {transform: `scale(${1.25 - 0.25 * e})`} : showPrev ? {transform: `translateX(${dir * -1080 * (1 - e)}px)`, filter: `blur(${(1 - p) * 10}px)`} : {};
  const flash = tr === 'flash' ? clamp(1 - lf / 6) : tr === 'punch' ? clamp(1 - lf / 2) * 0.5 : 0;
  // fly-wipe: a phone image rushes at the camera over the cut (last 5 frames of previous + first 5 of this)
  const flyAt = fU(16); const fd = f - flyAt;
  const fly = fd >= -6 && fd < 6 ? (fd + 6) / 12 : -1;
  const shake = lf < 4 && tr !== 'none' ? Math.sin(f * 2.7) * (4 - lf) * 2.5 : 0;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {showPrev ? <AbsoluteFill style={{transform: `translateX(${dir * 1080 * e}px)`, filter: `blur(${p * 10}px)`}}>{sceneAt(STARTS[prevK], f - fU(STARTS[prevK]), f)}</AbsoluteFill> : null}
      <AbsoluteFill style={{...cur, marginLeft: shake}}>{sceneAt(STARTS[k], lf, f)}</AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
      {fly >= 0 ? <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: 500, height: 500, borderRadius: 60, background: '#fff', transform: `scale(${0.3 + Math.pow(fly < 0.5 ? fly * 2 : 1, 2) * 6}) rotate(${fly * 30}deg)`, opacity: fly < 0.5 ? 1 : 1 - (fly - 0.5) * 2}} />
      </AbsoluteFill> : null}
      <div style={{position: 'absolute', top: 236, right: 64, width: 150, height: 90, borderRadius: 20, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Img src={staticFile('logo.png')} style={{width: 124}} /></div>
    </AbsoluteFill>
  );
};
