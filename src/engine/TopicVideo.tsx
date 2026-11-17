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
      {topic.persistentLabel && (
        <div style={{
          position: 'absolute',
          top: 54,
          left: 72,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '13px 20px',
          borderRadius: 28,
          background: '#E8F2E8',
          color: '#2D7659',
          font: '700 24px Arial, sans-serif',
        }}>
          <span style={{width: 12, height: 12, borderRadius: 99, background: '#2D7659'}} />
          {topic.persistentLabel}
        </div>
      )}
    </>
  );
};
