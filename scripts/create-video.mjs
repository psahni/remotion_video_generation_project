import {copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {getMp3DurationSeconds} from './audio-duration.mjs';
import {parseArgs, projectRoot} from './shared.mjs';

const args = parseArgs(process.argv.slice(2));
const apiKey = process.env.ELEVENLABS_API_KEY;
const configuredVoice = args['voice-id'] ?? process.env.ELEVENLABS_VOICE_ID;
const voiceId = configuredVoice?.startsWith('https://elevenlabs.io/voices/')
  ? new URL(configuredVoice).pathname.split('/').filter(Boolean).at(-1)
  : configuredVoice;

if (!args.input) {
  throw new Error('Provide a manifest with --input <path-to-json>.');
}
if (!args.topic || !/^[a-z0-9][a-z0-9-]*$/.test(args.topic)) {
  throw new Error('Provide --topic with a lowercase id containing only letters, numbers, and hyphens.');
}
if (!apiKey) {
  throw new Error('Set ELEVENLABS_API_KEY in the environment before creating a video.');
}
if (!voiceId || !/^[a-zA-Z0-9_-]+$/.test(voiceId)) {
  throw new Error('Provide a valid --voice-id or set ELEVENLABS_VOICE_ID to an ElevenLabs voice ID or voice page URL.');
}

const manifestPath = path.resolve(args.input);
let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
} catch (error) {
  throw new Error(`Unable to read manifest "${manifestPath}": ${error.message}`);
}

if (!manifest || typeof manifest !== 'object' || !Array.isArray(manifest.scenes) || manifest.scenes.length === 0) {
  throw new Error('The manifest must contain at least one scene.');
}
if (manifest.title !== undefined && typeof manifest.title !== 'string') {
  throw new Error('Manifest title must be a string.');
}
if (manifest.modelId !== undefined && (typeof manifest.modelId !== 'string' || !manifest.modelId.trim())) {
  throw new Error('Manifest modelId must be a non-empty string.');
}
if (manifest.tts_settings !== undefined && (!manifest.tts_settings || typeof manifest.tts_settings !== 'object')) {
  throw new Error('Manifest tts_settings must be an object.');
}
const fps = manifest.fps ?? 30;
const width = manifest.width ?? 1080;
const height = manifest.height ?? 1920;
for (const [label, value] of Object.entries({fps, width, height})) {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`Manifest ${label} must be a positive integer.`);
  }
}
const modelId = manifest.tts_settings?.model ?? manifest.modelId ?? 'eleven_multilingual_v2';
if (typeof modelId !== 'string' || !modelId.trim()) {
  throw new Error('Manifest TTS model must be a non-empty string.');
}
const voiceSettings = {};
for (const setting of ['stability', 'similarity_boost', 'style']) {
  const value = manifest.tts_settings?.[setting];
  if (value !== undefined) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
      throw new Error(`Manifest TTS setting "${setting}" must be a number from 0 to 1.`);
    }
    voiceSettings[setting] = value;
  }
}
if (manifest.tts_settings?.use_speaker_boost !== undefined) {
  if (typeof manifest.tts_settings.use_speaker_boost !== 'boolean') {
    throw new Error('Manifest TTS setting "use_speaker_boost" must be a boolean.');
  }
  voiceSettings.use_speaker_boost = manifest.tts_settings.use_speaker_boost;
}

const scenes = manifest.scenes.map((scene, index) => {
  if (typeof scene.image !== 'string' || !scene.image.trim()) {
    throw new Error(`Scene ${index + 1} needs an image path.`);
  }
  const narrationField = modelId === 'eleven_v3' ? 'narration_v3' : 'narration_v2';
  const narration = scene.narration ?? scene[narrationField] ?? scene.narration_v3 ?? scene.narration_v2;
  if (typeof narration !== 'string' || !narration.trim()) {
    throw new Error(`Scene ${index + 1} needs narration text.`);
  }
  const imagePath = path.resolve(path.dirname(manifestPath), scene.image);
  if (!existsSync(imagePath)) {
    throw new Error(`Scene ${index + 1} image does not exist: ${imagePath}`);
  }
  const extension = path.extname(imagePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(extension)) {
    throw new Error(`Scene ${index + 1} image must be JPG, PNG, or WebP.`);
  }
  return {id: `scene-${index + 1}`, imagePath, extension, narration: narration.trim()};
});

const topicDirectory = path.join(projectRoot, 'topics', args.topic);
const imagesDirectory = path.join(projectRoot, 'public', 'generated-videos', args.topic);
const audioDirectory = path.join(projectRoot, 'public', 'audio', 'generated-videos', args.topic);
if ([topicDirectory, imagesDirectory, audioDirectory].some((directory) => existsSync(directory))) {
  throw new Error(`Topic or generated assets for "${args.topic}" already exist; choose a new --topic id.`);
}
const compositionId = args.topic.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('');
for (const entry of readdirSync(path.join(projectRoot, 'topics'), {withFileTypes: true})) {
  if (!entry.isDirectory()) {
    continue;
  }
  const existingMetadataPath = path.join(projectRoot, 'topics', entry.name, 'topic.json');
  if (existsSync(existingMetadataPath)) {
    const existingMetadata = JSON.parse(readFileSync(existingMetadataPath, 'utf8'));
    if (existingMetadata.compositionId === compositionId) {
      throw new Error(`Composition id "${compositionId}" is already used by topic "${entry.name}".`);
    }
  }
}

