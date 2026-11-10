import {readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {getAudioPaths, projectRoot} from './shared.mjs';

const topicsDirectory = path.join(projectRoot, 'topics');
const audioPaths = [];
for (const entry of readdirSync(topicsDirectory, {withFileTypes: true})) {
  if (!entry.isDirectory()) {
    continue;
  }
  const metadataPath = path.join(topicsDirectory, entry.name, 'topic.json');
  try {
    const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
    audioPaths.push(...getAudioPaths(metadata));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

const result = spawnSync('npm', ['exec', '--', 'remotion', 'studio', 'src/index.ts'], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: {...process.env, REMOTION_AUDIO_PATHS: [...new Set(audioPaths)].join(',')},
});

if (result.error) {
  throw result.error;
}
process.exitCode = result.status ?? 1;
