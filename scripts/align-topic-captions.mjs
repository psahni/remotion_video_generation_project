import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {basename} from 'node:path';
import {loadTopicMetadata, parseArgs, projectRoot} from './shared.mjs';
import {createCaptionCues} from './caption-timing.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.topic) {
  throw new Error('Provide a topic with --topic <id>.');
}
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  throw new Error('Set ELEVENLABS_API_KEY in the environment before aligning captions.');
}

const {metadata, scenes} = loadTopicMetadata(args.topic);
if (!Array.isArray(metadata.narration) || metadata.narration.length !== scenes.length) {
  throw new Error(`Topic "${args.topic}" needs one narration clip per scene to align word captions.`);
}
const topicDirectory = path.join(projectRoot, 'topics', args.topic);
const script = JSON.parse(readFileSync(path.join(topicDirectory, 'script.json'), 'utf8'));
const preparedScenes = scenes.map((scene, index) => {
  const clip = metadata.narration[index];
  const transcript = script[scene.id]?.replace(/\[[^\]]+\]/g, ' ').replace(/\s+/g, ' ').trim();
  const audioPath = path.join(projectRoot, 'public', clip.file);
  if (!transcript) {
    throw new Error(`Scene "${scene.id}" has no alignable narration transcript.`);
  }
  if (!existsSync(audioPath)) {
    throw new Error(`Narration audio for scene "${scene.id}" is missing: ${audioPath}`);
  }
  return {scene, transcript, audioPath};
});

const captions = {};
for (const [index, {scene, transcript, audioPath}] of preparedScenes.entries()) {
  console.log(`Aligning words for scene ${index + 1}/${preparedScenes.length}...`);
  const form = new FormData();
  form.append(
    'file',
    new Blob([readFileSync(audioPath)], {type: 'audio/mpeg'}),
    basename(audioPath),
  );
  form.append('text', transcript);

  const response = await fetch('https://api.elevenlabs.io/v1/forced-alignment', {
    method: 'POST',
    headers: {'xi-api-key': apiKey},
    body: form,
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) {
    const details = (await response.text()).slice(0, 1000);
    throw new Error(`ElevenLabs forced alignment for scene ${index + 1} failed (${response.status}): ${details}`);
  }

  const alignment = await response.json();
  captions[scene.id] = createCaptionCues(alignment.words, metadata.fps);
}

writeFileSync(
  path.join(topicDirectory, 'captions.json'),
  `${JSON.stringify(captions, null, 2)}\n`,
);
console.log(`Saved word-timed captions for ${preparedScenes.length} scenes in topics/${args.topic}/captions.json.`);
