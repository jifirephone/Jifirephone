// Ji Fire offer reel v2 (2026-11-07), built from the store's own Shopify data and product images
// (read through the Shopify connector; see scripts_reels/offer-2026-11-07/shopify_verified.json).
// Rule from the owner: no raw screen recordings. Everything is layered motion graphics:
// cut-out product images in 3D, counting prices, a rebuilt discount ticket, icons, kinetic headlines.
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Icon, ICON} from '../AppPromo';
import {color, font} from '../brand';

export const SHOP_FRAMES = 1291; // 43.0 s, scenes timed to the voiceover (v5 take, cuts in real silences)
const gold = color.gold;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

// ---------- shared pieces ----------
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#08070A'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle 950px at ${540 + Math.sin(f / 70) * 240}px ${960 + Math.cos(f / 90) * 280}px, rgba(243,180,6,0.17), transparent 70%)`}} />
      <AbsoluteFill style={{opacity: 0.1, backgroundImage: `radial-gradient(circle, ${gold} 1.5px, transparent 2px)`, backgroundSize: '60px 60px',
        backgroundPosition: `${(f * 0.5) % 60}px ${(f * 0.25) % 60}px`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 48%, transparent 55%, rgba(0,0,0,0.8) 100%)'}} />
    </AbsoluteFill>
  );
};

const runs = (text: string) => {
  const out: {latin: boolean; words: string[]}[] = [];
  const add = (w: string, latin: boolean) => {
    const last = out[out.length - 1];
    if (last && latin && last.latin) last.words.push(w);
    else out.push({latin, words: [w]});
  };
  for (const raw of text.split(' ')) {
    // trailing Arabic punctuation (؟ ، !) belongs to the sentence, not to the English name before it
    const m = raw.match(/^(.*?)([\u061F\u060C!]+)$/);
    const split = !!(m && m[1] && !/[\u0621-\u064A]/.test(m[1])); // only split English words: «يومين!» stays whole
    const w = split ? m![1] : raw;
    add(w, !/[\u0621-\u064A]/.test(w));
    if (split) add(m![2], false);
  }
  return out;
};

type Anim = 'rise' | 'blur' | 'drop' | 'scale';
const Head: React.FC<{f: number; text: string; gold?: string[]; size?: number; y?: number; out?: number; anim?: Anim}> = ({f, text, gold: g = [], size = 92, y = 240, out, anim = 'blur'}) => {
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: y, left: 64, right: 64, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
      direction: 'rtl', columnGap: size * 0.28, fontFamily: font.family, fontWeight: 900, fontSize: size, lineHeight: 1.25}}>
      {runs(text).map((run, i) => {
        const s = spring({frame: f - i * 4, fps, config: anim === 'scale' ? {damping: 12, stiffness: 180} : {damping: 18, stiffness: 120}});
        const o = out === undefined ? 1 : clamp((out - f) / 8);
        const v = Math.min(s, o);
        const tr = anim === 'rise' ? `translateY(${(1 - s) * 60}px)` : anim === 'drop' ? `translateY(${(1 - s) * -60}px)`
          : anim === 'scale' ? `scale(${1.4 - 0.4 * s})` : `translateY(${(1 - s) * 24}px)`;
        return (
          <span key={i} dir={run.latin ? 'ltr' : 'rtl'} style={{display: 'inline-block', opacity: v, unicodeBidi: 'isolate',
            filter: `blur(${(1 - v) * 14}px)`, transform: tr}}>
            {run.words.map((w, j) => (
              <span key={j} style={{color: g.includes(w) ? gold : '#fff', marginInlineStart: j ? size * 0.25 : 0,
                textShadow: g.includes(w) ? `0 0 36px ${gold}66` : '0 6px 22px rgba(0,0,0,0.7)'}}>{w}</span>
            ))}
          </span>
        );
      })}
    </div>
  );
};

const Chip: React.FC<{children: React.ReactNode; solid?: boolean; size?: number}> = ({children, solid, size = 48}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '14px 34px', borderRadius: 999, direction: 'rtl', whiteSpace: 'nowrap',
    background: solid ? gold : 'rgba(255,255,255,0.06)', border: `2px solid ${solid ? gold : gold + '99'}`, color: solid ? '#000' : '#fff',
    fontFamily: font.family, fontWeight: 900, fontSize: size, boxShadow: solid ? `0 0 40px ${gold}66` : 'none'}}>{children}</div>
);

