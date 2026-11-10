import {Composition} from 'remotion';
import {TopicVideo} from './engine/TopicVideo';
import {getSceneDuration} from './engine/types';
import type {TopicDefinition} from './engine/types';

const topicModules = require.context('../topics', true, /topic\.tsx$/);
const topics = topicModules.keys().map((key) => {
  const module = topicModules<{default: TopicDefinition}>(key);
  return module.default;
});

const TopicComposition = ({topicId}: {topicId: string}) => {
  const topic = topics.find((candidate) => candidate.id === topicId);
  if (!topic) {
    throw new Error(`No topic is registered with id "${topicId}".`);
  }
  return <TopicVideo topic={topic} />;
};

export const Root = () => (
  <>
    {topics.map((topic) => (
      <Composition
        key={topic.compositionId}
        id={topic.compositionId}
        component={TopicComposition}
        durationInFrames={getSceneDuration(topic.scenes)}
        fps={topic.fps}
        width={topic.width}
        height={topic.height}
        defaultProps={{topicId: topic.id}}
      />
    ))}
  </>
);
