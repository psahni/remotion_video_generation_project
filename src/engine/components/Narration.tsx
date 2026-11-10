
import {Sequence, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import type {NarrationClip} from '../types';

const availableAudioPaths = new Set(
  (process.env.REMOTION_AUDIO_PATHS ?? '')
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean),
);

type NarrationProps = {
  clips: NarrationClip[];
};

export const Narration = ({clips}: NarrationProps) => {
  return (
    <>
      {clips
        .filter((clip) => availableAudioPaths.has(clip.file))
        .map((clip) => (
          <Sequence
            key={`${clip.from}-${clip.file}`}
            from={clip.from}
            durationInFrames={clip.durationInFrames}
            name={`Narration: ${clip.file}`}
          >
            <Audio src={staticFile(clip.file)} volume={clip.volume ?? 1} />
          </Sequence>
        ))}
    </>
  );
};