const Pop: React.FC<{f: number; at: number; children: React.ReactNode; from?: 'up' | 'down' | 'scale' | 'left' | 'right'}> = ({f, at, children, from = 'scale'}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 14, stiffness: 150}});
  const t = {up: `translateY(${(1 - s) * -70}px)`, down: `translateY(${(1 - s) * 90}px)`, scale: `scale(${0.6 + 0.4 * s})`,
    left: `translateX(${(1 - s) * -200}px)`, right: `translateX(${(1 - s) * 200}px)`}[from];
  return <div style={{opacity: clamp(s * 2), transform: t, filter: `blur(${(1 - s) * 8}px)`}}>{children}</div>;
};
const Row: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 5}}>{children}</div>
);

// Product hero: cut-out image arrives from depth, turns slowly in 3D, gets a gold rim light and a light sweep.
const Hero: React.FC<{f: number; src: string; w: number; x?: number; y: number; at?: number; spin?: number; from?: 'depth' | 'left' | 'right'}> = ({f, src, w, x = (1080 - w) / 2, y, at = 0, spin = 10, from = 'depth'}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 16, stiffness: 70}});
  const enter = from === 'depth' ? `translateZ(${(1 - s) * -900}px) scale(${0.6 + 0.4 * s})`
    : `translateX(${(1 - s) * (from === 'left' ? -900 : 900)}px) rotateY(${(1 - s) * (from === 'left' ? -50 : 50)}deg)`;
  // cheap look: glow and shadow are plain gradients behind the image (no per-frame filters on the photo);
  // blur only while the product is still arriving
  const arriving = s < 0.98;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, perspective: 1600}}>
      <div style={{position: 'absolute', left: '-15%', right: '-15%', top: '5%', bottom: '-5%', borderRadius: '50%', opacity: clamp(s),
        background: `radial-gradient(ellipse at center, ${gold}30, rgba(243,180,6,0.08) 45%, transparent 70%)`}} />
      <div style={{transform: `${enter} rotateY(${Math.sin((f - at) / 34) * spin}deg) rotateX(${Math.cos((f - at) / 47) * 3}deg) translateY(${Math.sin((f - at) / 26) * 10}px)`,
        opacity: clamp(s * 1.6), filter: arriving ? `blur(${(1 - s) * 10}px)` : 'none', position: 'relative'}}>
        <Img src={staticFile(src)} style={{width: w, display: 'block'}} />
      </div>
      {/* floor reflection */}
      <div style={{position: 'absolute', left: '5%', right: '5%', bottom: -50, height: 90, borderRadius: '50%',
        background: `radial-gradient(ellipse at center, rgba(0,0,0,0.7), ${gold}22 55%, transparent 72%)`, opacity: clamp(s)}} />
    </div>
  );
};

