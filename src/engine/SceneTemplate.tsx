import {Captions} from './components/Captions';
import {SceneTransition} from './components/SceneTransition';
import {theme} from './styles/theme';
import type {SceneDefinition, TopicDefinition} from './types';

type SceneTemplateProps = {
  topic: TopicDefinition;
  scene: SceneDefinition;
  durationInFrames: number;
};

export const SceneTemplate = ({
  topic,
  scene,
  durationInFrames,
}: SceneTemplateProps) => {
  const Visual = topic.visuals[scene.visualKey];
  const script = topic.script[scene.id];
  const cues = topic.captions[scene.id];

  if (!Visual) {
    throw new Error(`Topic "${topic.id}" has no visual registered for "${scene.visualKey}".`);
  }
  if (!script) {
    throw new Error(`Topic "${topic.id}" is missing narration for scene "${scene.id}".`);
  }
  if (!cues) {
    throw new Error(`Topic "${topic.id}" is missing captions for scene "${scene.id}".`);
  }

  return (
    <SceneTransition durationInFrames={durationInFrames}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: theme.background}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(32, 63, 107, 0.23) 0%, rgba(8, 14, 30, 0) 58%)',
          }}
        />
        <Visual scene={scene} script={script} durationInFrames={durationInFrames} />
        <Captions cues={cues} />
      </div>
    </SceneTransition>
  );
};
