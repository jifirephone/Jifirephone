// JI FIRE FOR MOBILE — cinematic commercial (2026-11-23). Data-driven: edit ./config.json, not this file.
// 6 scenes on a 120 BPM grid (every cut on a beat): logo forge → device world → used device card → site & app
// → Iraq delivery map + line-art fulfilment → finale orbit + contacts → brand end card.
// Real assets only: store catalog cut-outs, the store's own used-device photo, real site/app captures.
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color} from '../brand';
import {EndCard} from '../components/Brand';
import C from './config.json';

const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
const F = 'Cairo';
const GOLD = color.gold, GOLD2 = '#FFE08A', GD = '#B07F00', W = '#fff';
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const eOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const eExpo = (t: number) => { t = clamp(t); return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2; }; // speed ramp
const ltr = (s: string) => <span style={{direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block'}}>{s}</span>;
const goldText: React.CSSProperties = {background: `linear-gradient(180deg, ${GOLD2} 0%, ${GOLD} 45%, ${GD} 100%)`, WebkitBackgroundClip: 'text', color: 'transparent'};

// scene windows (seconds)
const TL = C.timeline;
export const SC = TL.scenes as Record<'logo' | 'world' | 'used' | 'digital' | 'delivery' | 'finale' | 'end', [number, number]>;
export const COMMERCIAL_FRAMES = S(SC.end[1]);

// ---------- shared layers ----------
const Particles: React.FC<{f: number; n?: number; converge?: number}> = ({f, n = 46, converge = 0}) => (
  <>{[...Array(n)].map((_, i) => {
    const x0 = random(`px${i}`) * 1080, y0 = random(`py${i}`) * 1920, sp = 0.3 + random(`ps${i}`) * 0.9;
    const x = x0 + (540 - x0) * converge, y = ((y0 - f * sp * 2) % 1920 + 1920) % 1920 * (1 - converge) + 800 * converge;
    const s = 2 + random(`pz${i}`) * 4;
    return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: s, background: i % 3 ? GOLD : '#fff',
      opacity: 0.25 + 0.55 * Math.abs(Math.sin(f / 18 + i)), boxShadow: `0 0 ${s * 3}px ${GOLD}`}} />;
  })}</>
);

