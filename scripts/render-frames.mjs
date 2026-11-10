import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {getAudioPaths, loadTopicMetadata, parseArgs, projectRoot} from './shared.mjs';

const options = parseArgs(process.argv.slice(2));
const topicId = options.topic ?? 'scaling';
const {metadata} = loadTopicMetadata(topicId);
const frames = (options.frames ?? '60,180,360,580,750,810,880')
  .split(',')
  .map((value) => Number(value));
if (frames.some((frame) => !Number.isInteger(frame) || frame < 0)) {
  throw new Error('--frames must be a comma-separated list of non-negative frame numbers.');
}

const outputDirectory = path.resolve(projectRoot, options.output ?? `out/frames/${topicId}`);
mkdirSync(outputDirectory, {recursive: true});
const audioPaths = getAudioPaths(metadata).join(',');

for (const frame of frames) {
  const output = path.join(outputDirectory, `${topicId}-${frame}.png`);
  const result = spawnSync(
    'npm',
    [
      'exec',
      '--',
      'remotion',
      'still',
      'src/index.ts',
      metadata.compositionId,
      output,
      `--frame=${frame}`,
    ],
    {
      cwd: projectRoot,
      stdio: 'inherit',
      env: {...process.env, REMOTION_AUDIO_PATHS: audioPaths},
    },
  );
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    break;
  }
}