// Price card that counts up to the store's real price (IQD).
const Price: React.FC<{f: number; at: number; value: number; label?: string; sub?: string}> = ({f, at, value, label, sub}) => {
  const p = ease(clamp((f - at - 6) / 30));
  return (
    <Pop f={f} at={at} from="down">
      <div style={{padding: '22px 44px 26px', borderRadius: 36, background: 'linear-gradient(160deg,#18161B,#0C0B0E)', border: `2px solid ${gold}aa`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 50px ${gold}26`, display: 'flex', flexDirection: 'column', alignItems: 'center', direction: 'rtl'}}>
        {label ? <div style={{fontFamily: font.family, fontWeight: 800, fontSize: 36, color: '#ffffffcc'}}>{label}</div> : null}
        <div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
          <span style={{fontFamily: font.family, fontWeight: 900, fontSize: 112, color: gold, direction: 'ltr', textShadow: `0 0 40px ${gold}66`}}>{fmt(value * p)}</span>
          <span style={{fontFamily: font.family, fontWeight: 800, fontSize: 46, color: '#fff'}}>دينار</span>
        </div>
        {sub ? <div style={{fontFamily: font.family, fontWeight: 700, fontSize: 32, color: '#ffffffaa', marginTop: 2}}>{sub}</div> : null}
      </div>
    </Pop>
  );
};

// ---------- scenes ----------
type SceneEl = React.FC<{f: number}>;

const SHook: SceneEl = ({f}) => (
  <>
    {f < 62 ? <Head f={f} text="تريد iPhone 17 أو 18" gold={['17', '18']} out={62} anim="rise" />
      : <Head f={f - 62} text="أو Galaxy S26 Ultra؟" gold={['S26', 'Ultra']} anim="blur" />}
    <Hero f={f} src="shop/s26.png" w={430} x={-30} y={640} at={10} from="left" spin={8} />
    <Hero f={f} src="shop/p18.png" w={440} x={670} y={600} at={18} from="right" spin={8} />
    <Hero f={f} src="shop/p17.png" w={520} y={520} at={0} spin={6} />
    <Row y={1290}><Pop f={f} at={72}><Chip solid size={64}>بأنسب سعر بالسوق</Chip></Pop></Row>
  </>
);

const SP17: SceneEl = ({f}) => (
  <>
    <Head f={f} text="iPhone 17 Pro Max" gold={['17']} size={100} anim="scale" />
    <Hero f={f} src="shop/p17.png" w={700} y={430} at={0} spin={14} />
    <Row y={1150}><Price f={f} at={22} value={1950000} label="يبدي من" sub="256GB • شريحة فعلية" /></Row>
  </>
);

const SP18: SceneEl = ({f}) => {
  const swap = clamp((f - 55) / 14);
  return (
    <>
      <Head f={f} text="iPhone 18 Pro Max" gold={['18']} size={100} anim="drop" />
      <div style={{opacity: 1 - swap}}><Hero f={f} src="shop/p18.png" w={620} y={430} at={0} from="right" spin={12} /></div>
      <div style={{opacity: swap}}><Hero f={f} src="shop/p18back.png" w={620} y={430} at={50} spin={12} /></div>
      <Row y={1150}><Price f={f} at={22} value={2575000} label="يبدي من" sub="256GB • شريحة فعلية" /></Row>
    </>
  );
};

const SS26: SceneEl = ({f}) => (
  <>
    <Head f={f} text="Galaxy S26 Ultra" gold={['S26']} size={100} anim="rise" />
    <Hero f={f} src="shop/s26.png" w={640} y={440} at={0} spin={10} />
    <Row y={1150}><Price f={f} at={22} value={1485000} sub="256GB • 12GB RAM" /></Row>
  </>
);

const SCode: SceneEl = ({f}) => {
  const {fps} = useVideoConfig();
  const code = 'j2026';
  const typed = code.slice(0, clamp(Math.floor((f - 26) / 4), 0, code.length));
  const amt = ease(clamp((f - 46) / 24)) * 25000;
  const tap = (f - 82) / 16;
  const t = spring({frame: f, fps, config: {damping: 15, stiffness: 90}});
  return (
    <>
      <Head f={f} text="كود خصم 25 الف" gold={['25', 'الف']} size={104} anim="scale" />
      <div style={{position: 'absolute', left: 90, top: 520, width: 900, transform: `perspective(1600px) rotateX(${(1 - t) * 40}deg) rotateY(${Math.sin(f / 40) * 6}deg) translateY(${(1 - t) * 200}px)`, opacity: clamp(t * 1.5)}}>
        <div style={{position: 'relative', height: 640, borderRadius: 48, background: 'linear-gradient(150deg,#1B181E,#0C0B0E)',
          border: `3px dashed ${gold}`, boxShadow: `0 50px 120px rgba(0,0,0,0.7), 0 0 70px ${gold}33`, overflow: 'hidden', direction: 'rtl'}}>
          {/* ticket notches */}
          <div style={{position: 'absolute', top: 300, left: -40, width: 80, height: 80, borderRadius: 99, background: '#08070A'}} />
          <div style={{position: 'absolute', top: 300, right: -40, width: 80, height: 80, borderRadius: 99, background: '#08070A'}} />
          <div style={{position: 'absolute', top: 340, left: 60, right: 60, borderTop: `3px dashed ${gold}55`}} />
          <div style={{position: 'absolute', top: 50, left: 0, right: 0, textAlign: 'center', fontFamily: font.family, fontWeight: 800, fontSize: 44, color: '#ffffffcc'}}>كود الخصم</div>
          <div style={{position: 'absolute', top: 110, left: 0, right: 0, textAlign: 'center', fontFamily: font.family, fontWeight: 900, fontSize: 170, color: gold,
            direction: 'ltr', letterSpacing: 8, textShadow: `0 0 50px ${gold}88`}}>{typed}<span style={{opacity: f % 20 < 10 && typed.length < code.length ? 1 : 0}}>|</span></div>
          <div style={{position: 'absolute', top: 360, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16}}>
            <span style={{fontFamily: font.family, fontWeight: 800, fontSize: 52, color: '#fff'}}>خصم</span>
            <span style={{fontFamily: font.family, fontWeight: 900, fontSize: 96, color: gold, direction: 'ltr'}}>{fmt(amt)}</span>
            <span style={{fontFamily: font.family, fontWeight: 800, fontSize: 52, color: '#fff'}}>دينار</span>
          </div>
          <div style={{position: 'absolute', top: 525, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <Pop f={f} at={66}><div style={{position: 'relative'}}>
              <Chip solid size={46}>{f < 90 ? 'انسخ الكود' : '✓ تم نسخ الكود'}</Chip>
              {tap > 0 && tap < 1.3 ? <div style={{position: 'absolute', left: '50%', top: '50%', width: 60 + 140 * clamp(tap), height: 60 + 140 * clamp(tap),
                transform: 'translate(-50%,-50%)', borderRadius: 999, border: `5px solid #fff`, opacity: clamp(1.3 - tap)}} /> : null}
            </div></Pop>
          </div>
        </div>
      </div>
      <Row y={1230}><Pop f={f} at={96} from="down">
        <div style={{fontFamily: font.family, fontWeight: 700, fontSize: 34, color: '#ffffffaa', direction: 'rtl'}}>لمرة وحدة لكل زبون • للطلبات فوق 200 الف</div>
      </Pop></Row>
    </>
  );
};

const SDelivery: SceneEl = ({f}) => {
  const p = ease(clamp((f - 14) / 46));
  // gold path from left to the house on the right
  const path = 'M 120 1050 C 320 760, 620 1180, 860 860';
  const bez = (t: number) => {
    const P = [[120, 1050], [320, 760], [620, 1180], [860, 860]]; const u = 1 - t;
    return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]);
  };
  const [bx, by] = bez(p);
  return (
    <>
      <Head f={f} text="توصيل مجاني لباب البيت" gold={['مجاني']} size={92} anim="rise" />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d={path} fill="none" stroke={`${gold}33`} strokeWidth={10} strokeLinecap="round" strokeDasharray="4 22" />
        <path d={path} fill="none" stroke={gold} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </svg>
      <div style={{position: 'absolute', left: 760, top: 700}}><Icon f={f} delay={4} size={220} d={ICON.house} fill /></div>
      <div style={{position: 'absolute', left: bx - 85, top: by - 110, transform: `rotate(${Math.sin(f / 6) * 4}deg)`}}><Icon f={f} delay={10} size={170} d={ICON.box} fill /></div>
      <Row y={1250}><Pop f={f} at={50} from="down"><Chip solid size={54}>لكل محافظات العراق</Chip></Pop></Row>
    </>
  );
};

