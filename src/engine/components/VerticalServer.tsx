import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ServerSVG} from './ServerSVG';

type VerticalServerProps = {
  width?: number;
  height?: number;
  accent?: string;
  maxScale?: number;
  growthFrames?: number;
  showIndicators?: boolean;
  indicatorGap?: number;
};

export const VerticalServer = ({
  width = 300,
  height = 450,
  accent = '#38BDF8',
  maxScale = 1.45,
  growthFrames = 50,
  showIndicators = false,
  indicatorGap = 210,
}: VerticalServerProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const growth = spring({
    frame: Math.min(frame, growthFrames),
    fps,
    config: {damping: 14, stiffness: 95, mass: 0.8},
    durationInFrames: growthFrames,
  });
  const scale = interpolate(growth, [0, 1], [1, Math.max(1, maxScale)]);

  return (
    <div style={{position: 'relative', width, height}}>
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'center bottom',
          filter: `drop-shadow(0 0 26px ${accent}44)`,
        }}
      >
        <ServerSVG width={width} height={height} accent={accent} />
      </div>
      {showIndicators && (
        <div
          style={{
            position: 'absolute',
            right: -indicatorGap,
            top: 82,
            width: 184,
            color: '#F8FAFC',
            font: '700 23px Inter, Arial, sans-serif',
          }}
        >
          {[
            {label: 'CPU', value: interpolate(frame, [0, 35], [28, 92], {extrapolateRight: 'clamp'})},
            {label: 'RAM', value: interpolate(frame, [12, 48], [34, 86], {extrapolateRight: 'clamp'})},
          ].map((item) => (
            <div key={item.label} style={{marginBottom: 24}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                <span>{item.label}</span>
                <span style={{color: accent}}>{Math.round(item.value)}%</span>
              </div>
              <div style={{height: 12, borderRadius: 8, background: '#1C2B46', overflow: 'hidden'}}>
                <div style={{height: '100%', width: `${item.value}%`, background: accent, borderRadius: 8}} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
