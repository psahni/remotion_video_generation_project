import type {CaptionCue, TopicDefinition} from '../../src/engine/types';
import scenes from './scenes.json';
import metadata from './topic.json';
import {scaleBeatSecond, storyboard} from './storyboard';
import {ArchitectureVisual} from './visuals';

const captions: TopicDefinition['captions'] = {};
const script: TopicDefinition['script'] = {};
let sceneStartFrame = 0;

for (const scene of scenes) {
  const section = storyboard[scene.id];
  if (!section) throw new Error(`Missing voice-agent storyboard for "${scene.id}".`);

  script[scene.id] = section.beats.flatMap((beat) => beat.lines).join(' ');
  const sceneEndFrame = sceneStartFrame + scene.durationInFrames;
  const sceneNarration = metadata.narration.filter(
    (clip) => clip.from >= sceneStartFrame && clip.from < sceneEndFrame,
  );
  const narrationDurationInFrames = sceneNarration.length
    ? Math.max(...sceneNarration.map((clip) =>
        clip.from - sceneStartFrame + (clip.durationInFrames ?? scene.durationInFrames),
      ))
    : scene.durationInFrames;
  const captionTimeScale = narrationDurationInFrames / scene.durationInFrames;

  captions[scene.id] = section.beats.flatMap((beat, index): CaptionCue[] => {
    const start = Math.round(
      scaleBeatSecond(scene.id, beat.second, scene.durationInFrames, metadata.fps) *
        metadata.fps *
        captionTimeScale,
    );
    const next = section.beats[index + 1];
    const end = next
      ? Math.round(
          scaleBeatSecond(scene.id, next.second, scene.durationInFrames, metadata.fps) *
            metadata.fps *
            captionTimeScale,
        )
      : narrationDurationInFrames;
    const wordCounts = beat.lines.map((line) => line.split(/\s+/).length);
    const words = wordCounts.reduce((total, count) => total + count, 0);
    let elapsedWords = 0;

    return beat.lines.map((text, lineIndex) => {
      const startFrame = start + Math.round((end - start) * elapsedWords / words);
      elapsedWords += wordCounts[lineIndex] ?? 0;
      const endFrame = start + Math.round((end - start) * elapsedWords / words);
      return {text, startFrame, durationInFrames: Math.max(1, endFrame - startFrame)};
    });
  });
  sceneStartFrame = sceneEndFrame;
}

const topic: TopicDefinition = {
  ...metadata,
  scenes,
  captions,
  script,
  visuals: {architecture: ArchitectureVisual},
};

export default topic;
