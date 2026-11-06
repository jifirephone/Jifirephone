import {continueRender, delayRender, staticFile} from 'remotion';

const files = [
  {file: 'fonts/cairo-arabic.woff2', range: 'U+0600-06FF, U+0750-077F, U+08A0-08FF, U+200C-200E, U+FB50-FDFF, U+FE70-FEFC'},
  {file: 'fonts/cairo-latin.woff2', range: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2212'},
  {file: 'fonts/cairo-latin-ext.woff2', range: 'U+0100-02AF, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF'},
];

let started = false;
export const loadBrandFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Loading Cairo');
  Promise.all(
    files.map((f) => {
      const face = new FontFace('Cairo', `url(${staticFile(f.file)}) format('woff2')`, {
        weight: '200 1000',
        unicodeRange: f.range,
      });
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
