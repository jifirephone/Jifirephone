import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {color, font, safe} from '../brand';

export type Graphic = {start: number; end: number; label: string; value: string; sub?: string; kind?: 'stat' | 'price'};
export type Hook = {start: number; end: number; line1: string; line2: string};

const hasLatin = (s: string) => !/[\u0600-\u06FF]/.test(s);

// Fade/slide envelope for an element living between start..end (seconds).
const useEnvelope = (start: number, end: number) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = Math.round(start * fps);
  const e = Math.round(end * fps);
  const inP = spring({frame: f - s, fps, config: {damping: 15, stiffness: 200}, durationInFrames: 10});
  const out = interpolate(f, [e - 6, e], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return {visible: f >= s && f < e, inP, opacity: Math.min(inP, out)};
};

// One card per phrase: dark glass, gold edge, white label, gold value. Sits mid-left,
// below the product-in-hand zone and above the captions, so it never covers the face.
export const GraphicCard: React.FC<{g: Graphic}> = ({g}) => {
  const {visible, inP, opacity} = useEnvelope(g.start, g.end);
  if (!visible) return null;
  const price = g.kind === 'price';
  return (
    <div style={{
      position: 'absolute', left: safe.left, top: price ? 840 : 880, direction: 'rtl',
      fontFamily: font.family, opacity,
      transform: `translateX(${(1 - inP) * -60}px) scale(${0.92 + 0.08 * inP})`, transformOrigin: 'left center',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(18,14,22,0.78), rgba(0,0,0,0.62))',
        backdropFilter: 'blur(14px)', borderRadius: 28, padding: price ? '22px 40px 26px' : '18px 34px 22px',
        borderRight: `10px solid ${color.gold}`, boxShadow: `0 14px 40px rgba(0,0,0,0.55), inset 0 0 0 2px ${color.gold}33`,
        minWidth: 330, maxWidth: 560,
      }}>
        <div style={{color: color.white, fontSize: price ? 44 : 42, fontWeight: font.secondary, lineHeight: 1.25}}>
          <span dir={hasLatin(g.label) ? 'ltr' : 'rtl'} style={{unicodeBidi: 'isolate'}}>{g.label}</span>
        </div>
        <div style={{color: color.gold, fontSize: price ? 112 : 76, fontWeight: font.caption, lineHeight: 1.1,
          textShadow: `0 0 26px ${color.gold}55`}}>
          <span dir={hasLatin(g.value) ? 'ltr' : 'rtl'} style={{unicodeBidi: 'isolate'}}>{g.value}</span>
        </div>
        {g.sub ? (
          <div style={{color: color.silver, fontSize: 38, fontWeight: font.secondary, marginTop: 4}}>{g.sub}</div>
        ) : null}
      </div>
    </div>
  );
};

// Hook headline for the first seconds: top band with a dark gradient for legibility.
export const HookTitle: React.FC<{hook: Hook}> = ({hook}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {visible, opacity} = useEnvelope(hook.start, hook.end);
  if (!visible) return null;
  const l2 = spring({frame: f - Math.round((hook.start + 0.35) * fps), fps, config: {damping: 13, stiffness: 190}});
  return (
    <AbsoluteFill style={{opacity}}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 640,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0) 100%)'}} />
      <div style={{position: 'absolute', top: safe.top, left: safe.left, right: safe.left, direction: 'rtl',
        textAlign: 'center', fontFamily: font.family, fontWeight: font.caption}}>
        <div style={{color: color.white, fontSize: 50, lineHeight: 1.25, whiteSpace: 'nowrap', textShadow: '0 5px 0 rgba(0,0,0,0.85), 0 10px 22px rgba(0,0,0,0.7)'}}>
          {hook.line1}
        </div>
        <div style={{color: color.gold, fontSize: 60, lineHeight: 1.3, whiteSpace: 'nowrap', marginTop: 6, opacity: Math.min(1, l2),
          transform: `scale(${0.85 + 0.15 * Math.min(1, l2)})`,
          textShadow: '0 5px 0 rgba(0,0,0,0.85), 0 0 30px rgba(243,180,6,0.35)'}}>
          {hook.line2}
        </div>
      </div>
    </AbsoluteFill>
  );
};
