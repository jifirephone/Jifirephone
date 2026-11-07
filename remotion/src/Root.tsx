import React from 'react';
import {Composition} from 'remotion';
import {Reel, ReelProps, reelFrames} from './Reel';
import {StyleSample} from './StyleSample';
import {AppPromo, APP_PROMO_FRAMES} from './AppPromo';
import {StudioPromo, STUDIO_PROMO_FRAMES} from './studio/StudioPromo';
import {OfferPromo, OFFER_FRAMES} from './offer/OfferPromo';
import {ShopPromo, SHOP_FRAMES} from './offer/ShopPromo';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

const defaults: ReelProps = {video: '', duration: 3, words: [], graphics: [], hook: null};

// 1080x1920 vertical reel. Props (plan.json) are passed with --props at render time.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} width={1080} height={1920} fps={30}
      durationInFrames={reelFrames(defaults)} defaultProps={defaults}
      calculateMetadata={({props}) => ({durationInFrames: reelFrames(props)})} />
    <Composition id="AppPromo" component={AppPromo} width={1080} height={1920} fps={30}
      durationInFrames={APP_PROMO_FRAMES} />
    <Composition id="StudioPromo" component={StudioPromo} width={1080} height={1920} fps={30}
      durationInFrames={STUDIO_PROMO_FRAMES} />
    <Composition id="OfferPromo" component={OfferPromo} width={1080} height={1920} fps={30}
      durationInFrames={OFFER_FRAMES} />
    <Composition id="ShopPromo" component={ShopPromo} width={1080} height={1920} fps={30}
      durationInFrames={SHOP_FRAMES} />
    <Composition id="StyleSample" component={StyleSample} width={1080} height={1920} fps={30}
      durationInFrames={195} />
  </>
);
