import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions, Word} from './components/Captions';
import {EndCard, LogoBug} from './components/Brand';
import {Graphic, GraphicCard, Hook, HookTitle} from './components/Graphics';
import {endCard} from './brand';

export type ReelProps = {
  video: string; // path under public/
  duration: number; // seconds of edited talking footage
  words: Word[];
  graphics: Graphic[];
  hook: Hook | null;
};

export const reelFrames = (p: ReelProps, fps = 30) => Math.round((p.duration + endCard.durationSec) * fps);

// Soft vignette that matches the low-key reference grade.
const Vignette: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 60% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)'}} />
);

const Bug: React.FC<{after: number}> = ({after}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const o = interpolate(f, [after * fps, after * fps + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}><LogoBug /></AbsoluteFill>;
};

export const Reel: React.FC<ReelProps> = (p) => {
  const {fps} = useVideoConfig();
  const talk = Math.round(p.duration * fps);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence durationInFrames={talk}>
        {p.video ? <OffthreadVideo src={staticFile(p.video)} muted style={{width: 1080, height: 1920}} /> : null}
        <Vignette />
        <Bug after={p.hook ? p.hook.end : 0} />
        {p.graphics.map((g, i) => <GraphicCard key={i} g={g} />)}
        <Captions words={p.words} />
        {p.hook ? <HookTitle hook={p.hook} /> : null}
      </Sequence>
      <Sequence from={talk}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
