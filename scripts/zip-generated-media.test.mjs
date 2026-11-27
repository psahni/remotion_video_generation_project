import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';
import {createGeneratedMediaArchive} from './zip-generated-media.mjs';

test('archives rendered videos and generated audio while excluding other files', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'media-archive-test-'));
  try {
    const videoPath = path.join(root, 'out', 'renders', 'example.mp4');
    const audioPath = path.join(root, 'public', 'audio', 'generated-videos', 'example', 'scene-1.mp3');
    mkdirSync(path.dirname(videoPath), {recursive: true});
    mkdirSync(path.dirname(audioPath), {recursive: true});
    mkdirSync(path.join(root, 'out', 'frames'), {recursive: true});
    mkdirSync(path.join(root, 'public', 'audio'), {recursive: true});
    writeFileSync(videoPath, 'video');
    writeFileSync(audioPath, 'audio');
    writeFileSync(path.join(root, 'out', 'frames', 'frame.png'), 'frame');
    writeFileSync(path.join(root, 'public', 'audio', 'sample.mp3'), 'sample');

    const outputPath = path.join(root, 'out', 'media.zip');
    const result = createGeneratedMediaArchive(root, outputPath);
    const listing = spawnSync('unzip', ['-Z1', outputPath], {encoding: 'utf8'});

    assert.equal(result.videoCount, 1);
    assert.equal(result.audioCount, 1);
    assert.equal(listing.status, 0, listing.stderr);
    assert.deepEqual(listing.stdout.trim().split('\n').filter((entry) => !entry.endsWith('/')).sort(), [
      'audio/example/scene-1.mp3',
      'videos/renders/example.mp4',
    ]);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('does not create an archive when there is no generated media', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'empty-media-test-'));
  try {
    const outputPath = path.join(root, 'out', 'media.zip');
    assert.throws(() => createGeneratedMediaArchive(root, outputPath), /No generated videos or audio files/);
    assert.throws(() => readFileSync(outputPath), {code: 'ENOENT'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
