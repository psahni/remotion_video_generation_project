import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type HeadlineProps = {
  children: string;
  color?: string;
  fontSize?: number;
  top: number;
  maxWidth?: number;
  delay?: number;
};

export const Headline = ({
  children,
  color = '#F8FAFC',
  fontSize = 68,
  top,
  maxWidth = 940,
  delay = 0,
}: HeadlineProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {damping: 15, stiffness: 110, mass: 0.8},
    durationInFrames: 22,
  });

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 70,
        width: 940,
        maxWidth,
        color,
        textAlign: 'center',
        font: `900 ${fontSize}px Inter, Arial, sans-serif`,
        letterSpacing: '-2px',
        lineHeight: 1.08,
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px) scale(${0.94 + progress * 0.06})`,
        textShadow: `0 0 32px ${color}33`,
      }}
    >
      {children}
    </div>
  );
};
