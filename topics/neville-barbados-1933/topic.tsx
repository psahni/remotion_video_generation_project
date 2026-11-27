import captionsJson from './captions.json';
import scenesJson from './scenes.json';
import scriptJson from './script.json';
import topicJson from './topic.json';
import type {SceneDefinition, TopicDefinition} from '../../src/engine/types';

const topic: TopicDefinition = {
  ...topicJson,
  scenes: scenesJson as SceneDefinition[],
  script: scriptJson,
  captions: captionsJson,
  visuals: {},
};

export default topic;