const tempDirectory = path.join(os.tmpdir(), `remotion-video-${process.pid}-${Date.now()}`);
mkdirSync(tempDirectory, {recursive: true});
const generated = [];

try {
  for (const [index, scene] of scenes.entries()) {
    console.log(`Generating narration audio for scene ${index + 1}/${scenes.length}...`);
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {'xi-api-key': apiKey, 'content-type': 'application/json'},
        body: JSON.stringify({
          text: scene.narration,
          model_id: modelId,
          ...(Object.keys(voiceSettings).length > 0 ? {voice_settings: voiceSettings} : {}),
        }),
        signal: AbortSignal.timeout(120_000),
      },
    );
    if (!response.ok) {
      const details = (await response.text()).slice(0, 1000);
      throw new Error(`ElevenLabs request for scene ${index + 1} failed (${response.status}): ${details}`);
    }
    const audio = Buffer.from(await response.arrayBuffer());
    const durationInFrames = Math.max(1, Math.ceil(getMp3DurationSeconds(audio) * fps));
    const imageName = `${scene.id}${scene.extension}`;
    const audioName = `${scene.id}.mp3`;
    const imageRelativePath = `generated-videos/${args.topic}/${imageName}`;
    const audioRelativePath = `audio/generated-videos/${args.topic}/${audioName}`;
    const imageTempPath = path.join(tempDirectory, imageName);
    const audioTempPath = path.join(tempDirectory, audioName);
    copyFileSync(scene.imagePath, imageTempPath);
    writeFileSync(audioTempPath, audio);
    generated.push({
      ...scene,
      durationInFrames,
      imageRelativePath,
      audioRelativePath,
      imageTempPath,
      audioTempPath,
    });
  }

  const totalFrames = generated.reduce((total, scene) => total + scene.durationInFrames, 0);
  const topicMetadata = {
    id: args.topic,
    compositionId,
    title: manifest.title ?? manifest.project ?? args.topic,
    width,
    height,
    fps,
    narration: generated.map((scene, index) => ({
      file: scene.audioRelativePath,
      from: generated.slice(0, index).reduce((total, prior) => total + prior.durationInFrames, 0),
      durationInFrames: scene.durationInFrames,
    })),
  };
  const topicScenes = generated.map((scene) => ({
    id: scene.id,
    durationInFrames: scene.durationInFrames,
    visualKey: 'image',
    image: scene.imageRelativePath,
  }));
  const script = Object.fromEntries(generated.map((scene) => [scene.id, scene.narration]));
  const captions = Object.fromEntries(generated.map((scene) => [scene.id, []]));

  mkdirSync(imagesDirectory, {recursive: true});
  mkdirSync(audioDirectory, {recursive: true});
  mkdirSync(topicDirectory, {recursive: true});
  for (const scene of generated) {
    copyFileSync(scene.imageTempPath, path.join(imagesDirectory, path.basename(scene.imageTempPath)));
    copyFileSync(scene.audioTempPath, path.join(audioDirectory, path.basename(scene.audioTempPath)));
  }
  writeFileSync(path.join(topicDirectory, 'topic.json'), `${JSON.stringify(topicMetadata, null, 2)}\n`);
  writeFileSync(path.join(topicDirectory, 'scenes.json'), `${JSON.stringify(topicScenes, null, 2)}\n`);
  writeFileSync(path.join(topicDirectory, 'script.json'), `${JSON.stringify(script, null, 2)}\n`);
  writeFileSync(path.join(topicDirectory, 'captions.json'), `${JSON.stringify(captions, null, 2)}\n`);
  writeFileSync(
    path.join(topicDirectory, 'topic.tsx'),
    `import captionsJson from './captions.json';
import scenesJson from './scenes.json';
import scriptJson from './script.json';
import topicJson from './topic.json';
import type {SceneDefinition, TopicDefinition} from '../../src/engine/types';

const topic: TopicDefinition = {
  ...topicJson,
  scenes: scenesJson as SceneDefinition[],
  script: scriptJson,
  captions: captionsJson,
  visuals: {},
};

export default topic;
`,
  );
  console.log(`Created "${args.topic}" with ${generated.length} scenes (${(totalFrames / fps).toFixed(2)} seconds).`);

  const output = path.resolve(projectRoot, args.output ?? `out/${args.topic}.mp4`);
  const renderEnvironment = {...process.env};
  delete renderEnvironment.ELEVENLABS_API_KEY;
  delete renderEnvironment.ELEVENLABS_VOICE_ID;
  const result = spawnSync(
    'npm',
    ['run', 'render:topic', '--', '--topic', args.topic, '--output', output],
    {cwd: projectRoot, stdio: 'inherit', env: renderEnvironment},
  );
  if (result.error) {
    throw result.error;
  }
  process.exitCode = result.status ?? 1;
} finally {
  rmSync(tempDirectory, {recursive: true, force: true});
}
