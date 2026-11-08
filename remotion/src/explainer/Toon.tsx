// Original cartoon cast for the Ji Fire explainer (2026-11-08). Drawn in SVG, our own design:
// round head, big eyes, simple body, Ji Fire black-and-gold outfit. Technique from the owner's reference,
// never its characters or art.
import React from 'react';

export type Mood = 'smile' | 'worried' | 'happy' | 'talk' | 'wow';

// Haidar: young man, short black hair, light stubble, black hoodie with a gold stripe.
export const Person: React.FC<{mood?: Mood; blink?: boolean; mouth?: number; shirt?: string; hair?: string; skin?: string;
  phone?: boolean; wave?: number; scale?: number}> = ({mood = 'smile', blink, mouth = 0, shirt = '#141216', hair = '#1b1412',
  skin = '#E6B48C', phone, wave = 0, scale = 1}) => {
  const ink = '#2a1c14';
  const eyeH = blink ? 1.5 : mood === 'wow' ? 15 : 12;
  const brow = mood === 'worried' ? 'M128 118 Q148 108 166 116 M234 116 Q252 108 272 118' : mood === 'wow' ? 'M128 104 Q148 92 166 102 M234 102 Q252 92 272 104'
    : 'M128 112 Q148 104 166 110 M234 110 Q252 104 272 112';
  const m = clamp01(mouth);
  const mouthPath = mood === 'worried' ? `M178 214 Q200 ${204 - m * 4} 222 214` : mood === 'wow' ? '' : `M172 206 Q200 ${226 + m * 10} 228 206`;
  return (
    <svg width={400 * scale} height={760 * scale} viewBox="0 0 400 760" style={{overflow: 'visible'}}>
      {/* body */}
      <path d="M90 470 Q90 330 200 322 Q310 330 310 470 L318 740 L82 740 Z" fill={shirt} stroke={ink} strokeWidth={6} />
      <path d="M200 330 L200 740" stroke="#F3B406" strokeWidth={10} />
      <path d="M150 335 Q200 380 250 335" fill="none" stroke="#F3B406" strokeWidth={6} />
      {/* arms */}
      <g transform={`rotate(${-wave} 300 380)`}>
        <path d="M300 380 Q350 470 330 560" fill="none" stroke={shirt} strokeWidth={46} strokeLinecap="round" />
        <circle cx={330} cy={566} r={26} fill={skin} stroke={ink} strokeWidth={5} />
      </g>
      <path d="M100 380 Q60 470 120 540" fill="none" stroke={shirt} strokeWidth={46} strokeLinecap="round" />
      <circle cx={128} cy={544} r={26} fill={skin} stroke={ink} strokeWidth={5} />
      {phone ? <g transform="translate(118 470) rotate(-12)"><rect x={0} y={0} width={56} height={104} rx={12} fill="#0d0d10" stroke="#cfcfd4" strokeWidth={4} />
        <rect x={6} y={10} width={44} height={82} rx={6} fill="#F3B406" opacity={0.85} /></g> : null}
      {/* neck + head */}
      <rect x={176} y={280} width={48} height={50} fill={skin} stroke={ink} strokeWidth={5} />
      <ellipse cx={200} cy={170} rx={122} ry={130} fill={skin} stroke={ink} strokeWidth={6} />
      <ellipse cx={80} cy={180} rx={16} ry={26} fill={skin} stroke={ink} strokeWidth={5} />
      <ellipse cx={320} cy={180} rx={16} ry={26} fill={skin} stroke={ink} strokeWidth={5} />
      {/* stubble */}
      <path d="M100 200 Q110 290 200 300 Q290 290 300 200 Q280 260 200 268 Q120 260 100 200 Z" fill="#7a5a48" opacity={0.28} />
      {/* hair */}
      <path d="M82 150 Q80 40 200 36 Q322 40 318 150 Q300 92 250 86 Q210 100 160 84 Q110 96 82 150 Z" fill={hair} stroke={ink} strokeWidth={5} />
      {/* eyes */}
      <ellipse cx={150} cy={150} rx={13} ry={eyeH} fill={ink} />
      <ellipse cx={250} cy={150} rx={13} ry={eyeH} fill={ink} />
      {!blink ? <><circle cx={154} cy={145} r={4} fill="#fff" /><circle cx={254} cy={145} r={4} fill="#fff" /></> : null}
      <path d={brow} fill="none" stroke={hair} strokeWidth={9} strokeLinecap="round" />
      {/* nose */}
      <path d="M200 160 Q192 190 204 192" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />
      {/* mouth */}
      {mood === 'wow' ? <ellipse cx={200} cy={222} rx={18} ry={14 + m * 8} fill="#5a1c1c" stroke={ink} strokeWidth={5} />
        : <path d={mouthPath} fill={mood === 'happy' || m > 0.3 ? '#5a1c1c' : 'none'} stroke={ink} strokeWidth={6} strokeLinecap="round" />}
    </svg>
  );
};

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