const SWarranty: SceneEl = ({f}) => {
  const card = (at: number, icon: string[], title: string, sub: string, x: number, from: 'left' | 'right') => (
    <div style={{position: 'absolute', top: 540, left: x}}>
      <Pop f={f} at={at} from={from}>
        <div style={{width: 430, height: 560, borderRadius: 44, background: 'linear-gradient(160deg,#18161B,#0D0C0F)', border: `2px solid ${gold}99`,
          boxShadow: `0 40px 90px rgba(0,0,0,0.6), 0 0 50px ${gold}22`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26}}>
          <Icon f={f} delay={at + 4} size={220} d={icon} fill />
          <div style={{fontFamily: font.family, fontWeight: 900, fontSize: 72, color: '#fff'}}>{title}</div>
          <div style={{fontFamily: font.family, fontWeight: 700, fontSize: 38, color: gold}}>{sub}</div>
        </div>
      </Pop>
    </div>
  );
  return (
    <>
      <Head f={f} text="ويه ضمان ووصل ضمان" gold={['ضمان']} size={92} anim="drop" />
      {card(6, ICON.shield, 'ضمان', 'على جهازك', 560, 'right')}
      {card(16, ['M25 8 H75 V92 L67 86 L59 92 L50 86 L41 92 L33 86 L25 92 Z', 'M36 30 H64', 'M36 46 H64', 'M36 62 H54'], 'وصل ضمان', 'بإيدك', 90, 'left')}
    </>
  );
};