const Bg: React.FC<{f: number; glow?: number; y?: number}> = ({f, glow = 0.18, y = 42}) => (
  <AbsoluteFill style={{background: `radial-gradient(70% 45% at 50% ${y}%, rgba(243,180,6,${glow}) 0%, rgba(20,15,5,0.4) 45%, #000 80%)`}}>
    <AbsoluteFill style={{background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 90px)', transform: `translateX(${-(f % 90)}px)`}} />
  </AbsoluteFill>
);

const Streaks: React.FC<{f: number; at?: number; dur?: number}> = ({f, at = 0, dur = 24}) => {
  const p = clamp((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  return <>{[0, 1, 2, 3, 4].map((i) => {
    const y = 380 + i * 280 + Math.sin(i * 7) * 60, ang = -18 + i * 9;
    return <div key={i} style={{position: 'absolute', left: -600 + p * 2400 - i * 160, top: y, width: 700, height: 3 + (i % 2) * 2, transform: `rotate(${ang}deg)`,
      background: `linear-gradient(90deg, transparent, ${GOLD2}, transparent)`, opacity: Math.sin(p * Math.PI), boxShadow: `0 0 22px ${GOLD}`}} />;
  })}</>;
};

const Title: React.FC<{lf: number; at?: number; top?: number; size?: number; children: React.ReactNode; sub?: React.ReactNode}> = ({lf, at = 0, top = 330, size = 74, children, sub}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: lf - at, fps, config: {damping: 15, stiffness: 170}});
  return (
    <div style={{position: 'absolute', top, left: 64, right: 230, textAlign: 'right', direction: 'rtl', fontFamily: F, opacity: clamp(a * 1.5), transform: `translateY(${(1 - a) * -30}px)`}}>
      <div style={{fontWeight: 900, fontSize: size, lineHeight: 1.15, color: W, textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>{children}</div>
      {sub ? <div style={{marginTop: 8, fontWeight: 800, fontSize: size * 0.5, color: 'rgba(255,255,255,0.72)'}}>{sub}</div> : null}
      <div style={{marginTop: 14, height: 6, width: 140 * a, borderRadius: 3, background: GOLD, marginRight: 0, marginLeft: 'auto'}} />
    </div>
  );
};

// phone floating with pseudo-3D swing, rim light and floor reflection
const Device: React.FC<{img: string; h: number; x: number; y: number; ry?: number; rz?: number; s?: number; o?: number; refl?: boolean}> = ({img, h, x, y, ry = 0, rz = 0, s = 1, o = 1, refl = true}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) perspective(1800px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`, opacity: o}}>
    <div style={{position: 'absolute', left: '50%', top: '55%', width: h * 0.9, height: h * 0.9, marginLeft: -h * 0.45, marginTop: -h * 0.45, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(243,180,6,0.32), rgba(243,180,6,0) 65%)'}} />
    <Img src={staticFile(img)} style={{position: 'relative', height: h, display: 'block', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.7))'}} />
    {refl ? <div style={{position: 'relative', height: h * 0.35, overflow: 'hidden', marginTop: 6}}>
      <Img src={staticFile(img)} style={{height: h, display: 'block', transform: 'scaleY(-1)', opacity: 0.22}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2), #000 85%)'}} />
    </div> : null}
  </div>
);

// ---------- captions (voice-over lines, gold keywords, word stagger) ----------
// caption tokens: an Arabic prefix (و/ب) is split off a Latin word, consecutive Latin/number words merge into one LTR run
type Tok = {txt: string; ltr: boolean; wi: number};
const tokenize = (text: string): Tok[] => {
  const out: Tok[] = [];
  text.split(' ').forEach((w, wi) => {
    const m = w.match(/^([\u0600-\u06FF]*)([A-Za-z0-9][A-Za-z0-9+.%-]*)([،؟!.]*)$/);
    if (m) {
      if (m[1]) out.push({txt: m[1], ltr: false, wi});
      const prev = out[out.length - 1];
      if (prev && prev.ltr && !m[1]) prev.txt += ' ' + m[2]; else out.push({txt: m[2], ltr: true, wi});
      if (m[3]) out.push({txt: m[3], ltr: false, wi});
    } else out.push({txt: w, ltr: false, wi});
  });
  return out;
};

const Captions: React.FC<{t: number}> = ({t}) => {
  if (t >= SC.finale[0] + TL.finaleStack - 0.1) return null; // the closing lines are already on screen
  const line = C.vo.find((v) => t >= v.t - 0.05 && t <= v.end + 0.2);
  if (!line) return null;
  const words = line.text.split(' ');
  const per = (line.end - line.t) / words.length;
  const wi = Math.min(words.length - 1, Math.max(0, Math.floor((t - line.t) / per)));
  const toks = tokenize(line.text);
  const chunks: number[][] = [];
  for (let i = 0; i < words.length; i += 5) chunks.push(words.slice(i, i + 5).map((_, k) => i + k));
  const ch = chunks.find((c) => c.includes(wi)) ?? chunks[0];
  const out = clamp((line.end + 0.2 - t) / 0.2);
  const cin = clamp((t - (line.t + ch[0] * per)) / 0.12);
  return (
    <div style={{position: 'absolute', top: 1300, left: 64, right: 230, display: 'flex', flexWrap: 'wrap', gap: '2px 14px', direction: 'rtl', opacity: out * cin, transform: `translateY(${(1 - cin) * 12}px)`}}>
      {toks.filter((k) => ch.includes(k.wi)).map((k, i) => {
        const a = clamp((t - (line.t + k.wi * per)) / 0.1);
        const key = line.gold.some((g) => k.txt.replace(/[،؟!.]/g, '').includes(g));
        const glue = /^[،؟!.]+$/.test(k.txt);
        return <span key={i} style={{fontFamily: F, fontWeight: 900, fontSize: 52, lineHeight: 1.28, color: key ? GOLD : W, opacity: 0.3 + 0.7 * a,
          direction: k.ltr ? 'ltr' : 'rtl', unicodeBidi: 'isolate', marginLeft: glue ? -14 : 0, textShadow: '0 4px 0 rgba(0,0,0,0.8), 0 8px 22px rgba(0,0,0,0.85)'}}>{k.txt}</span>;
      })}
    </div>
  );
};

const LogoBug: React.FC = () => (
  <div style={{position: 'absolute', top: 236, right: 64, width: 150, height: 104, borderRadius: 22, background: 'rgba(0,0,0,0.7)', border: `1.5px solid rgba(243,180,6,0.5)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Img src={staticFile('logo.png')} style={{height: 88}} /></div>
);

// ---------- S1 logo forge ----------
const S1: React.FC<{lf: number}> = ({lf}) => {
  const conv = eExpo(clamp((lf - 6) / 54));
  const hit = S(2.0);
  const logo = clamp((lf - hit + 4) / 8);
  const orbit = Math.sin((lf - hit) / 40) * 22 * clamp((lf - hit) / 20);
  const shine = interpolate(lf, [hit + 6, hit + 40], [-60, 160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shake = lf >= hit && lf < hit + 8 ? Math.sin(lf * 3.1) * (8 - (lf - hit)) * 2 : 0;
  const txt = 'JI FIRE FOR MOBILE';
  const tn = Math.floor(clamp((lf - S(3.0)) / 22) * txt.length);
  return (
    <AbsoluteFill style={{background: '#000', transform: `translate(${shake}px, ${-shake / 2}px)`}}>
      <Bg f={lf} glow={0.22 * logo} />
      {/* gold light lines converging */}
      <svg width="1080" height="1920" style={{position: 'absolute'}}>
        {[...Array(10)].map((_, i) => {
          const a = (i / 10) * Math.PI * 2, r0 = 1100, r1 = 40;
          const r = r0 + (r1 - r0) * conv;
          return <line key={i} x1={540 + Math.cos(a) * r} y1={800 + Math.sin(a) * r} x2={540 + Math.cos(a) * (r + 260 * (1 - conv))} y2={800 + Math.sin(a) * (r + 260 * (1 - conv))}
            stroke={GOLD2} strokeWidth={3} opacity={(1 - logo) * 0.9} style={{filter: `drop-shadow(0 0 8px ${GOLD})`}} />;
        })}
      </svg>
      <Particles f={lf} n={60} converge={conv * (1 - logo * 0.6)} />
      {/* logo with orbit + metallic sheen */}
      <div style={{position: 'absolute', left: 540, top: 800, transform: `translate(-50%, -50%) perspective(1600px) rotateY(${orbit}deg) scale(${0.6 + 0.4 * eOut(logo)})`, opacity: logo}}>
        <div style={{position: 'relative', width: 560}}>
          <Img src={staticFile('logo.png')} style={{width: 560, display: 'block', filter: `drop-shadow(0 0 ${30 * logo}px rgba(243,180,6,0.55))`}} />
          <div style={{position: 'absolute', inset: 0, WebkitMaskImage: `url(${staticFile('logo.png')})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile('logo.png')})`, maskSize: '100% 100%',
            background: `linear-gradient(105deg, transparent ${shine - 18}%, rgba(255,255,255,0.95) ${shine}%, transparent ${shine + 18}%)`}} />
        </div>
      </div>
      {/* flash on the hit */}
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, rgba(255,230,150,${clamp(1 - Math.abs(lf - hit) / 5) * 0.8}), transparent 60%)`}} />
      <div style={{position: 'absolute', top: 1110, left: 0, right: 0, textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: 66, letterSpacing: 12, direction: 'ltr', ...goldText}}>{txt.slice(0, tn)}</div>
    </AbsoluteFill>
  );
};

// ---------- S2 device world ----------
const S2: React.FC<{lf: number}> = ({lf}) => {
  const D = C.devices, T = TL.devices.map(S), carEnd = S(TL.cloud); // each device enters on its spoken name
  if (lf < carEnd) {
    let k = 0;
    for (let i = 0; i < T.length; i++) if (lf >= T[i]) k = i;
    const l = lf - T[k], per = (T[k + 1] ?? carEnd) - T[k];
    const d = D[k];
    const zoom = k % 2 === 1; // alternate whip pan / zoom-through
    const tin = Math.min(7, per / 3), tout = Math.min(6, per / 3);
    const inP = eExpo(l / tin), outP = eExpo((l - (per - tout)) / tout);
    const ry = interpolate(l, [0, per], [55, -25]);
    const x = zoom ? 540 : 540 + (1 - inP) * 1100 - outP * 1100;
    const s = zoom ? (0.4 + 0.6 * inP) * (1 + outP * 2.2) : 1;
    const blur = (zoom ? (1 - inP) + outP : (1 - inP) + outP) * 16;
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Bg f={lf} glow={0.2} y={46} />
        <Particles f={lf} n={30} />
        <div style={{position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: 230, color: 'rgba(255,255,255,0.045)', direction: 'ltr',
          transform: `translateX(${(l - per / 2) * -6}px)`, whiteSpace: 'nowrap'}}>{d.brand}</div>
        <AbsoluteFill style={{filter: blur > 0.5 ? `blur(${blur}px)` : 'none'}}>
          <Device img={d.img} h={640} x={x} y={800} ry={ry} s={s} o={1 - outP * (zoom ? 1 : 0.2)} />
        </AbsoluteFill>
        <div style={{position: 'absolute', top: 1150, left: 0, right: 0, textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: 60, color: W, direction: 'ltr', opacity: clamp(l / 6) * (1 - outP)}}>{d.name}</div>
        <Streaks f={l} at={per - Math.min(8, per / 2)} dur={Math.min(14, per)} />
      </AbsoluteFill>
    );
  }
  const l = lf - carEnd;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Bg f={lf} glow={0.24} />
      <Particles f={lf} n={40} />
      {C.brandsCloud.map((b, i) => {
        const a = spring({frame: l - i * 2, fps: FPS, config: {damping: 14, stiffness: 160}});
        const col = i % 3, row = Math.floor(i / 3);
        return <div key={b} style={{position: 'absolute', left: 120 + col * 290 + (row % 2) * 60, top: 620 + row * 120, width: 260, textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: 52, direction: 'ltr',
          color: i % 4 === 0 ? GOLD : 'rgba(255,255,255,0.88)', opacity: clamp(a * 1.4), transform: `translateY(${(1 - a) * 60}px) scale(${0.8 + 0.2 * a})`}}>{b}</div>;
      })}
      <div style={{position: 'absolute', top: 1110, left: 64, right: 64, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, direction: 'rtl'}}>
        {C.categories.map((c, i) => {
          const a = clamp((l - 18 - i * 3) / 6);
          return <span key={c} style={{padding: '8px 22px', borderRadius: 999, border: `1.5px solid rgba(243,180,6,0.6)`, fontFamily: F, fontWeight: 800, fontSize: 32, color: W, opacity: a}}>{c}</span>;
        })}
      </div>
      <Title lf={l} at={2} top={360} size={70} sub="خيارات متنوعة">أجهزة <span style={goldText}>جديدة ومستعملة</span></Title>
    </AbsoluteFill>
  );
};

// ---------- S3 used device ----------
const S3: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const ph = spring({frame: lf, fps, config: {damping: 16, stiffness: 110}});
  const tilt = Math.sin(lf / 30) * 6;
  const U = C.used;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Bg f={lf} glow={0.16} y={50} />
      <Particles f={lf} n={24} />
      <Title lf={lf} at={4} top={360} size={66} sub={ltr(U.name)}>جهاز <span style={goldText}>مستعمل</span></Title>
      <div style={{position: 'absolute', left: 470, top: 560, width: 470, height: 640, borderRadius: 36, overflow: 'hidden', border: `3px solid ${GOLD}`, boxShadow: '0 40px 90px rgba(0,0,0,0.8)',
        transform: `perspective(1600px) rotateY(${-14 + tilt}deg) translateX(${(1 - ph) * 400}px)`, opacity: ph}}>
        <Img src={staticFile(U.img)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.85))'}} />
        <div style={{position: 'absolute', bottom: 14, right: 18, fontFamily: F, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.85)', direction: 'rtl'}}>صورة الجهاز نفسه</div>
      </div>
      {U.rows.map(([k, v], i) => {
        const at = S(TL.usedRows[i]);
        const a = spring({frame: lf - at, fps, config: {damping: 13, stiffness: 190}});
        const price = i === U.rows.length - 1;
        return (
          <div key={k} style={{position: 'absolute', left: 64, top: 560 + i * 132, width: 380, padding: '12px 24px', borderRadius: 22, direction: 'rtl',
            background: price ? `linear-gradient(135deg, ${GOLD2}, ${GOLD} 55%, ${GD})` : 'rgba(255,255,255,0.07)', border: price ? 'none' : '1.5px solid rgba(243,180,6,0.45)',
            opacity: clamp(a * 1.5), transform: `translateX(${(1 - a) * -260}px)`, boxShadow: price ? '0 18px 40px rgba(243,180,6,0.35)' : 'none'}}>
            <div style={{fontFamily: F, fontWeight: 800, fontSize: 26, color: price ? '#2a1f05' : 'rgba(255,255,255,0.6)'}}>{k}</div>
            <div style={{fontFamily: F, fontWeight: 900, fontSize: price ? 44 : 40, color: price ? '#1b1405' : W, direction: /[\u0600-\u06FF]/.test(v) ? 'rtl' : 'ltr', textAlign: 'right'}}>{/[\u0600-\u06FF]/.test(v) ? v.split(' ').map((tok, j) => <React.Fragment key={j}>{j ? ' ' : ''}{/[0-9A-Za-z%]/.test(tok) ? ltr(tok) : tok}</React.Fragment>) : v}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- S4 site & app ----------
const Phone3D: React.FC<{lf: number; children: React.ReactNode; ry: number; rx?: number; s?: number}> = ({children, ry, rx = 6, s = 1}) => (
  <div style={{position: 'absolute', left: 540, top: 800, width: 470, height: 960, marginLeft: -235, marginTop: -480, transform: `perspective(2000px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${s * 0.86})`}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 64, background: 'linear-gradient(135deg,#3a3326,#0d0c0a 40%,#2a2418)', boxShadow: '0 60px 120px rgba(0,0,0,0.85), 0 0 0 2px rgba(243,180,6,0.35)'}} />
    <div style={{position: 'absolute', inset: 12, borderRadius: 54, overflow: 'hidden', background: '#fff'}}>{children}</div>
    <div style={{position: 'absolute', inset: 12, borderRadius: 54, background: 'linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 35%)', pointerEvents: 'none'}} />
  </div>
);

const S4: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const site = lf < S(TL.appSwitch);
  const swap = clamp((lf - S(TL.appSwitch)) / 6);
  const ry = interpolate(lf, [0, S(SC.digital[1] - SC.digital[0])], [-22, 18]);
  const intro = spring({frame: lf, fps, config: {damping: 16, stiffness: 90}});
  const sc = interpolate(lf, [10, S(TL.appSwitch) - 3], [0, -560], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const l2 = lf - S(TL.appSwitch);
  const cartT = S(TL.checkout);
  const url = (txt: string, a: number) => <div style={{display: 'inline-block', padding: '10px 26px', borderRadius: 16, background: GOLD, color: '#141210', fontFamily: F, fontWeight: 900, fontSize: 54, direction: 'ltr',
    transform: `scale(${a})`}}>{txt}</div>;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Bg f={lf} glow={0.18} y={46} />
      <Particles f={lf} n={24} />
      <Phone3D lf={lf} ry={ry * (0.4 + 0.6 * intro)} s={0.7 + 0.3 * intro}>
        {site ? <Img src={staticFile('cine/live_site.jpg')} style={{position: 'absolute', top: sc, left: 0, width: 446}} /> : (
          <>
            <AbsoluteFill style={{background: '#f6f6f8'}} />
            <Img src={staticFile('cine/live_banner.jpg')} style={{position: 'absolute', top: 30, left: 12, width: 422, borderRadius: 16, opacity: swap}} />
            <Img src={staticFile('appshow/samsung.jpg')} style={{position: 'absolute', top: 270, left: 12, width: 422, borderRadius: 16, opacity: swap}} />
            {lf >= cartT ? <><AbsoluteFill style={{background: '#fff'}} />
              <Img src={staticFile('appshow/iphone.jpg')} style={{position: 'absolute', top: 40, left: 12, width: 422, borderRadius: 16}} />
              <Img src={staticFile('howto/checkout_btn.png')} style={{position: 'absolute', bottom: 60, left: 20, width: 406, transform: `scale(${lf > cartT + 22 && lf < cartT + 28 ? 0.94 : 1})`}} />
              {lf > cartT + 18 ? <div style={{position: 'absolute', bottom: 70, left: 190, width: 70, height: 70, borderRadius: 35, border: '4px solid #fff', background: 'rgba(255,255,255,0.3)', opacity: clamp(1 - (lf - cartT - 24) / 14), transform: `scale(${0.6 + clamp((lf - cartT - 18) / 14) * 1.2})`}} /> : null}
            </> : null}
          </>
        )}
      </Phone3D>
      {/* UI cards popping out of the screen (real app captures) */}
      {!site && lf < cartT ? (
        <>
          {[{src: 'appshow/picker.jpg', x: 70, y: 600, w: 330, at: 10, r: -8}, {src: 'appshow/iphone.jpg', x: 690, y: 900, w: 320, at: 26, r: 7}].map((c) => {
            const a = spring({frame: l2 - c.at, fps, config: {damping: 13, stiffness: 140}});
            return <div key={c.src} style={{position: 'absolute', left: c.x, top: c.y, width: c.w, borderRadius: 22, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.7)', border: `2px solid ${GOLD}`,
              opacity: clamp(a * 1.4), transform: `perspective(1400px) rotateY(${c.r * 2}deg) translateZ(${a * 80}px) scale(${0.5 + 0.5 * a}) rotate(${c.r}deg)`}}>
              <Img src={staticFile(c.src)} style={{width: '100%', display: 'block'}} /></div>;
          })}
        </>
      ) : null}
      <div style={{position: 'absolute', top: 340, left: 0, right: 0, textAlign: 'center'}}>
        {site ? url(C.site, spring({frame: lf - 6, fps, config: {damping: 12, stiffness: 180}})) : url(C.app, spring({frame: lf - S(TL.appSwitch) - 4, fps, config: {damping: 12, stiffness: 180}}))}
      </div>
      <AbsoluteFill style={{background: `rgba(255,255,255,${clamp(1 - Math.abs(lf - S(TL.appSwitch)) / 4) * 0.7})`}} />
    </AbsoluteFill>
  );
};

// ---------- S5 delivery ----------
// governorate centres (lon, lat) — illustrative map, no borders drawn
const GOV: [string, number, number][] = [['النجف', 44.34, 32.03], ['بغداد', 44.36, 33.31], ['البصرة', 47.78, 30.51], ['نينوى', 43.13, 36.34], ['أربيل', 44.01, 36.19],
  ['السليمانية', 45.43, 35.56], ['كركوك', 44.39, 35.47], ['دهوك', 42.99, 36.87], ['كربلاء', 44.02, 32.61], ['بابل', 44.42, 32.48], ['الديوانية', 44.92, 31.99],
  ['واسط', 45.82, 32.51], ['ميسان', 47.14, 31.84], ['ذي قار', 46.26, 31.05], ['المثنى', 45.28, 31.32], ['الأنبار', 43.30, 33.42], ['ديالى', 44.64, 33.75], ['صلاح الدين', 43.68, 34.60]];
const P = (lon: number, lat: number) => [110 + ((lon - 42.4) / (48.2 - 42.4)) * 860, 230 + ((37.2 - lat) / (37.2 - 30.2)) * 700];

const LineArt: React.FC<{l: number}> = ({l}) => {
  // 0–1.5 s box closes · 1.5–3.5 s van drives · 3.5–5 s box at the door ✓
  const box = clamp(l / S(1.2)), van = clamp((l - S(1.5)) / S(2.0)), door = clamp((l - S(3.5)) / S(0.8));
  const st = {fill: 'none', stroke: GOLD, strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const dash = (p: number, len = 900) => ({strokeDasharray: len, strokeDashoffset: len * (1 - p)});
  return (
    <svg width="1080" height="900" viewBox="0 0 1080 900" style={{position: 'absolute', top: 470, left: 0}}>
      <line x1={60} y1={700} x2={1020} y2={700} stroke="rgba(243,180,6,0.35)" strokeWidth={3} />
      {l < S(1.6) ? <g transform="translate(540 470)">
        <path d="M-150 -40 L0 -100 L150 -40 L0 20 Z" {...st} style={dash(box)} />
        <path d="M-150 -40 L-150 140 L0 200 L0 20 M150 -40 L150 140 L0 200" {...st} style={dash(box, 1100)} />
        <path d="M-75 -70 L75 -10" stroke={GOLD2} strokeWidth={10} style={dash(clamp(box * 1.6 - 0.6), 200)} fill="none" />
      </g> : null}
      {l >= S(1.4) ? <g transform={`translate(${-260 + van * 860} 560) scale(1.2)`} opacity={1 - door * 0.0}>
        <path d="M-120 0 L60 0 L60 -110 L-120 -110 Z M60 -80 L110 -80 L140 -40 L140 0 L60 0" {...st} />
        <circle cx={-80} cy={10} r={22} {...st} /><circle cx={100} cy={10} r={22} {...st} />
        {van > 0 && van < 1 ? [0, 1, 2].map((i) => <line key={i} x1={-150 - i * 40} y1={-80 + i * 30} x2={-210 - i * 40} y2={-80 + i * 30} stroke={GOLD2} strokeWidth={5} opacity={0.6} />) : null}
      </g> : null}
      {l >= S(3.3) ? <g transform="translate(860 520)">
        <path d="M-110 180 L-110 -30 L0 -120 L110 -30 L110 180 Z" {...st} style={dash(door, 900)} />
        <path d="M-35 180 L-35 60 L35 60 L35 180" {...st} style={dash(door, 400)} />
        <g transform={`translate(${-170 + 0 * door} 130)`} opacity={door}><path d="M-40 -30 L40 -30 L40 40 L-40 40 Z M-40 -30 L0 -50 L40 -30" {...st} /></g>
        <circle cx={90} cy={-130} r={40} fill={GOLD} opacity={clamp((l - S(4.1)) / 6)} />
        <path d="M70 -130 L86 -114 L112 -146" stroke="#141210" strokeWidth={9} fill="none" strokeLinecap="round" opacity={clamp((l - S(4.2)) / 6)} />
      </g> : null}
    </svg>
  );
};

const S5: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const mapPhase = lf < S(TL.mapEnd);
  const [nx, ny] = P(44.34, 32.03);
  const tilt = 34 - 10 * eOut(lf / S(TL.mapEnd));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Bg f={lf} glow={0.14} y={50} />
      {mapPhase ? (
        <>
          <div style={{position: 'absolute', left: 0, top: 260, width: 1080, height: 1100, transform: `perspective(1800px) rotateX(${tilt}deg)`, transformOrigin: '50% 60%'}}>
            <svg width="1080" height="1100" style={{position: 'absolute'}}>
              {[...Array(26)].map((_, i) => [...Array(24)].map((__, j) => <circle key={`${i}-${j}`} cx={60 + i * 38} cy={140 + j * 38} r={2} fill="rgba(243,180,6,0.16)" />))}
              {GOV.slice(1).map(([n, lo, la], i) => {
                const [x, y] = P(lo, la); const p = eOut(clamp((lf - 6 - i * 3) / 14));
                return <g key={n}>
                  <line x1={nx} y1={ny} x2={nx + (x - nx) * p} y2={ny + (y - ny) * p} stroke={GOLD2} strokeWidth={3} opacity={0.85} style={{filter: `drop-shadow(0 0 6px ${GOLD})`}} />
                  <circle cx={x} cy={y} r={7 + 8 * p * Math.abs(Math.sin(lf / 8 + i))} fill="none" stroke={GOLD} strokeWidth={2} opacity={p} />
                  <circle cx={x} cy={y} r={7} fill={GOLD} opacity={p} />
                  {Math.hypot(x - nx, y - ny) > 70 ? <text x={x} y={y - 18} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={24} fill="rgba(255,255,255,0.85)" opacity={p}>{n}</text> : null}
                </g>;
              })}
              <circle cx={nx} cy={ny} r={18 + 6 * Math.sin(lf / 5)} fill={GOLD} style={{filter: `drop-shadow(0 0 18px ${GOLD})`}} />
              <text x={nx} y={ny + 52} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill={GOLD2}>النجف الأشرف</text>
            </svg>
          </div>
          <Title lf={lf} at={4} top={340} size={62}>{C.delivery[0]}</Title>
        </>
      ) : (
        <>
          <LineArt l={lf - S(TL.mapEnd)} />
          {C.delivery.slice(1).map((t, i) => {
            const a = spring({frame: lf - S(TL.mapEnd) - S(0.5 + i * 1.6), fps, config: {damping: 14, stiffness: 160}});
            return <div key={t} style={{position: 'absolute', top: 330 + i * 140, left: 64, right: 230, textAlign: 'right', direction: 'rtl', fontFamily: F, fontWeight: 900, fontSize: i ? 38 : 50, lineHeight: 1.3,
              color: i ? 'rgba(255,255,255,0.8)' : W, opacity: clamp(a * 1.5), transform: `translateX(${(1 - a) * 80}px)`}}>{i ? t : <><span style={goldText}>توصيل مجاني</span> للطلبات المشمولة</>}</div>;
          })}
          <div style={{position: 'absolute', top: 1220, left: 64, right: 230, textAlign: 'right', fontFamily: F, fontWeight: 700, fontSize: 24, color: 'rgba(255,255,255,0.45)', direction: 'rtl'}}>رسوم توضيحية</div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------- S6 finale ----------
const S6: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const gather = eExpo(clamp(lf / S(1.6)));
  const stack = lf >= S(TL.finaleStack);
  const l2 = lf - S(TL.finaleStack);
  const logoA = spring({frame: lf - 8, fps, config: {damping: 13, stiffness: 120}});
  const D = C.devices;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Bg f={lf} glow={0.3} y={40} />
      <Particles f={lf} n={50} />
      {!stack ? D.map((d, i) => {
        const a = (i / D.length) * Math.PI * 2 + lf / 34;
        const r = 1300 - 850 * gather, z = Math.sin(a);
        return <div key={d.img} style={{position: 'absolute', zIndex: z > 0 ? 3 : 1}}>
          <Device img={d.img} h={230 + 60 * z} x={540 + Math.cos(a) * r} y={780 + z * 150} ry={-Math.cos(a) * 40} o={0.55 + 0.45 * (z + 1) / 2} refl={false} />
        </div>;
      }) : null}
      <div style={{position: 'absolute', left: 540, top: stack ? 560 : 780, zIndex: 2, transform: `translate(-50%, -50%) scale(${(stack ? 0.62 : 1) * (0.6 + 0.4 * logoA)})`, transition: 'none'}}>
        <Img src={staticFile('logo.png')} style={{width: 460, filter: 'drop-shadow(0 0 40px rgba(243,180,6,0.6))'}} />
      </div>
      {stack ? (
        <div style={{position: 'absolute', top: 760, left: 64, right: 64, textAlign: 'center', fontFamily: F}}>
          {[
            <div key="en" style={{fontWeight: 900, fontSize: 64, letterSpacing: 8, direction: 'ltr', ...goldText}}>{C.brand.en}</div>,
            <div key="ar" style={{fontWeight: 900, fontSize: 72, color: W}}>{C.brand.ar}</div>,
            <div key="ad" style={{fontWeight: 800, fontSize: 36, color: 'rgba(255,255,255,0.8)', direction: 'rtl'}}>{C.address}</div>,
            <div key="site" style={{display: 'inline-block', marginTop: 6, padding: '6px 24px', borderRadius: 14, border: `2px solid ${GOLD}`, fontWeight: 900, fontSize: 46, color: GOLD, direction: 'ltr'}}>{C.site}</div>,
            <div key="app" style={{display: 'inline-block', marginTop: 10, padding: '14px 40px', borderRadius: 22, background: `linear-gradient(135deg, ${GOLD2}, ${GOLD} 55%, ${GD})`, fontWeight: 900, fontSize: 44, color: '#1b1405', direction: 'rtl', boxShadow: '0 18px 44px rgba(243,180,6,0.4)'}}>حمّل تطبيق جي فاير للموبايل</div>,
          ].map((el, i) => {
            const a = spring({frame: l2 - i * 5, fps, config: {damping: 14, stiffness: 170}});
            return <div key={i} style={{marginTop: 18, opacity: clamp(a * 1.5), transform: `translateY(${(1 - a) * 40}px)`}}>{el}</div>;
          })}
        </div>
      ) : null}
      <AbsoluteFill style={{background: `rgba(255,240,200,${clamp(1 - Math.abs(lf - S(TL.finaleStack)) / 4) * 0.6})`}} />
    </AbsoluteFill>
  );
};

export const Commercial: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const at = (k: keyof typeof SC) => t >= SC[k][0] && t < SC[k][1];
  const lf = (k: keyof typeof SC) => f - S(SC[k][0]);
  if (at('end')) return <AbsoluteFill style={{background: '#000'}}><EndCard /></AbsoluteFill>;
  const body = at('logo') ? <S1 lf={lf('logo')} /> : at('world') ? <S2 lf={lf('world')} /> : at('used') ? <S3 lf={lf('used')} /> : at('digital') ? <S4 lf={lf('digital')} />
    : at('delivery') ? <S5 lf={lf('delivery')} /> : <S6 lf={lf('finale')} />;
  // scene-change flash + short zoom punch on every scene boundary
  const starts = [SC.world[0], SC.used[0], SC.digital[0], SC.delivery[0], SC.finale[0]];
  const since = Math.min(...starts.map((s) => (t >= s ? t - s : 99)));
  const punch = since < 0.25 ? 1 + 0.06 * (1 - since / 0.25) : 1;
  const flash = since < 0.12 ? 1 - since / 0.12 : 0;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${punch})`}}>{body}</AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: flash * 0.55}} />
      {!at('logo') && !at('finale') ? <LogoBug /> : null}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
