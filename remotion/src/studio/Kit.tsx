// Ji Fire motion studio: reusable pieces for premium motion-graphics reels.
// Technique (not content) learned from a reference reel, measured in work/fb:
//  - the camera never stops: slow drift (~9 px/s) plus eased moves between scenes on one big world canvas
//  - few hard cuts: scenes are places the camera travels to (pan, dolly-out, tilt, roll, zoom-through)
//  - a fixed headline at the top; words blur in and out, one accent word in brand colour
//  - floating dark panels with soft depth that arrive in 3D (tilt + depth + blur)
//  - focus brackets, a node graph with drawn lines, a drawn curve, a big numbered card
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color, font} from '../brand';
import cam from './promo_camera.json';

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export const palette = {
  bg: '#0A090C', // black (reference used slate #21242F; Ji Fire is black + gold)
  panel: '#17151A',
  panelEdge: 'rgba(255,255,255,0.07)',
  gold: color.gold,
  white: color.white,
  dim: 'rgba(255,255,255,0.55)',
};

type Key = {f: number; x: number; y: number; z: number; rx: number; ry: number; rz: number};

export const cameraAt = (f: number, keys: Key[] = cam.keys as Key[]): Key => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (f <= b.f) {
      const t = ease((f - a.f) / Math.max(1, b.f - a.f));
      const m = (k: keyof Key) => (a[k] as number) + ((b[k] as number) - (a[k] as number)) * t;
      return {f, x: m('x'), y: m('y'), z: m('z'), rx: m('rx'), ry: m('ry'), rz: m('rz')};
    }
  }
  return keys[keys.length - 1];
};

// The world: every scene lives at its own (x, y); the camera flies between them.
export const World: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const c = cameraAt(f);
  // hand-held drift on top of the keyed path, so a "still" shot still breathes
  const dx = Math.sin(f / 83) * 14, dy = Math.cos(f / 97) * 11;
  const drz = Math.sin(f / 131) * 0.5, dry = Math.sin(f / 109) * 1.6, drx = Math.cos(f / 117) * 1.2;
  return (
    <AbsoluteFill style={{perspective: 2200, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '540px 960px',
        transformStyle: 'preserve-3d',
        transform: `scale(${c.z}) rotateX(${c.rx + drx}deg) rotateY(${c.ry + dry}deg) rotateZ(${c.rz + drz}deg) translate(${-c.x - dx}px, ${-c.y - dy}px)`}}>
        {/* dot grid that moves with the world: it's what makes the camera move readable */}
        <div style={{position: 'absolute', left: -4000, top: -5000, width: 9000, height: 11000, opacity: 0.16,
          backgroundImage: `radial-gradient(circle, ${palette.gold} 1.6px, transparent 2px)`, backgroundSize: '64px 64px'}} />
        {children}
      </div>
    </AbsoluteFill>
  );
};

// A scene placed in the world, centred on (x, y), designed in its own 1080x1920 frame.
export const Place: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 1080, height: 1920, transformStyle: 'preserve-3d'}}>{children}</div>
);

export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: palette.bg}}>
      <AbsoluteFill style={{background: `radial-gradient(circle 900px at ${540 + Math.sin(f / 90) * 200}px ${900 + Math.cos(f / 120) * 250}px, rgba(243,180,6,0.13), transparent 70%)`}} />
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 85% 75% at 50% 48%, transparent 55%, rgba(0,0,0,0.8) 100%)'}} />
);

// Fixed headline at the top of the screen. Words blur in one by one and blur out before the next line.
export type Line = {from: number; to: number; text: string; accent?: string[]};
export const Headline: React.FC<{lines: Line[]; y?: number; size?: number}> = ({lines, y = 280, size = 92}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const l = lines.find((x) => f >= x.from && f < x.to);
  if (!l) return null;
  const words = l.text.split(' ');
  return (
    <div style={{position: 'absolute', top: y, left: 64, right: 64, display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
      direction: 'rtl', columnGap: size * 0.3, fontFamily: font.family, fontWeight: 900, fontSize: size, lineHeight: 1.3}}>
      {words.map((w, i) => {
        const s = spring({frame: f - l.from - i * 4, fps, config: {damping: 20, stiffness: 110}});
        const out = clamp((l.to - f - 2) / 9);
        const v = Math.min(s, out);
        const acc = (l.accent ?? []).includes(w);
        return (
          <span key={i} dir={/[؀-ۿ]/.test(w) ? 'rtl' : 'ltr'} style={{display: 'inline-block', color: acc ? palette.gold : palette.white,
            opacity: v, filter: `blur(${(1 - v) * 14}px)`, transform: `translateY(${(1 - s) * 26}px)`,
            textShadow: acc ? `0 0 34px ${palette.gold}66` : '0 6px 22px rgba(0,0,0,0.7)'}}>{w}</span>
        );
      })}
    </div>
  );
};

