// Ji Fire for Mobile design tokens. Source of truth: /design-system.md
// Values measured from refs/ref1.mov (the brand's own reel) unless noted.

export const color = {
  gold: '#F3B406', // logo gold, measured
  goldDeep: '#C98F00', // gold shade for gradients/edges
  silver: '#DCDCDC', // logo swoosh, measured
  white: '#FFFFFF',
  black: '#000000',
  backdrop: '#5B5065', // lit part of the purple-grey studio wall, measured
  backdropDark: '#060407', // vignette corners, measured
} as const;

export const font = {
  family: 'Cairo',
  caption: 900,
  secondary: 800,
  body: 600,
} as const;

// 1080x1920 canvas. Safe zone keeps text clear of Instagram/TikTok UI.
// Instagram UI: header above y=230, caption/audio strip below y=1440, action rail on the right 230 px.
// (Raised from 220/400/150 on 2026-11-06, following the ig-reel safe-zone rule; the owner delegated the call.)
export const safe = {top: 230, bottom: 480, left: 64, right: 230} as const;

export const caption = {
  fontSize: 90,
  lineHeight: 1.18,
  maxWordsPerLine: 3,
  maxCharsPerLine: 14, // ~13 Cairo-900 chars at 90px fit the 786px between the safe margins
  maxLines: 2,
  // Lower-right block, right-aligned (RTL), as in the reference reel.
  bottomY: 1920 - safe.bottom - 12, // bottom of last line incl. descenders
  right: safe.right,
  maxWidth: 1080 - safe.right - safe.left - 140, // leaves the face/centre free
  shadow: '0 5px 0 rgba(0,0,0,0.85), 0 10px 22px rgba(0,0,0,0.75)',
  stroke: '3px rgba(0,0,0,0.9)',
  revealFrames: 5, // per-word pop-in (30 fps)
} as const;

export const logoBug = {
  width: 210, // ~15% of frame width, as in the reference
  top: 230,
  right: 64,
} as const;

export const endCard = {
  tagline: 'التقنية باعلى ذروتها',
  keyword: 'السعر',
  logoWidth: 620,
  durationSec: 3.5,
} as const;

export const audio = {integratedLufs: -14, truePeakDb: -1, musicUnderVoiceDb: -20} as const;
