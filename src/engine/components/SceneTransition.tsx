import {interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../styles/theme';

type SceneTransitionProps = {
  children: React.ReactNode;
  durationInFrames: number;
};

export const SceneTransition = ({children, durationInFrames}: SceneTransitionProps) => {
  const frame = useCurrentFrame();
  const opacity =
    durationInFrames <= 1
      ? 1
      : interpolate(frame, [0, Math.min(12, durationInFrames - 1)], [0, 1], {
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
