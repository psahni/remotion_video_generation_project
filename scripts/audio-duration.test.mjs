import assert from 'node:assert/strict';
import test from 'node:test';
import {getMp3DurationSeconds} from './audio-duration.mjs';

const makeMp3 = (frameCount, withId3Tag = false) => {
  const frame = Buffer.alloc(417);
  Buffer.from([0xff, 0xfb, 0x90, 0x00]).copy(frame);
  const frames = Buffer.concat(Array.from({length: frameCount}, () => frame));
  if (!withId3Tag) {
    return frames;
  }
  return Buffer.concat([Buffer.from('ID3\x04\x00\x00\x00\x00\x00\x00'), frames]);
};

test('calculates duration from MP3 frames', () => {
  assert.equal(getMp3DurationSeconds(makeMp3(10)), (10 * 1152) / 44100);
});

test('skips an ID3 header before reading MP3 frames', () => {
  assert.equal(getMp3DurationSeconds(makeMp3(10, true)), (10 * 1152) / 44100);
});

test('rejects audio that is not a valid MP3 stream', () => {
  assert.throws(() => getMp3DurationSeconds(Buffer.from('not audio')), /valid MP3 stream/);
});
