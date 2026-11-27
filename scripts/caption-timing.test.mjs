import assert from 'node:assert/strict';
import test from 'node:test';
import {createCaptionCues} from './caption-timing.mjs';

test('groups aligned words and keeps per-word frame timings', () => {
  const cues = createCaptionCues([
    {text: 'The', start: 0, end: 0.2},
    {text: ' ', start: 0.2, end: 0.21},
    {text: 'door', start: 0.21, end: 0.55},
    {text: 'opened.', start: 0.6, end: 1},
    {text: 'Silence', start: 1.2, end: 1.6},
    {text: 'filled', start: 1.61, end: 1.9},
    {text: 'the', start: 1.91, end: 2},
    {text: 'room.', start: 2.01, end: 2.4},
  ], 30, 4);

  assert.equal(cues.length, 2);
  assert.equal(cues[0].text, 'The door opened.');
  assert.equal(cues[0].startFrame, 0);
  assert.equal(cues[0].words[1].startFrame, 6);
  assert.equal(cues[1].text, 'Silence filled the room.');
  assert.equal(cues[1].startFrame, 36);
});

test('rejects invalid forced-alignment word timing', () => {
  assert.throws(
    () => createCaptionCues([{text: 'word', start: 1, end: 0.5}], 30),
    /invalid word timing/,
  );
});
