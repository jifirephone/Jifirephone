import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color, endCard, font, logoBug} from '../brand';

export const LogoBug: React.FC = () => (
  <Img
    src={staticFile('logo.png')}
    style={{position: 'absolute', top: logoBug.top, right: logoBug.right, width: logoBug.width,
      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))'}}
  />
);

// Black end card: logo, tagline, and the comment call-to-action with the keyword.
export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logoIn = spring({frame: f, fps, config: {damping: 16}});
  const tagIn = interpolate(f, [12, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ctaIn = spring({frame: f - 22, fps, config: {damping: 12, stiffness: 180}});
  return (
    <AbsoluteFill style={{background: color.black, alignItems: 'center', fontFamily: font.family, direction: 'rtl'}}>
      <Img src={staticFile('logo.png')}
        style={{marginTop: 360, width: endCard.logoWidth, opacity: logoIn, transform: `scale(${0.9 + 0.1 * logoIn})`}} />
      <div style={{marginTop: 70, color: color.white, fontSize: 64, fontWeight: font.secondary, opacity: tagIn}}>
        {endCard.tagline}
      </div>
      <div style={{marginTop: 120, display: 'flex', alignItems: 'center', gap: 22, opacity: Math.min(1, ctaIn),
        transform: `scale(${0.8 + 0.2 * ctaIn})`}}>
        <span style={{color: color.white, fontSize: 70, fontWeight: font.caption}}>اكتب</span>
        <span style={{background: color.gold, color: color.black, fontSize: 84, fontWeight: font.caption,
          padding: '0 42px', borderRadius: 26, boxShadow: `0 0 40px ${color.gold}66`}}>
          {endCard.keyword}
        </span>
        <span style={{color: color.white, fontSize: 70, fontWeight: font.caption}}>بالتعليقات</span>
      </div>
    </AbsoluteFill>
  );
};
