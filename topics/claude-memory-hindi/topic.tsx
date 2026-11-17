import type {SceneDefinition, TopicDefinition} from '../../src/engine/types';
import scenesJson from './scenes.json';
import metadata from './topic.json';
import {storyboard} from './storyboard';
import {HookVisual, MemoryTypesVisual, MemoryVisual} from './visuals';

const scenes: SceneDefinition[] = scenesJson;
const captions: TopicDefinition['captions'] = {};
const script: TopicDefinition['script'] = {};
const narration: NonNullable<TopicDefinition['narration']> = [];
let sceneStartFrame = 0;
const strategicSubtitles: Record<
  string,
  {text: string; atSeconds: number; durationSeconds: number; highlightedKeyword: string}[]
> = {
  'personal-rules': [
    {
      text: 'Put CLAUDE.local.md in .gitignore.',
      atSeconds: 29.68,
      durationSeconds: 5,
      highlightedKeyword: '.gitignore',
    },
  ],
  'auto-memory': [
    {
      text: 'Auto Memory is ON by default.',
      atSeconds: 19.33,
      durationSeconds: 2.4,
      highlightedKeyword: 'ON by default',
    },
    {
      text: 'Use /memory to see what Claude saved.',
      atSeconds: 31.98,
      durationSeconds: 4,
      highlightedKeyword: '/memory',
    },
  ],
  'golden-rule': [
    {
      text: 'Repeated instruction? Ask Claude to remember it.',
      atSeconds: 1.98,
      durationSeconds: 5,
      highlightedKeyword: 'remember it',
    },
  ],
  outro: [
    {
      text: 'Part 2: Sub-agent memory.',
      atSeconds: 9.22,
      durationSeconds: 4.5,
      highlightedKeyword: 'Part 2',
    },
  ],
};

for (const scene of scenes) {
  const section = storyboard[scene.id];
  if (!section) throw new Error(`Missing Claude Memory storyboard for "${scene.id}".`);

  script[scene.id] = section.lines.join(' ');
  captions[scene.id] =
    scene.id === 'claude-md'
      ? [
          {
            text: 'Pro tip: Keep CLAUDE.md short—Claude recommends 150–200 lines max.',
            startFrame: Math.round(78 * metadata.fps) - sceneStartFrame,
            durationInFrames: 180,
            highlightedKeyword: '150–200 lines',
          },
        ]
      : (strategicSubtitles[scene.id] ?? []).map((subtitle) => ({
          text: subtitle.text,
          startFrame: Math.round(subtitle.atSeconds * metadata.fps),
          durationInFrames: Math.round(subtitle.durationSeconds * metadata.fps),
          highlightedKeyword: subtitle.highlightedKeyword,
        }));

  narration.push({
    file: `audio/claude-memory/${section.audioFile}`,
    from: sceneStartFrame,
  });
  sceneStartFrame += scene.durationInFrames;
}

const topic: TopicDefinition = {
  ...metadata,
  scenes,
  narration,
  captions,
  script,
  visuals: {hook: HookVisual, 'memory-types': MemoryTypesVisual, memory: MemoryVisual},
};

export default topic;