// Floating panel: arrives in 3D (tilt + depth + blur), then breathes.
export const Panel: React.FC<{at: number; x: number; y: number; w: number; h: number; children?: React.ReactNode;
  active?: boolean; from?: 'left' | 'right' | 'below'; radius?: number}> = ({at, x, y, w, h, children, active = true, from = 'below', radius = 36}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 18, stiffness: 90}});
  const rot = from === 'left' ? -28 : from === 'right' ? 28 : 0;
  const float = Math.sin((f - at) / 40) * 6;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: radius,
      background: `linear-gradient(160deg, ${palette.panel}, #0E0D10)`, border: `2px solid ${active ? palette.gold + '99' : palette.panelEdge}`,
      boxShadow: `0 40px 90px rgba(0,0,0,0.65)${active ? `, 0 0 50px ${palette.gold}22` : ''}`,
      opacity: clamp(s * 1.4), filter: `blur(${(1 - s) * 12}px)`,
      transform: `translateY(${(1 - s) * (from === 'below' ? 160 : 0) + float}px) translateX(${(1 - s) * (from === 'left' ? -260 : from === 'right' ? 260 : 0)}px) rotateY(${rot * (1 - s)}deg) rotateX(${from === 'below' ? 22 * (1 - s) : 0}deg) scale(${0.9 + 0.1 * s})`,
      transition: 'none', overflow: 'hidden'}}>
      {children}
    </div>
  );
};

export const T: React.FC<{size: number; c?: string; w?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({size, c = palette.white, w = 900, children, style}) => (
  <div style={{fontFamily: font.family, fontWeight: w, fontSize: size, color: c, direction: 'rtl', lineHeight: 1.25, ...style}}>{children}</div>
);

// Viewfinder corners that close in on a subject: a focus transition.
export const Brackets: React.FC<{at: number; cx: number; cy: number; w: number; h: number; dur?: number}> = ({at, cx, cy, w, h, dur = 22}) => {
  const f = useCurrentFrame();
  const p = ease(clamp((f - at) / dur));
  const vis = clamp((f - at) / 4) * clamp((at + dur + 26 - f) / 10);
  if (vis <= 0) return null;
  const W = w * (1.9 - 0.9 * p), H = h * (1.6 - 0.6 * p), L = 70;
  const corner = (sx: number, sy: number) => (
    <div style={{position: 'absolute', left: cx + sx * W / 2 - (sx > 0 ? L : 0), top: cy + sy * H / 2 - (sy > 0 ? L : 0), width: L, height: L,
      borderColor: palette.gold, borderStyle: 'solid', borderWidth: 0,
      [sy < 0 ? 'borderTopWidth' : 'borderBottomWidth']: 6, [sx < 0 ? 'borderLeftWidth' : 'borderRightWidth']: 6,
      borderRadius: 10, opacity: vis, boxShadow: `0 0 24px ${palette.gold}55`} as React.CSSProperties} />
  );
  return <>{corner(-1, -1)}{corner(1, -1)}{corner(-1, 1)}{corner(1, 1)}</>;
};

// Hub-and-spoke diagram: lines draw from the hub to each node, nodes pop at the line ends.
export const NodeGraph: React.FC<{at: number; hub: {x: number; y: number}; nodes: {x: number; y: number; el: React.ReactNode}[];
  hubEl: React.ReactNode}> = ({at, hub, nodes, hubEl}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {nodes.map((n, i) => {
          const p = ease(clamp((f - at - 10 - i * 10) / 18));
          return <line key={i} x1={hub.x} y1={hub.y} x2={hub.x + (n.x - hub.x) * p} y2={hub.y + (n.y - hub.y) * p}
            stroke={palette.gold} strokeOpacity={0.55} strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" />;
        })}
      </svg>
      {nodes.map((n, i) => {
        const s = spring({frame: f - at - 22 - i * 10, fps, config: {damping: 12, stiffness: 160}});
        return <div key={i} style={{position: 'absolute', left: n.x, top: n.y, transform: `translate(-50%,-50%) scale(${s})`, opacity: clamp(s * 2)}}>{n.el}</div>;
      })}
      <div style={{position: 'absolute', left: hub.x, top: hub.y, transform: `translate(-50%,-50%) scale(${spring({frame: f - at, fps, config: {damping: 14}})})`}}>{hubEl}</div>
    </>
  );
};

// A curve that draws itself, with a dot riding its head (used for the discount: price going down).
export const Curve: React.FC<{at: number; w: number; h: number; dur?: number}> = ({at, w, h, dur = 40}) => {
  const f = useCurrentFrame();
  const p = ease(clamp((f - at) / dur));
  const d = `M 40 ${h * 0.22} C ${w * 0.38} ${h * 0.2}, ${w * 0.5} ${h * 0.82}, ${w - 40} ${h * 0.8}`;
  // point along the same cubic for the dot
  const bez = (t: number) => {
    const P = [[40, h * 0.22], [w * 0.38, h * 0.2], [w * 0.5, h * 0.82], [w - 40, h * 0.8]];
    const u = 1 - t;
    return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]);
  };
  const [x, y] = bez(p);
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
      <path d={d} fill="none" stroke={palette.gold} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <circle cx={x} cy={y} r={16} fill={palette.gold} opacity={p > 0 ? 1 : 0} />
      <circle cx={x} cy={y} r={34} fill={palette.gold} opacity={p > 0 ? 0.18 : 0} />
    </svg>
  );
};

export const Logo: React.FC<{w: number; style?: React.CSSProperties}> = ({w, style}) => <Img src={staticFile('logo.png')} style={{width: w, ...style}} />;

export const Chip: React.FC<{children: React.ReactNode; gold?: boolean; size?: number}> = ({children, gold, size = 46}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 34px', borderRadius: 999, direction: 'rtl',
    background: gold ? palette.gold : 'rgba(255,255,255,0.05)', border: `2px solid ${gold ? palette.gold : palette.gold + '88'}`,
    color: gold ? '#000' : palette.white, fontFamily: font.family, fontWeight: 900, fontSize: size, whiteSpace: 'nowrap',
    boxShadow: gold ? `0 0 40px ${palette.gold}66` : 'none'}}>{children}</div>
);

export {interpolate};
