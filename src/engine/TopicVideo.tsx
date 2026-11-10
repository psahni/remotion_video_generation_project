import {Audio, Sequence, staticFile} from 'remotion';
import {Narration} from './components/Narration';
import {SceneTemplate} from './SceneTemplate';
import type {TopicDefinition} from './types';

const availableAudioPaths = new Set(
  (process.env.REMOTION_AUDIO_PATHS ?? '')
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean),
);

type TopicVideoProps = {
  topic: TopicDefinition;
};

export const TopicVideo = ({topic}: TopicVideoProps) => {
  let startFrame = 0;

  return (
    <>
      {topic.audioPath && availableAudioPaths.has(topic.audioPath) && (
        <Audio src={staticFile(topic.audioPath)} />
      )}
      {topic.narration && <Narration clips={topic.narration} />}
      {topic.scenes.map((scene) => {
        const sceneStart = startFrame;
        startFrame += scene.durationInFrames;
        return (
          <Sequence
            key={scene.id}
            from={sceneStart}
            durationInFrames={scene.durationInFrames}
            name={scene.id}
          >
            <SceneTemplate
              topic={topic}
              scene={scene}
              durationInFrames={scene.durationInFrames}
            />
          </Sequence>
        );
      })}
    </>
  );
};
