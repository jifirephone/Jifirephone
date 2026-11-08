// Style frame for the Ji Fire explainer: cartoonised real storefront (OpenCV, brand/storefront.jpg) + our own character
// + a pop-up sign + a word caption, to approve the look before building the whole film.
import React from 'react';
import {AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color, font} from '../brand';
import {Person} from './Toon';

const gold = color.gold;

export const Sign: React.FC<{lines: string[]; goldLine?: number; tilt?: number; s: number; w?: number}> = ({lines, goldLine, tilt = -3, s, w = 640}) => (
  <div style={{width: w, padding: '26px 30px', background: '#FFF7E3', border: '10px solid #3b2a1c', borderRadius: 18, direction: 'rtl', textAlign: 'center',
    boxShadow: '0 18px 0 rgba(0,0,0,0.25)', transform: `rotate(${tilt}deg) scale(${0.4 + 0.6 * s})`, opacity: Math.min(1, s * 2)}}>
    {lines.map((l, i) => (
      <div key={i} style={{fontFamily: font.family, fontWeight: 900, fontSize: 84, lineHeight: 1.15, color: i === goldLine ? '#000' : '#c0392b',
        background: i === goldLine ? gold : 'transparent', borderRadius: 14, padding: i === goldLine ? '0 16px' : 0, marginTop: i ? 8 : 0}}>{l}</div>
    ))}
  </div>
);

export const Caption: React.FC<{word: string}> = ({word}) => (
  <div style={{position: 'absolute', top: 1300, left: 64, right: 230, textAlign: 'center', direction: 'rtl', fontFamily: font.family, fontWeight: 900,
    fontSize: 96, color: '#fff', WebkitTextStroke: '10px #000', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>{word}</div>
);

export const StyleFrame: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 4, fps, config: {damping: 11, stiffness: 160}});
  return (
    <AbsoluteFill style={{background: '#0b0d1a', overflow: 'hidden'}}>
      {/* storefront 1280x960 -> cover 1920 high, centred on the Ji Fire door */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #070a1c 0%, #121a3a 40%, #1b1f33 60%)'}} />
      {[...Array(40)].map((_, i) => <div key={i} style={{position: 'absolute', left: (i * 263) % 1080, top: 40 + ((i * 97) % 380), width: 4, height: 4,
        borderRadius: 2, background: '#fff', opacity: 0.3 + 0.5 * Math.abs(Math.sin(f / 12 + i))}} />)}
      {/* street */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1420, bottom: 0, background: 'linear-gradient(180deg,#5b5450,#3a3431)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1600, height: 14, background: 'repeating-linear-gradient(90deg,#e8e0c8 0 90px,transparent 90px 170px)', opacity: 0.6}} />
      {/* real storefront, cartoonised: 1280x960 -> 1500x1125, centred on the Ji Fire sign */}
      <Img src={staticFile('explainer/store_toon.jpg')} style={{position: 'absolute', width: 1500, height: 1125, left: -260 - f * 0.4, top: 330,
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 8%, #000 90%, transparent 100%)'}} />
      <div style={{position: 'absolute', top: 240, left: 64, right: 230, display: 'flex', justifyContent: 'center'}}>
        <Sign s={s} w={700} lines={['أقساط • نقد', 'توصيل للبيت']} goldLine={1} />
      </div>
      <div style={{position: 'absolute', left: 560, top: 1010}}><Person mood="happy" phone mouth={0.4} wave={18} scale={1.0} /></div>
      <Caption word="بالقسط" />
    </AbsoluteFill>
  );
};
