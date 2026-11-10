import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const parseArgs = (args) => {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith('--')) {
      throw new Error(`Unexpected argument "${arg}".`);
    }
    const [key, inlineValue] = arg.slice(2).split('=', 2);
    const value = inlineValue ?? args[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}.`);
    }
    options[key] = value;
    if (inlineValue === undefined) {
      index += 1;
    }
  }
  return options;
};

export const loadTopicMetadata = (topicId) => {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(topicId)) {
    throw new Error(`Invalid topic id "${topicId}". Use lowercase letters, numbers, and hyphens.`);
  }
  const topicDirectory = path.join(projectRoot, 'topics', topicId);
  const metadataPath = path.join(topicDirectory, 'topic.json');
  const scenesPath = path.join(topicDirectory, 'scenes.json');
  if (!existsSync(metadataPath) || !existsSync(scenesPath)) {
    throw new Error(`Topic "${topicId}" needs topics/${topicId}/topic.json and scenes.json.`);
  }
  const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
  const scenes = JSON.parse(readFileSync(scenesPath, 'utf8'));
  return {metadata, scenes};
};

export const getAudioPaths = (metadata) => {
  const paths = [
    ...(typeof metadata.audioPath === 'string' ? [metadata.audioPath] : []),
    ...(Array.isArray(metadata.narration)
      ? metadata.narration.flatMap((clip) =>
          typeof clip.file === 'string' ? [clip.file] : [],
        )
      : []),
  ];
  return [...new Set(paths)].filter((audioPath) =>
    existsSync(path.join(projectRoot, 'public', audioPath)),
  );
};
