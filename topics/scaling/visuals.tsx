import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Headline} from '../../src/engine/components/Headline';
import {HorizontalFleet} from '../../src/engine/components/HorizontalFleet';
import {ServerSVG} from '../../src/engine/components/ServerSVG';
import {VerticalServer} from '../../src/engine/components/VerticalServer';
import {getVisualNumber} from '../../src/engine/types';
import type {VisualProps} from '../../src/engine/types';

const font = 'Inter, Arial, sans-serif';

export const HookVisual = ({scene}: VisualProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shake = getVisualNumber(scene, 'shake', 8);
  const serverEntry = spring({frame, fps, config: {damping: 12, stiffness: 115}, durationInFrames: 25});
  const shakeX = Math.sin(frame * 2.2) * shake * Math.min(1, frame / 10);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Headline top={350} fontSize={84} color="#F8FAFC">1 MILLION USERS?!</Headline>
      <div
        style={{
          position: 'absolute',
          left: 405,
          top: 720,
          transform: `translateX(${shakeX}px) scale(${0.82 + serverEntry * 0.18})`,
          filter: 'drop-shadow(0 0 28px #FB718555)',
        }}
      >
        <ServerSVG width={270} height={405} accent="#FB7185" />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1190,
          left: 300,
          width: 480,
          padding: '18px 24px',
          border: '2px solid #FB7185',
          borderRadius: 18,
          background: 'rgba(251, 113, 133, 0.12)',
          color: '#FB7185',
          font: '900 30px Inter, Arial, sans-serif',
          textAlign: 'center',
          opacity: interpolate(frame, [34, 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          transform: `scale(${interpolate(frame, [34, 45], [0.85, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})})`,
        }}
      >
        ⚠ OVERLOAD
      </div>
    </div>
  );
};

export const VerticalVisual = ({scene}: VisualProps) => {
  const frame = useCurrentFrame();
  const growthFrames = getVisualNumber(scene, 'growthFrames', 54);
  const maxScale = getVisualNumber(scene, 'maxScale', 1.4);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Headline top={345} fontSize={67} color="#38BDF8">VERTICAL SCALING</Headline>
      <div
        style={{
          position: 'absolute',
          top: 520,
          left: 284,
          width: 510,
          color: '#94A3B8',
          font: '700 30px Inter, Arial, sans-serif',
          textAlign: 'center',
        }}
      >
        MAKE ONE SERVER BIGGER
      </div>
      <div style={{position: 'absolute', top: 800, left: 310}}>
        <VerticalServer
          width={310}
          height={465}
          accent="#38BDF8"
          maxScale={maxScale}
          growthFrames={growthFrames}
          showIndicators
          indicatorGap={260}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 650,
          left: 185,
          color: '#38BDF8',
          font: '900 74px Inter, Arial, sans-serif',
          opacity: interpolate(frame, [12, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          textShadow: '0 0 25px #38BDF866',
        }}
      >
        ↑
      </div>
    </div>
  );
};

