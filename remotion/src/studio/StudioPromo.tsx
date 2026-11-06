// Ji Fire app promo v3, built with the motion studio (Kit.tsx). Owner's copy, Ji Fire black + gold.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Icon, ICON} from '../AppPromo';
import {Backdrop, Brackets, Chip, clamp, Curve, Headline, Line, Logo, NodeGraph, palette, Panel, Place, T, Vignette, World} from './Kit';

export const STUDIO_PROMO_FRAMES = 1140; // 38 s

const LINES: Line[] = [
  {from: 6, to: 110, text: 'تريد جهاز بالأقساط؟', accent: ['بالأقساط؟']},
  {from: 132, to: 200, text: 'بدون مقدمة', accent: ['بدون']},
  {from: 202, to: 255, text: 'ضمان سنة', accent: ['سنة']},
  {from: 257, to: 312, text: 'يوصلك لباب البيت', accent: ['البيت']},
  {from: 348, to: 400, text: 'توصيل مجاني', accent: ['مجاني']},
  {from: 402, to: 470, text: 'وخصم 25 الف', accent: ['25', 'الف']},
  {from: 504, to: 562, text: 'لكيتلك الحل', accent: ['الحل']},
  {from: 564, to: 650, text: 'حمّل تطبيق جي فاير', accent: ['جي', 'فاير']},
  {from: 684, to: 830, text: 'اشتري اللي يناسبك', accent: ['يناسبك']},
  {from: 864, to: 926, text: 'ضمان حقيقي', accent: ['حقيقي']},
  {from: 964, to: 1046, text: 'يلا شمنتظر؟', accent: ['شمنتظر؟']},
];

const Phone: React.FC<{at: number; scale?: number}> = ({at, scale = 1}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 16, stiffness: 80}});
  return (
    <div style={{width: 380 * scale, height: 780 * scale, borderRadius: 64 * scale, background: 'linear-gradient(160deg,#1c1a1f,#060507)',
      border: `5px solid ${palette.gold}aa`, boxShadow: `0 50px 120px rgba(0,0,0,0.8), 0 0 70px ${palette.gold}26`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
      transform: `rotateY(${Math.sin(f / 45) * 12 + (1 - s) * 40}deg) rotateX(${(1 - s) * 20}deg) translateY(${(1 - s) * 200}px)`,
      opacity: clamp(s * 1.5), filter: `blur(${(1 - s) * 10}px)`}}>
      <div style={{position: 'absolute', top: 20 * scale, width: 110 * scale, height: 28 * scale, borderRadius: 20, background: '#000'}} />
      <Logo w={260 * scale} />
      <div style={{position: 'absolute', top: -300, left: ((f * 7) % 900) - 300, width: 110, height: 1400, transform: 'rotate(20deg)',
        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.09),transparent)'}} />
    </div>
  );
};

const StoreChips: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', gap: 22, direction: 'ltr', justifyContent: 'center'}}>
      {['Google Play', 'App Store'].map((s, i) => {
        const p = spring({frame: f - at - i * 8, fps, config: {damping: 13, stiffness: 150}});
        return (
          <div key={s} style={{opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 60}px) scale(${0.85 + 0.15 * p})`}}>
            <Chip size={40}><span style={{fontSize: 34}}>{i === 0 ? '▶' : '⬇'}</span><span dir="ltr">{s}</span></Chip>
          </div>
        );
      })}
    </div>
  );
};

// ---- scenes (positions match promo_camera.json) ----

const SHook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chip = spring({frame: f - 60, fps, config: {damping: 13, stiffness: 150}});
  return (
    <Place x={0} y={0}>
      <div style={{position: 'absolute', left: 350, top: 560, transformStyle: 'preserve-3d'}}><Phone at={4} /></div>
      <div style={{position: 'absolute', top: 1320, left: 0, width: 1080, display: 'flex', justifyContent: 'center',
        opacity: clamp(chip * 2), transform: `scale(${0.7 + 0.3 * chip})`, filter: `blur(${(1 - chip) * 8}px)`}}>
        <Chip size={64}><Icon f={f} delay={60} size={70} d={ICON.house} /> وانت ببيتك؟</Chip>
      </div>
    </Place>
  );
};

const SOffers: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    {at: 132, icon: ICON.download, t: 'بدون مقدمة', s: 'تاخذ جهازك وتقسّط'},
    {at: 202, icon: ICON.shield, t: 'ضمان سنة', s: 'ضمان حقيقي'},
    {at: 257, icon: ICON.box, t: 'يوصلك لباب البيت', s: 'وانت ببيتك'},
  ];
  return (
    <Place x={1400} y={0}>
      {rows.map((r, i) => {
        const active = f >= r.at && (i === rows.length - 1 || f < rows[i + 1].at);
        return (
          <Panel key={i} at={r.at} x={110} y={560 + i * 280} w={860} h={240} active={active} from={i % 2 ? 'left' : 'right'}>
            <div style={{display: 'flex', alignItems: 'center', gap: 40, height: '100%', padding: '0 50px', direction: 'rtl'}}>
              <div style={{width: 140, height: 140, borderRadius: 32, background: `${palette.gold}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon f={f} delay={r.at + 6} size={96} d={r.icon} />
              </div>
              <div>
                <T size={62} style={{whiteSpace: 'nowrap'}}>{r.t}</T>
                <T size={40} c={active ? palette.gold : palette.dim} w={700}>{r.s}</T>
              </div>
            </div>
          </Panel>
        );
      })}
    </Place>
  );
};

