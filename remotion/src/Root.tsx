import React from 'react';
import {Composition} from 'remotion';
import {Reel, ReelProps, reelFrames} from './Reel';
import {StyleSample} from './StyleSample';
import {AppPromo, APP_PROMO_FRAMES} from './AppPromo';
import {StudioPromo, STUDIO_PROMO_FRAMES} from './studio/StudioPromo';
import {OfferPromo, OFFER_FRAMES} from './offer/OfferPromo';
import {ShopPromo, SHOP_FRAMES} from './offer/ShopPromo';
import {ConvReel, CONV_FRAMES} from './conv/ConvReel';
import {ConvReel2, CONV2_FRAMES} from './conv/ConvReel2';
import {StyleFrame as ExplainerStyle} from './explainer/StyleFrame';
import {Explainer, EXPLAINER_FRAMES} from './explainer/Explainer';
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
    <Composition id="ConvReel" component={ConvReel} width={1080} height={1920} fps={30}
      durationInFrames={CONV_FRAMES} />
    <Composition id="ConvReel2" component={ConvReel2} width={1080} height={1920} fps={30}
      durationInFrames={CONV2_FRAMES} />
    <Composition id="Explainer" component={Explainer} width={1080} height={1920} fps={30} durationInFrames={EXPLAINER_FRAMES} />
    <Composition id="ExplainerStyle" component={ExplainerStyle} width={1080} height={1920} fps={30} durationInFrames={60} />
    <Composition id="StyleSample" component={StyleSample} width={1080} height={1920} fps={30}
      durationInFrames={195} />
  </>
);
