import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import {StyleSample} from './StyleSample';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// 1080x1920 vertical reel. Real duration/props are injected per clip at render time.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} width={1080} height={1920} fps={30}
      durationInFrames={90} defaultProps={{title: 'جي فاير للموبايل'}} />
    <Composition id="StyleSample" component={StyleSample} width={1080} height={1920} fps={30}
      durationInFrames={195} />
  </>
);
