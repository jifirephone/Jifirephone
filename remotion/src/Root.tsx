import React from 'react';
import {Composition} from 'remotion';
import {Reel, ReelProps, reelFrames} from './Reel';
import {StyleSample} from './StyleSample';
import {RepairReel, RepairProps, repairFrames} from './RepairReel';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

const repairDefaults: RepairProps = {video: '', shots: [], xfade: 0.4, revealShot: -1, words: [], hook: null, musicFadeSec: 1};
const defaults: ReelProps = {video: '', duration: 3, words: [], graphics: [], hook: null};

// 1080x1920 vertical reel. Props (plan.json) are passed with --props at render time.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} width={1080} height={1920} fps={30}
      durationInFrames={reelFrames(defaults)} defaultProps={defaults}
      calculateMetadata={({props}) => ({durationInFrames: reelFrames(props)})} />
    <Composition id="StyleSample" component={StyleSample} width={1080} height={1920} fps={30}
      durationInFrames={195} />
    <Composition id="RepairReel" component={RepairReel} width={1080} height={1920} fps={30}
      durationInFrames={repairFrames(repairDefaults)} defaultProps={repairDefaults}
      calculateMetadata={({props}) => ({durationInFrames: repairFrames(props)})} />
  </>
);
