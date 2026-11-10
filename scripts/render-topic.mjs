import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {getAudioPaths, loadTopicMetadata, parseArgs, projectRoot} from './shared.mjs';

const options = parseArgs(process.argv.slice(2));
if (!options.topic) {
  throw new Error('Provide a topic with --topic <id>.');
}
const {metadata, scenes} = loadTopicMetadata(options.topic);
if (typeof metadata.compositionId !== 'string') {
  throw new Error(`Topic "${options.topic}" must define compositionId in topic.json.`);
}

const output = path.resolve(projectRoot, options.output ?? `out/${options.topic}.mp4`);
mkdirSync(path.dirname(output), {recursive: true});
const argumentsList = [
  'exec',
  '--',
  'remotion',
  'render',
  'src/index.ts',
  metadata.compositionId,
  output,
  '--codec=h264',
];

if (options.scene) {
  let startFrame = 0;
  const selected = scenes.find((scene) => {
    if (scene.id === options.scene) {
      return true;
    }
    startFrame += scene.durationInFrames;
    return false;
  });
  if (!selected) {
    throw new Error(`Scene "${options.scene}" does not exist in topic "${options.topic}".`);
  }
  argumentsList.push(`--frames=${startFrame}-${startFrame + selected.durationInFrames - 1}`);
}

const result = spawnSync('npm', argumentsList, {
  cwd: projectRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    REMOTION_AUDIO_PATHS: getAudioPaths(metadata).join(','),
  },
});

if (result.error) {
  throw result.error;
}
process.exitCode = result.status ?? 1;
