import {interpolate, useCurrentFrame} from 'remotion';
import type {CaptionCue} from '../types';

type CaptionProps = {
  cue: CaptionCue;
};

export const Caption = ({cue}: CaptionProps) => {
  const frame = useCurrentFrame();
  const cueFrame = frame - cue.startFrame;
  const fadeFrames = Math.min(5, Math.floor((cue.durationInFrames - 1) / 2));
  const opacity = fadeFrames > 0
    ? interpolate(
        cueFrame,
        [0, fadeFrames, cue.durationInFrames - fadeFrames, cue.durationInFrames],
        [0, 1, 1, 0],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
      )
    : 1;
  const translateY = interpolate(cueFrame, [0, 6], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const activeWordIndex = cue.words?.findIndex(
    (word) => frame >= word.startFrame && frame < word.startFrame + word.durationInFrames,
  ) ?? -1;
  const parts = cue.highlightedKeyword
    ? cue.text.split(cue.highlightedKeyword)
    : [cue.text];

  return (
    <div
      style={{
        position: 'absolute',
        top: 1470,
        left: 88,
        width: 904,
        minHeight: 112,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 30px',
        border: '1px solid #263957',
        borderRadius: 22,
        background: 'rgba(16, 29, 54, 0.96)',
        color: '#F8FAFC',
        font: '800 42px Inter, Arial, sans-serif',
        lineHeight: 1.3,
        textAlign: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.28)',
      }}
    >
      {cue.words ? (
        <span>
          {cue.words.map((word, index) => (
            <span key={`${word.startFrame}-${index}`}>
              {index > 0 && !/^[,.;:!?]/.test(word.text) ? ' ' : ''}
              <span style={activeWordIndex === index ? {color: '#FACC15'} : undefined}>
                {word.text}
              </span>
            </span>
          ))}
        </span>
      ) : (
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
      )}
    </div>
  );
};
