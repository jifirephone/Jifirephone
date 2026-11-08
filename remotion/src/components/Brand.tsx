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

// Black end card: logo and tagline. (No «اكتب السعر بالتعليقات»: the owner never uses it, 2026-11-08.)
export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logoIn = spring({frame: f, fps, config: {damping: 16}});
  const tagIn = interpolate(f, [12, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: color.black, alignItems: 'center', fontFamily: font.family, direction: 'rtl'}}>
      <Img src={staticFile('logo.png')}
        style={{marginTop: 520, width: endCard.logoWidth, opacity: logoIn, transform: `scale(${0.9 + 0.1 * logoIn})`}} />
      <div style={{marginTop: 70, color: color.white, fontSize: 64, fontWeight: font.secondary, opacity: tagIn}}>
        {endCard.tagline}
      </div>
    </AbsoluteFill>
  );
};
