import type {SceneDefinition, TopicDefinition} from '../../src/engine/types';
import metadata from './topic.json';
import baseTopic from '../claude-memory-hindi/topic';

const speedFactor = 1.1;
const scenes: SceneDefinition[] = baseTopic.scenes.map((scene) => ({
  ...scene,
  durationInFrames: Math.round(scene.durationInFrames / speedFactor),
  visualProps: {...scene.visualProps, speedFactor},
}));

let sceneStartFrame = 0;
const sceneStartFrames = scenes.map((scene) => {
  const startFrame = sceneStartFrame;
  sceneStartFrame += scene.durationInFrames;
  return startFrame;
});

const baseNarration = baseTopic.narration ?? [];
if (baseNarration.length !== scenes.length) {
  throw new Error('Fast Claude Memory topic must have one narration clip per scene.');
}

const narration = baseNarration.map((clip, index) => {
  const from = sceneStartFrames[index];
  if (from === undefined) throw new Error(`Missing start frame for narration clip ${index}.`);
  return {
    ...clip,
    from,
    playbackRate: speedFactor,
    preservePitch: true,
  };
});

const captions: TopicDefinition['captions'] = Object.fromEntries(
  Object.entries(baseTopic.captions).map(([sceneId, cues]) => [
    sceneId,
    cues.map((cue) => ({
      ...cue,
      startFrame: Math.round(cue.startFrame / speedFactor),
      durationInFrames: Math.max(1, Math.round(cue.durationInFrames / speedFactor)),
    })),
  ]),
);

const topic: TopicDefinition = {
  ...baseTopic,
  ...metadata,
  scenes,
  narration,
  captions,
};

export default topic;
