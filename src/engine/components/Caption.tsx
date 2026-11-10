import {interpolate, useCurrentFrame} from 'remotion';
import type {CaptionCue} from '../types';

type CaptionProps = {
  cue: CaptionCue;
};

export const Caption = ({cue}: CaptionProps) => {
  const frame = useCurrentFrame();
  const cueFrame = frame - cue.startFrame;
  const opacity = interpolate(cueFrame, [0, 5, cue.durationInFrames - 5, cue.durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(cueFrame, [0, 6], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const parts = cue.highlightedKeyword
    ? cue.text.split(cue.highlightedKeyword)
    : [cue.text];

  return (
    <div
      style={{
        position: 'absolute',
        top: 1570,
        left: 88,
        width: 904,
        minHeight: 92,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 30px',
        border: '1px solid #263957',
        borderRadius: 22,
        background: 'rgba(16, 29, 54, 0.96)',
        color: '#F8FAFC',
        font: '800 34px Inter, Arial, sans-serif',
        lineHeight: 1.2,
        textAlign: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.28)',
      }}
    >
      <span>
        {parts.map((part, index) => (
          <span key={`${index}-${part}`}>
            {part}
            {cue.highlightedKeyword && index < parts.length - 1 && (
              <span style={{color: '#FACC15'}}>{cue.highlightedKeyword}</span>
            )}
          </span>
        ))}
      </span>
    </div>
  );
};
