import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile} from 'remotion';
import {Captions, Word} from './components/Captions';
import {EndCard, LogoBug} from './components/Brand';

// Design-system preview: a still from the reference reel with captions, logo bug and end card.
const words: Word[] = [
  {text: 'iPhone', start: 0.2, end: 0.6},
  {text: '16', start: 0.6, end: 0.9},
  {text: 'Pro', start: 0.9, end: 1.2},
  {text: 'بسعر', start: 1.3, end: 1.7},
  {text: 'مايتعوّض', start: 1.7, end: 2.4, keyword: true},
];

export const StyleSample: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Sequence durationInFrames={90}>
      <Img src={staticFile('sample-bg.jpg')} style={{width: 1080, height: 1920}} />
      <LogoBug />
      <Captions words={words} />
    </Sequence>
    <Sequence from={90}>
      <EndCard />
    </Sequence>
  </AbsoluteFill>
);