const SUrgent: SceneEl = ({f}) => {
  const {fps} = useVideoConfig();
  const secsLeft = 2 * 86400 - 1 - Math.floor(f / 30);
  const hh = String(Math.floor((secsLeft % 86400) / 3600)).padStart(2, '0');
  const mm = String(Math.floor((secsLeft % 3600) / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');
  const box = (v: string, label: string, at: number) => {
    const s = spring({frame: f - at, fps, config: {damping: 12, stiffness: 170}});
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transform: `scale(${0.6 + 0.4 * s}) rotateX(${(1 - s) * 60}deg)`, opacity: clamp(s * 2)}}>
        <div style={{width: 210, height: 240, borderRadius: 34, background: '#141216', border: `3px solid ${gold}`, boxShadow: `0 0 50px ${gold}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.family, fontWeight: 900, fontSize: 150, color: gold, direction: 'ltr'}}>{v}</div>
        <div style={{fontFamily: font.family, fontWeight: 800, fontSize: 42, color: '#fff'}}>{label}</div>
      </div>
    );
  };
  return (
    <>
      <Head f={f} text="العرض يخلص بعد يومين!" gold={['يومين!']} size={96} anim="scale" />
      <div style={{position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22, direction: 'rtl', perspective: 1200}}>
        {box('02', 'يوم', 6)}{box(hh, 'ساعة', 12)}{box(mm, 'دقيقة', 18)}{box(ss, 'ثانية', 24)}
      </div>
      <Row y={940}><div style={{fontFamily: font.family, fontWeight: 700, fontSize: 36, color: '#ffffffaa', opacity: clamp((f - 30) / 10), direction: 'rtl'}}>ينتهي 10/11 الساعة 12 بالليل</div></Row>
      <Row y={1080}><Pop f={f} at={46}><Chip solid size={58}>يلا الحگ قبل لا تصعد الأسعار!</Chip></Pop></Row>
    </>
  );
};

const SApp: SceneEl = ({f}) => (
  <>
    {f < 50 ? <Head f={f} text="نزّل تطبيق جي فاير للموبايل" gold={['جي', 'فاير']} size={86} out={50} anim="blur" />
      : <Head f={f - 50} text="واطلب هسه" gold={['هسه']} size={110} anim="scale" />}
    <Hero f={f} src="shop/p17.png" w={300} x={70} y={640} at={8} from="left" spin={6} />
    <Hero f={f} src="shop/s26.png" w={300} x={710} y={660} at={14} from="right" spin={6} />
    <div style={{position: 'absolute', left: 390, top: 560}}>
      <Pop f={f} at={0} from="down">
        <div style={{width: 300, height: 600, borderRadius: 50, padding: 10, background: 'linear-gradient(150deg,#3a3630,#121013 40%,#2b2722)', boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 0 2px ${gold}66`}}>
          <div style={{width: 280, height: 580, borderRadius: 42, overflow: 'hidden', background: '#fff'}}>
            <Img src={staticFile('offer/picker.png')} style={{width: 280, height: 580, objectFit: 'cover', objectPosition: 'top'}} />
          </div>
        </div>
      </Pop>
    </div>
    <Row y={1260}><div style={{display: 'flex', gap: 22, direction: 'ltr'}}>
      <Pop f={f} at={22} from="down"><Chip size={44}><span>▶</span><span dir="ltr">Google Play</span></Chip></Pop>
      <Pop f={f} at={30} from="down"><Chip size={44}><span>⬇</span><span dir="ltr">App Store</span></Chip></Pop>
    </div></Row>
    <Row y={1370}><div style={{fontFamily: font.family, fontWeight: 700, fontSize: 32, color: '#ffffffcc', direction: 'ltr', opacity: clamp((f - 40) / 10)}}>app.jifrephone.workers.dev</div></Row>
  </>
);

const SEnd: SceneEl = ({f}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 6, fps, config: {damping: 16, stiffness: 100}});
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', paddingTop: 500}}>
      <div style={{opacity: s, transform: `scale(${0.85 + 0.15 * s})`, filter: `blur(${(1 - s) * 10}px)`}}><Img src={staticFile('logo.png')} style={{width: 560}} /></div>
      <div style={{marginTop: 46, opacity: clamp((f - 22) / 12), fontFamily: font.family, fontWeight: 800, fontSize: 64, color: '#fff', direction: 'rtl'}}>التقنية باعلى ذروتها</div>
    </AbsoluteFill>
  );
};

