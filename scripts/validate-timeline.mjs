import {readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {projectRoot} from './shared.mjs';

const topicsDirectory = path.join(projectRoot, 'topics');
const topicIds = readdirSync(topicsDirectory, {withFileTypes: true})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const compositionIds = new Set();
let checked = 0;

for (const topicId of topicIds) {
  const folder = path.join(topicsDirectory, topicId);
  const metadata = JSON.parse(readFileSync(path.join(folder, 'topic.json'), 'utf8'));
  const scenes = JSON.parse(readFileSync(path.join(folder, 'scenes.json'), 'utf8'));
  if (metadata.id !== topicId || !metadata.compositionId) {
    throw new Error(`Invalid topic metadata in topics/${topicId}/topic.json.`);
  }
  if (compositionIds.has(metadata.compositionId)) {
    throw new Error(`Duplicate composition id "${metadata.compositionId}".`);
  }
  compositionIds.add(metadata.compositionId);
  if (!Number.isInteger(metadata.width) || !Number.isInteger(metadata.height) || !Number.isInteger(metadata.fps)) {
    throw new Error(`Topic "${topicId}" must define integer dimensions and fps.`);
  }
  if (metadata.narration !== undefined) {
    if (!Array.isArray(metadata.narration)) {
      throw new Error(`Topic "${topicId}" narration must be an array.`);
    }
    for (const clip of metadata.narration) {
      if (
        typeof clip.file !== 'string' ||
        !clip.file ||
        !Number.isInteger(clip.from) ||
        clip.from < 0 ||
        (clip.durationInFrames !== undefined &&
          (!Number.isInteger(clip.durationInFrames) || clip.durationInFrames < 1))
      ) {
        throw new Error(`Topic "${topicId}" has an invalid narration clip.`);
      }
    }
  }
  if (!Array.isArray(scenes) || scenes.length === 0) {
    throw new Error(`Topic "${topicId}" must contain at least one scene.`);
  }

  const sceneIds = new Set();
  for (const scene of scenes) {
    if (!scene.id || sceneIds.has(scene.id) || !scene.visualKey) {
      throw new Error(`Topic "${topicId}" has a missing or duplicate scene id/visual key.`);
    }
    if (!Number.isInteger(scene.durationInFrames) || scene.durationInFrames < 1) {
      throw new Error(`Scene "${scene.id}" in topic "${topicId}" needs a positive integer duration.`);
    }
    sceneIds.add(scene.id);
  }
  checked += 1;
}

const scalingFolder = path.join(topicsDirectory, 'scaling');
const scalingMetadata = JSON.parse(readFileSync(path.join(scalingFolder, 'topic.json'), 'utf8'));
const scalingScenes = JSON.parse(readFileSync(path.join(scalingFolder, 'scenes.json'), 'utf8'));
const scalingBoundaries = [];
let frame = 0;
for (const scene of scalingScenes) {
  scalingBoundaries.push(frame);
  frame += scene.durationInFrames;
}
const expectedBoundaries = [0, 120, 300, 480, 720];
if (
  scalingMetadata.compositionId !== 'ScalingVideo' ||
  scalingMetadata.width !== 1080 ||
  scalingMetadata.height !== 1920 ||
  scalingMetadata.fps !== 30 ||
  frame !== 900 ||
  scalingScenes.length !== expectedBoundaries.length ||
  scalingBoundaries.some((boundary, index) => boundary !== expectedBoundaries[index])
) {
  throw new Error('The scaling topic must keep its five exact scene boundaries and 900-frame format.');
}

console.log(`Validated ${checked} topic timeline(s); scaling is 900 frames at 1080x1920, 30 fps.`);