const SDiscount: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [410, 446], [0, 25], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <Place x={1400} y={2300}>
      <Panel at={350} x={110} y={540} w={860} h={210} from="right">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '0 56px', direction: 'rtl'}}>
          <T size={74}>توصيل</T>
          <Chip gold size={64}>مجاني</Chip>
        </div>
      </Panel>
      <Panel at={402} x={110} y={800} w={860} h={560} from="below">
        <div style={{position: 'absolute', top: 40, right: 50}}><T size={40} c={palette.dim} w={700}>السعر</T></div>
        <div style={{position: 'absolute', left: 0, top: 70}}><Curve at={410} w={860} h={430} /></div>
        <div style={{position: 'absolute', left: 50, bottom: 34, display: 'flex', alignItems: 'baseline', gap: 18, direction: 'rtl'}}>
          <T size={46} c={palette.white}>خصم</T>
          <span style={{fontFamily: 'Cairo', fontWeight: 900, fontSize: 130, color: palette.gold, textShadow: `0 0 40px ${palette.gold}66`, direction: 'ltr'}}>{n}</span>
          <T size={56}>الف</T>
        </div>
      </Panel>
    </Place>
  );
};

const SApp: React.FC = () => (
  <Place x={0} y={2300}>
    <div style={{position: 'absolute', left: 350, top: 540}}><Phone at={480} /></div>
    <Brackets at={494} cx={540} cy={930} w={420} h={820} />
    <div style={{position: 'absolute', top: 1340, left: 0, width: 1080}}><StoreChips at={578} /></div>
  </Place>
);

const SCats: React.FC = () => {
  const f = useCurrentFrame();
  const node = (t: string, icon: string[], k: number) => (
    <div style={{width: 340, height: 250, borderRadius: 36, background: `linear-gradient(160deg, ${palette.panel}, #0E0D10)`,
      border: `2px solid ${palette.gold}77`, boxShadow: '0 30px 70px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 14}}>
      <Icon f={f} delay={712 + k * 10} size={110} d={icon} />
      <T size={46} style={{whiteSpace: 'nowrap'}}>{t}</T>
    </div>
  );
  return (
    <Place x={-1400} y={2300}>
      <NodeGraph at={690} hub={{x: 540, y: 930}}
        hubEl={<div style={{width: 230, height: 230, borderRadius: 999, background: '#0E0D10', border: `3px solid ${palette.gold}`,
          boxShadow: `0 0 60px ${palette.gold}44`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Logo w={170} /></div>}
        nodes={[
          {x: 280, y: 610, el: node('هواتف جديدة', ICON.phone, 0)},
          {x: 800, y: 610, el: node('مستعمل اكو', ICON.used, 1)},
          {x: 280, y: 1260, el: node('حاسبات', ICON.laptop, 2)},
          {x: 800, y: 1260, el: node('اكسسوارات', ICON.phones, 3)},
        ]} />
    </Place>
  );
};

const SWarranty: React.FC = () => {
  const f = useCurrentFrame();
  const line = clamp((f - 890) / 20);
  return (
    <Place x={-1400} y={0}>
      <Panel at={864} x={150} y={560} w={780} h={760} from="below" radius={48}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
          <span style={{fontFamily: 'Cairo', fontWeight: 900, fontSize: 300, lineHeight: 1, color: palette.gold, textShadow: `0 0 60px ${palette.gold}55`}}>1</span>
          <T size={96}>سنة ضمان</T>
          <div style={{height: 10, width: 420 * line, background: palette.gold, borderRadius: 5, margin: '18px 0'}} />
          <T size={52} c={palette.dim} w={700}>ضمان حقيقي</T>
        </div>
      </Panel>
    </Place>
  );
};

const SCta: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - 990, fps, config: {damping: 12, stiffness: 140}});
  return (
    <Place x={0} y={-2300}>
      <div style={{position: 'absolute', top: 560, left: 0, width: 1080, display: 'flex', justifyContent: 'center'}}><Logo w={300} /></div>
      <div style={{position: 'absolute', top: 920, left: 0, width: 1080, display: 'flex', justifyContent: 'center',
        transform: `scale(${0.7 + 0.3 * p})`, opacity: clamp(p * 2)}}>
        <Chip gold size={84}>حمّل هسه واستفيد</Chip>
      </div>
      <div style={{position: 'absolute', top: 1110, left: 0, width: 1080, display: 'flex', justifyContent: 'center', opacity: clamp((f - 1005) / 10)}}>
        <Chip size={40}><span dir="ltr">app.jifrephone.workers.dev</span></Chip>
      </div>
      <div style={{position: 'absolute', top: 1260, left: 0, width: 1080}}><StoreChips at={1012} /></div>
    </Place>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = clamp((f - 1056) / 14);
  const s = spring({frame: f - 1062, fps, config: {damping: 16, stiffness: 100}});
  if (a <= 0) return null;
  return (
    <AbsoluteFill style={{background: `rgba(0,0,0,${a})`, alignItems: 'center', paddingTop: 520}}>
      <div style={{opacity: s, transform: `scale(${0.85 + 0.15 * s})`, filter: `blur(${(1 - s) * 10}px)`}}><Logo w={560} /></div>
      <div style={{marginTop: 50, opacity: clamp((f - 1080) / 12)}}><T size={66} w={800}>التقنية باعلى ذروتها</T></div>
      <div style={{marginTop: 60, opacity: clamp((f - 1090) / 12)}}><StoreChips at={1090} /></div>
    </AbsoluteFill>
  );
};

export const StudioPromo: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Backdrop />
    <World>
      <SHook /><SOffers /><SDiscount /><SApp /><SCats /><SWarranty /><SCta />
    </World>
    <Vignette />
    <Headline lines={LINES} />
    <EndCard />
  </AbsoluteFill>
);
