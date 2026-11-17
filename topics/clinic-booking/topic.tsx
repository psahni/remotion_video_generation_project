import scenesJson from './scenes.json';
import topicJson from './topic.json';
import {clinicBookingCaptions} from './captions';
import {clinicBookingScript} from './script';
import {ClinicBookingVisual} from './visuals';
import type {SceneDefinition, TopicDefinition} from '../../src/engine/types';

const clinicBookingTopic: TopicDefinition = {
  ...topicJson,
  scenes: scenesJson as SceneDefinition[],
  script: clinicBookingScript,
  captions: clinicBookingCaptions,
  visuals: {clinic: ClinicBookingVisual},
};

export default clinicBookingTopic;
