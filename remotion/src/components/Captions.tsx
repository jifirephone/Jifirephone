import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {caption, color, font} from '../brand';

export type Word = {text: string; start: number; end: number; keyword?: boolean; phrase?: number};

// Word-by-word Arabic captions. Words appear as they are spoken; the word being
// spoken (and any keyword) is gold, everything else white. Latin words keep LTR.
const isLatin = (s: string) => /[A-Za-z0-9]/.test(s);

export const Captions: React.FC<{words: Word[]}> = ({words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const spoken = words.filter((w) => w.start <= t);
  if (spoken.length === 0) return null;
  // Only the phrase being spoken is on screen; a new phrase clears the block.
  const current = spoken[spoken.length - 1].phrase;
  const shown = current === undefined ? spoken : spoken.filter((w) => w.phrase === current);

  const lines: Word[][] = [];
  shown.forEach((w) => {
    const last = lines[lines.length - 1];
    const chars = last ? last.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length : 0;
    if (!last || last.length >= caption.maxWordsPerLine || chars > caption.maxCharsPerLine) lines.push([w]);
    else last.push(w);
  });
  const visible = lines.slice(-caption.maxLines);

  const renderWord = (w: Word, j: number) => {
    const age = frame - Math.round(w.start * fps);
    const pop = spring({frame: age, fps, config: {damping: 14, stiffness: 220}, durationInFrames: caption.revealFrames * 2});
    const active = t >= w.start && t < w.end + 0.08;
    return (
      <span
        key={j}
        style={{
          display: 'inline-block',
          marginInlineStart: j === 0 ? 0 : '0.28em',
          color: active || w.keyword ? color.gold : color.white,
          WebkitTextStroke: caption.stroke,
          paintOrder: 'stroke fill',
          textShadow: caption.shadow,
          opacity: interpolate(age, [0, caption.revealFrames], [0, 1], {extrapolateRight: 'clamp'}),
          transform: `translateY(${(1 - pop) * 28}px) scale(${0.85 + pop * 0.15 + (active ? 0.04 : 0)})`,
        }}
      >
        {w.text}
      </span>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: caption.right,
        bottom: 1920 - caption.bottomY,
        maxWidth: caption.maxWidth,
        direction: 'rtl',
        textAlign: 'right',
        fontFamily: font.family,
        fontWeight: font.caption,
        fontSize: caption.fontSize,
        lineHeight: caption.lineHeight,
      }}
    >
      {visible.map((line, i) => {
        // Group consecutive English/number words into one LTR run so "iPhone 16 Pro" keeps its order.
        const runs: {latin: boolean; words: Word[]}[] = [];
        line.forEach((w) => {
          const latin = isLatin(w.text);
          const last = runs[runs.length - 1];
          if (last && last.latin === latin && latin) last.words.push(w);
          else runs.push({latin, words: [w]});
        });
        return (
          <div key={i} style={{whiteSpace: 'nowrap'}}>
            {runs.map((run, r) => (
              <span key={r} dir={run.latin ? 'ltr' : 'rtl'}
                style={{display: 'inline-block', unicodeBidi: 'isolate', marginInlineStart: r === 0 ? 0 : '0.28em'}}>
                {run.words.map((w, j) => renderWord(w, j))}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
