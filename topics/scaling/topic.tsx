import {scalingCaptions} from './captions';
import scenesJson from './scenes.json';
import {scalingScript} from './script';
import topicJson from './topic.json';
import {
  ComparisonVisual,
  HookVisual,
  HorizontalVisual,
  LimitVisual,
  VerticalVisual,
} from './visuals';
import type {SceneDefinition, TopicDefinition} from '../../src/engine/types';

const scenes: SceneDefinition[] = scenesJson;

const scalingTopic: TopicDefinition = {
  ...topicJson,
  scenes,
  script: scalingScript,
  captions: scalingCaptions,
  visuals: {
    hook: HookVisual,
    vertical: VerticalVisual,
    limit: LimitVisual,
    horizontal: HorizontalVisual,
    comparison: ComparisonVisual,
  },
};

export default scalingTopic;