export const LimitVisual = ({scene}: VisualProps) => {
  const frame = useCurrentFrame();
  const impactFrame = getVisualNumber(scene, 'impactFrame', 54);
  const impact = interpolate(frame, [impactFrame, impactFrame + 4, impactFrame + 11], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shake = frame >= impactFrame && frame <= impactFrame + 10 ? Math.sin(frame * 4) * impact * 14 : 0;

  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${shake}px)`}}>
      <Headline top={350} fontSize={73} color="#FB7185">HARDWARE LIMIT!</Headline>
      <div
        style={{
          position: 'absolute',
          left: 160,
          top: 646,
          width: 760,
          height: 8,
          borderRadius: 8,
          background: '#FB7185',
          boxShadow: '0 0 28px #FB7185, 0 0 70px #FB718577',
          transform: `scaleX(${interpolate(frame, [0, 20], [0.72, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})})`,
        }}
      />
      <div style={{position: 'absolute', top: 697, left: 386}}>
        <VerticalServer width={308} height={462} accent="#38BDF8" maxScale={1.04} growthFrames={28} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1160,
          left: 205,
          width: 670,
          color: '#94A3B8',
          textAlign: 'center',
          font: '700 31px Inter, Arial, sans-serif',
          opacity: interpolate(frame, [impactFrame + 8, impactFrame + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        ONE MACHINE CAN ONLY GET SO POWERFUL
      </div>
      <div
        style={{
          position: 'absolute',
          left: 480,
          top: 585,
          color: '#FACC15',
          font: '900 38px Inter, Arial, sans-serif',
          opacity: impact,
          transform: `scale(${1 + impact * 0.35})`,
        }}
      >
        IMPACT
      </div>
    </div>
  );
};

export const HorizontalVisual = ({scene}: VisualProps) => {
  const frame = useCurrentFrame();
  const serverCount = getVisualNumber(scene, 'serverCount', 5);
  const staggerFrames = getVisualNumber(scene, 'staggerFrames', 6);
  const lineOpacity = interpolate(frame, [32, 58], [0, 0.65], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Headline top={330} fontSize={65} color="#34D399">HORIZONTAL SCALING</Headline>
      <div style={{position: 'absolute', top: 518, left: 220, width: 640, color: '#94A3B8', textAlign: 'center', font: '700 30px Inter, Arial, sans-serif'}}>
        ADD MORE SERVERS
      </div>
      <svg
        style={{position: 'absolute', left: 110, top: 735}}
        width="860"
        height="170"
        viewBox="0 0 860 170"
        aria-hidden="true"
      >
        <path d="M430 5 C430 64 105 48 105 155 M430 5 C430 64 268 48 268 155 M430 5 V155 M430 5 C430 64 592 48 592 155 M430 5 C430 64 755 48 755 155" fill="none" stroke="#34D399" strokeWidth="4" strokeDasharray="9 10" opacity={lineOpacity} />
        {[105, 268, 430, 592, 755].map((x) => <circle key={x} cx={x} cy="155" r="8" fill="#34D399" opacity={lineOpacity} />)}
      </svg>
      <div style={{position: 'absolute', top: 835, left: 105}}>
        <HorizontalFleet
          count={serverCount}
          delay={staggerFrames}
          width={870}
          height={370}
          spacing={14}
          accent="#34D399"
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1280,
          left: 210,
          width: 660,
          color: '#34D399',
          textAlign: 'center',
          font: '800 32px Inter, Arial, sans-serif',
          letterSpacing: 1,
        }}
      >
        SPREAD THE WORK
      </div>
    </div>
  );
};

const ComparisonPanel = ({
  side,
  frame,
  fps,
  delay,
}: {
  side: 'vertical' | 'horizontal';
  frame: number;
  fps: number;
  delay: number;
}) => {
  const isVertical = side === 'vertical';
  const accent = isVertical ? '#38BDF8' : '#34D399';
  const progress = spring({
    frame: Math.max(0, frame - (isVertical ? 0 : delay)),
    fps,
    config: {damping: 15, stiffness: 105, mass: 0.85},
    durationInFrames: 28,
  });
  const x = isVertical ? 95 : 555;
  const title = isVertical ? 'VERTICAL' : 'HORIZONTAL';
  const description = isVertical ? 'One bigger machine' : 'More machines';

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 485,
        width: 430,
        height: 880,
        boxSizing: 'border-box',
        padding: 28,
        overflow: 'hidden',
        border: `2px solid ${accent}66`,
        borderRadius: 34,
        background: 'linear-gradient(150deg, #142540 0%, #101D36 70%)',
        boxShadow: `0 20px 58px ${accent}18`,
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(progress, [0, 1], [44, 0])}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: 56,
          height: 500,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {isVertical ? (
          <ServerSVG width={282} height={426} accent={accent} />
        ) : (
          <HorizontalFleet count={3} delay={isVertical ? 0 : delay} width={360} height={295} spacing={12} accent={accent} />
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 22,
          right: 22,
          top: 622,
          height: 52,
          color: accent,
          textAlign: 'center',
          font: '900 32px Inter, Arial, sans-serif',
          letterSpacing: 1.2,
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 18,
          right: 18,
          top: 694,
          color: '#F8FAFC',
          textAlign: 'center',
          font: '600 27px Inter, Arial, sans-serif',
        }}
      >
        {description}
      </div>
    </div>
  );
};

export const ComparisonVisual = ({scene}: VisualProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const panelDelay = getVisualNumber(scene, 'panelDelay', 12);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div
        style={{
          position: 'absolute',
          top: 290,
          left: 90,
          width: 900,
          color: '#F8FAFC',
          textAlign: 'center',
          font: `900 76px ${font}`,
          letterSpacing: -2,
        }}
      >
        BIGGER <span style={{color: '#FACC15'}}>vs</span> MORE
      </div>
      <ComparisonPanel side="vertical" frame={frame} fps={fps} delay={0} />
      <ComparisonPanel side="horizontal" frame={frame} fps={fps} delay={panelDelay} />
    </div>
  );
};
