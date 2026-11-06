import React from 'react';
import {Composition} from 'remotion';
import {Reel, ReelProps, reelFrames} from './Reel';
import {StyleSample} from './StyleSample';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

const defaults: ReelProps = {video: '', duration: 3, words: [], graphics: [], hook: null};

// 1080x1920 vertical reel. Props (plan.json) are passed with --props at render time.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} width={1080} height={1920} fps={30}
      durationInFrames={reelFrames(defaults)} defaultProps={defaults}
      calculateMetadata={({props}) => ({durationInFrames: reelFrames(props)})} />
    <Composition id="StyleSample" component={StyleSample} width={1080} height={1920} fps={30}
      durationInFrames={195} />
  </>
);