// ---------- timeline ----------
type Trans = 'zoomIn' | 'push' | 'iris' | 'whip' | 'blur' | 'slideUp' | 'dolly' | 'flip' | 'black';
const SCENES: {from: number; to: number; el: SceneEl; tin?: Trans; dur?: number}[] = [
  {from: 0, to: 153, el: SHook},
  {from: 153, to: 299, el: SP17, tin: 'zoomIn', dur: 18},
  {from: 299, to: 457, el: SP18, tin: 'push', dur: 18},
  {from: 457, to: 619, el: SS26, tin: 'iris', dur: 18},
  {from: 619, to: 754, el: SCode, tin: 'whip', dur: 14},
  {from: 754, to: 862, el: SDelivery, tin: 'blur', dur: 16},
  {from: 862, to: 962, el: SWarranty, tin: 'slideUp', dur: 18},
  {from: 962, to: 1082, el: SUrgent, tin: 'dolly', dur: 18},
  {from: 1082, to: 1182, el: SApp, tin: 'flip', dur: 20},
  {from: 1182, to: 1291, el: SEnd, tin: 'black', dur: 20},
];
export const SHOP_TRANSITIONS = SCENES.filter((s) => s.tin).map((s) => ({at: s.from, type: s.tin as Trans, dur: s.dur ?? 16}));

const tStyles = (t: Trans, p: number): {out: React.CSSProperties; in: React.CSSProperties} => {
  const q = ease(clamp(p));
  const o = clamp(1 - q * 1.7), i = clamp(q * 1.7 - 0.7);
  switch (t) {
    case 'zoomIn': return {out: {transform: `scale(${1 + q * 1.5})`, opacity: o}, in: {transform: `scale(${0.8 + 0.2 * q})`, opacity: i}};
    case 'push': return {out: {transform: `translateX(${q * 1080}px)`}, in: {transform: `translateX(${(q - 1) * 1080}px)`}};
    case 'iris': return {out: {opacity: 1 - q * 0.6}, in: {clipPath: `circle(${q * 125}% at 50% 50%)`}};
    case 'whip': return {out: {transform: `translateX(${q * -1080}px)`, filter: `blur(${q * 22}px)`}, in: {transform: `translateX(${(1 - q) * 1080}px)`, filter: `blur(${(1 - q) * 22}px)`}};
    case 'blur': return {out: {opacity: o, filter: `blur(${q * 16}px)`}, in: {opacity: i, filter: `blur(${(1 - q) * 16}px)`}};
    case 'slideUp': return {out: {transform: `translateY(${-q * 900}px)`, opacity: 1 - q}, in: {transform: `translateY(${(1 - q) * 1920}px)`}};
    case 'dolly': return {out: {transform: `scale(${1 - q * 0.45})`, opacity: o}, in: {transform: `scale(${1.3 - 0.3 * q})`, opacity: i}};
    case 'flip': return {out: {transform: `perspective(2000px) rotateY(${q * 90}deg)`, opacity: q < 0.5 ? 1 : 0}, in: {transform: `perspective(2000px) rotateY(${(q - 1) * 90}deg)`, opacity: q < 0.5 ? 0 : 1}};
    case 'black': return {out: {opacity: clamp(1 - q * 2)}, in: {opacity: clamp(q * 2 - 1)}};
  }
};

const Cam: React.FC<{local: number; len: number; children: React.ReactNode}> = ({local, len, children}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{transform: `translate(${Math.sin(f / 61) * 9}px, ${Math.cos(f / 73) * 7}px) scale(${1 + 0.04 * clamp(local / len)}) rotate(${Math.sin(f / 97) * 0.35}deg)`}}>
      {children}
    </AbsoluteFill>
  );
};
const Render: React.FC<{i: number; f: number}> = ({i, f}) => {
  const s = SCENES[i];
  const El = s.el;
  return <Cam local={f - s.from} len={s.to - s.from}><El f={f - s.from} /></Cam>;
};

export const ShopPromo: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.max(0, SCENES.findIndex((s) => f >= s.from && f < s.to));
  const cur = SCENES[idx];
  const inT = cur.tin && f < cur.from + (cur.dur ?? 16) ? cur.tin : undefined;
  if (!inT || idx === 0) return (<AbsoluteFill><Backdrop /><Render i={idx} f={f} /></AbsoluteFill>);
  const st = tStyles(inT, (f - cur.from) / (cur.dur ?? 16));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop />
      <AbsoluteFill style={st.out}><Render i={idx - 1} f={f} /></AbsoluteFill>
      <AbsoluteFill style={st.in}>{inT === 'iris' ? <Backdrop /> : null}<Render i={idx} f={f} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
