import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

// Placeholder smoke-test composition. Real captions/graphics come in step 3.
export const Reel: React.FC<{title: string}> = ({title}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{opacity: o, color: '#fff', fontSize: 90, fontWeight: 900, direction: 'rtl',
        textShadow: '0 6px 18px #000', borderBottom: '8px solid #D4AF37', padding: 20}}>
        {title}
      </div>
    </AbsoluteFill>
  );
};
