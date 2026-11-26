import {interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../styles/theme';

type SceneTransitionProps = {
  children: React.ReactNode;
  durationInFrames: number;
  transitionDurationInFrames?: number;
};

export const SceneTransition = ({
  children,
  durationInFrames,
  transitionDurationInFrames = 12,
}: SceneTransitionProps) => {
  const frame = useCurrentFrame();
  const opacity =
    durationInFrames <= 1 || transitionDurationInFrames <= 0
      ? 1
      : interpolate(frame, [0, Math.min(transitionDurationInFrames, durationInFrames - 1)], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: theme.background,
      }}
    >
      <div style={{position: 'absolute', inset: 0, opacity}}>{children}</div>
    </div>
  );
};
