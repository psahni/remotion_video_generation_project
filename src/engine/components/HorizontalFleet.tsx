import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ServerSVG} from './ServerSVG';

type HorizontalFleetProps = {
  count: number;
  delay?: number;
  width?: number;
  height?: number;
  spacing?: number;
  accent?: string;
};

type FleetServerProps = {
  index: number;
  width: number;
  height: number;
  accent: string;
  delay: number;
};

const FleetServer = ({index, width, height, accent, delay}: FleetServerProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = Math.max(0, frame - delay - index * 6);
  const progress = spring({
    frame: localFrame,
    fps,
    config: {damping: 13, stiffness: 125, mass: 0.7},
    durationInFrames: 22,
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const translateY = interpolate(progress, [0, 1], [46, 0]);

  return (
    <div style={{opacity, transform: `translateY(${translateY}px)`, flex: '0 0 auto'}}>
      <ServerSVG width={width} height={height} accent={accent} label={`Server ${index + 1}`} />
    </div>
  );
};

export const HorizontalFleet = ({
  count,
  delay = 0,
  width = 860,
  height = 300,
  spacing = 18,
  accent = '#34D399',
}: HorizontalFleetProps) => {
  const serverCount = Math.max(1, Math.min(5, Math.floor(count)));
  const serverWidth = Math.min(180, (width - spacing * (serverCount - 1)) / serverCount);
  const serverHeight = Math.min(height, serverWidth * 1.5);

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: spacing,
        overflow: 'hidden',
      }}
    >
      {Array.from({length: serverCount}, (_, index) => (
        <FleetServer
          key={index}
          index={index}
          width={serverWidth}
          height={serverHeight}
          accent={accent}
          delay={delay}
        />
      ))}
    </div>
  );
};
