import {copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, renameSync, rmSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {parseArgs, projectRoot} from './shared.mjs';

const videoExtensions = new Set(['.mp4', '.mov', '.webm', '.mkv']);
const audioExtensions = new Set(['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.opus']);

const collectMedia = (directory, extensions, archiveDirectory) => {
  if (!existsSync(directory)) {
    return [];
  }

  const media = [];
  const visit = (currentDirectory) => {
    for (const entry of readdirSync(currentDirectory, {withFileTypes: true})) {
      const sourcePath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) {
        visit(sourcePath);
      } else if (entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase())) {
        media.push({
          sourcePath,
          archivePath: path.join(archiveDirectory, path.relative(directory, sourcePath)),
        });
      }
    }
  };
  visit(directory);
  return media;
};

export const createGeneratedMediaArchive = (root, outputPath) => {
  const media = [
    ...collectMedia(path.join(root, 'out'), videoExtensions, 'videos'),
    ...collectMedia(path.join(root, 'public', 'audio', 'generated-videos'), audioExtensions, 'audio'),
  ];
  if (media.length === 0) {
    throw new Error('No generated videos or audio files were found.');
  }

  const resolvedOutput = path.resolve(outputPath);
  if (media.some(({sourcePath}) => path.resolve(sourcePath) === resolvedOutput)) {
    throw new Error('The archive output cannot replace a generated media file.');
  }

  const stagingDirectory = mkdtempSync(path.join(os.tmpdir(), 'generated-media-'));
  const temporaryArchive = `${resolvedOutput}.${randomUUID()}.tmp`;
  try {
    for (const {sourcePath, archivePath} of media) {
      const stagedPath = path.join(stagingDirectory, archivePath);
      mkdirSync(path.dirname(stagedPath), {recursive: true});
      copyFileSync(sourcePath, stagedPath);
    }

    mkdirSync(path.dirname(resolvedOutput), {recursive: true});
    const result = spawnSync('zip', ['-q', '-r', '-X', temporaryArchive, '.'], {
      cwd: stagingDirectory,
      encoding: 'utf8',
    });
    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      throw new Error(`Unable to create ZIP archive: ${result.stderr.trim() || `zip exited with ${result.status}`}`);
    }

    renameSync(temporaryArchive, resolvedOutput);
  } finally {
    rmSync(stagingDirectory, {recursive: true, force: true});
    rmSync(temporaryArchive, {force: true});
  }

  return {
    outputPath: resolvedOutput,
    videoCount: media.filter(({archivePath}) => archivePath.startsWith(`videos${path.sep}`)).length,
    audioCount: media.filter(({archivePath}) => archivePath.startsWith(`audio${path.sep}`)).length,
  };
};

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  const outputPath = path.resolve(projectRoot, args.output ?? 'out/generated-media.zip');
  const result = createGeneratedMediaArchive(projectRoot, outputPath);
  console.log(
    `Created ${result.outputPath} with ${result.videoCount} video(s) and ${result.audioCount} audio file(s).`,
  );
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main();
}
