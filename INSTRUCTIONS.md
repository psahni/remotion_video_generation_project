# Vertical vs Horizontal Scaling — Remotion Project Instructions

## Target output
- Project: `tech-scaling-video`
- Composition ID: `ScalingVideo`
- Resolution: 1080 × 1920
- Framerate: 30 FPS
- Duration: 900 frames / 30 seconds
- Output: `out/scaling.mp4` (H.264)

## Prerequisites
Install Node.js (current LTS recommended), npm, and Git. Verify:

```bash
node --version
npm --version
git --version
```

## 1. Generate the Remotion project
In a terminal outside the intended project directory:

```bash
npx create-video@latest --yes --blank tech-scaling-video
cd tech-scaling-video
npm install
```

The scaffold installs the Remotion project dependencies; avoid installing different versions of `remotion` and `@remotion/*` packages. To use AI coding skills, run `npx remotion skills add` if supported by the installed CLI or use the official Remotion skills setup instructions.

## 2. Ask the coding agent to generate the video
Open `tech-scaling-video` in Cursor, VS Code with an agent, Claude Code, or Codex. Paste the project-generation master prompt supplied in the ChatGPT conversation. Request that it create all components, SVGs, captions, package scripts, and this documentation file.

If an AI agent has already scaffolded the project, do not scaffold it a second time.

## 3. Verify files and scripts
Ensure that `src/Root.tsx` registers a `Composition` with ID `ScalingVideo`, duration `900`, fps `30`, width `1080`, and height `1920`. Verify the package's existing Remotion entrypoint points to `src/index.ts` (or the generated entrypoint).

The project already defines these scripts in `package.json`:

```bash
npm run dev
npm run build
npm run render:topic -- --topic scaling
npm run render:scene5
npm run render:frames
npm run typecheck
npm run validate
```

`render:topic` accepts a topic ID and optional scene/output arguments. Keep the existing scripts when adding new ones.

## 4. Preview

```bash
npm run dev
```

Open the local URL printed by Remotion Studio, choose `ScalingVideo`, and scrub through the timeline. Check frames 0, 119, 120, 299, 300, 479, 480, 719, 720, and 899.

## 5. Verify Scene 5

```bash
npm run render:scene5
npm run render:frames
```

The comparison scene runs from global frames 720 through 899 (6 seconds). Check that blue and green cards have equal sizes, server illustrations are bottom aligned, all content fits inside the panels, and subtitles remain below the panels without collisions.

## 6. Render the full video

```bash
npm run render:topic -- --topic scaling
```

Expected result: `out/scaling.mp4`. The render includes the topic's narration clips when their audio files are present in `public/audio/`; if a clip is missing, it is skipped. Exports use H.264 video, AAC audio at 48 kHz, and `yuv420p` pixel format for broad YouTube and Instagram compatibility.

To run validation separately:

```bash
npm run validate
```

## 7. Add audio
The scaling topic uses five optional audio clips in `public/audio/`. Their timeline start frames are configured in `topics/scaling/topic.json` under `narration`. Files are included only when present; a missing clip does not prevent rendering. The example's narration starts are staggered after each preceding clip's duration, with a short pause, so speech does not overlap. This can make narration drift across visual scene boundaries.

Each narration clip has a public-relative `file` path and `from` frame. Audio plays to its natural end or the end of the video, whichever comes first. It is not cut to the scene duration and may overlap another clip if its placement/length does so. Add `durationInFrames` only when intentionally trimming a clip. Adjust `from` values if the recorded audio timing should change.

A single optional voiceover can alternatively be configured with `"audioPath": "audio/voiceover.mp3"` in `topic.json`.

For topics that build narration clips dynamically, list their public-relative files in `topic.json` under `"audioFiles"`. The preview and render scripts use this list to make those files available to the narration component.

Frame-based captions are *not* automatically aligned to speech. Adjust caption cue starts/durations separately if the voiceover changes.

## 8. Edit content
- Scaling topic script: `topics/scaling/script.ts`.
- Scaling topic captions and subtitle timing: `topics/scaling/captions.ts`.
- Scaling scene order, durations, and visual settings: `topics/scaling/scenes.json`.
- Scaling topic visuals and comparison layout: `topics/scaling/visuals.tsx`.
- Scaling topic metadata and narration clip timing: `topics/scaling/topic.json`.
- Shared rendering components, transitions, subtitles, and reusable server animations: `src/engine/`.
- Shared colors: `src/engine/styles/theme.ts`.
- Topic discovery and composition registration: `src/Root.tsx`.

To change scene durations, edit that topic's `scenes.json` and update its caption timings as needed. The engine derives the composition duration from the scene list. Frame times are calculated as `seconds × 30`.

## 9. Troubleshooting
- **`remotion: command not found`:** Run `npm install`, then use `npx remotion ...` or npm scripts.
- **Blank composition:** Confirm `src/index.ts` registers the root, the root exports a Composition, and the ID is `ScalingVideo`.
- **Missing SVG / visuals:** Verify imports and SVG `viewBox` sizes; prefer inline JSX SVGs for animation.
- **Scene 5 clipping:** Verify panel widths, internal padding, font sizes, and `overflow` behavior at global frames 750, 810, and 880.
- **Missing audio:** Avoid mounting an audio element until its file exists and audio mode is enabled.
- **Rendering or Chromium errors:** Follow the current Remotion system dependency and browser troubleshooting documentation for your OS.
- **Version mismatch:** Ensure the installed `remotion` and all `@remotion/*` packages have matching versions.

## 10. Final QA checklist
- [ ] TypeScript check succeeds.
- [ ] Composition is 1080 × 1920 at 30 FPS.
- [ ] Five scenes cover exactly frames 0–899.
- [ ] Server growth and staggered fleet animations are visible.
- [ ] Scene 5 panels and text are aligned with no clipping.
- [ ] Captions are legible and do not overlap major visuals.
- [ ] MP4 renders successfully and plays to the end.

## 11. Create a video from images and narration
Create a JSON manifest with one image and narration string per scene. Image paths are relative to the manifest:

```json
{
  "title": "My video",
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "scenes": [
    {"image": "images/intro.png", "narration": "Welcome to this video."},
    {"image": "images/details.jpg", "narration": "Here is the next part."}
  ]
}
```

Set `ELEVENLABS_API_KEY` in the project `.env` and run:

```bash
npm run create:video -- --input path/to/manifest.json --topic my-video --voice-id YOUR_ELEVENLABS_VOICE_ID
```

`--voice-id` can instead be set with `ELEVENLABS_VOICE_ID`; provide either the voice ID or its ElevenLabs voice-library URL. The command uses ElevenLabs' `eleven_multilingual_v2` model by default; set an optional `"modelId"` in the manifest to select another model. Width, height, and FPS default to 1080, 1920, and 30. Each generated MP3 is measured from its MP3 frames and its scene gets enough whole frames to contain that audio; the next scene begins exactly at that boundary. The source images are copied into `public/generated-videos/<topic>/`, audio into `public/audio/generated-videos/<topic>/`, and a reusable topic is created under `topics/<topic>/`. The final MP4 is rendered to `out/<topic>.mp4` by default; pass `--output path/to/video.mp4` to choose another location. Generated videos, audio, and copied images in these default output locations are excluded by `.gitignore` and remain local.

Use a new topic ID for each generated video. The command does not overwrite existing topics or generated assets. If rendering fails after topic creation, the topic and generated assets remain available to rerender with `npm run render:topic -- --topic my-video`.

To package existing rendered videos and generated narration audio, run `npm run zip:media`. The archive is saved as `out/generated-media.zip` and contains videos from `out/` plus audio from `public/audio/generated-videos/`. Pass `--output path/to/archive.zip` to choose another archive path.

## 12. Add word-highlight subtitles
For word-level subtitles on a generated topic, enable the `forced_alignment` permission for the ElevenLabs API key, then run:

```bash
npm run align:captions -- --topic my-video
npm run render:topic -- --topic my-video --output out/my-video-subtitled.mp4
```

The alignment command sends each existing narration clip and its transcript to ElevenLabs Forced Alignment; it does not regenerate the speech. Captions are grouped into short phrases, and the currently spoken word is highlighted yellow. Timing data is saved in `topics/<topic-id>/captions.json`.

The shared subtitle style is set in `src/engine/components/Caption.tsx`: 42px bold text, 1.3 line height, and a 112px minimum bar height positioned 1470px from the top of a 1080x1920 frame. This raised position keeps subtitles clear of YouTube's lower controls; these values are the project default for future topics.

Image scenes zoom from 1.0x to 1.22x during the first half of the scene, then hold that framing. Set `imageZoom` on a scene in `scenes.json` to adjust its ending scale.

Official docs: https://www.remotion.dev/docs/ and https://www.remotiondocs.com/docs/cli/create-video

## Future video pipeline instructions

For future short-to-medium storytelling video requests, use these defaults unless the user explicitly changes them:

1. Return or create a valid `manifest.json` with `project`, `output_format: "mp4"`, `video_settings`, `tts_settings`, and a `scenes` array.
2. Every scene must include `scene_number`, `title`, `image`, `tone`, `narration_v3`, and `narration_v2`.
3. Preserve the exact image filenames in their stated sequence. Clearly flag a truncated filename, such as `3_Man_visualizing_tropical_beach_i…_a4e97675.png`, rather than guessing the missing portion.
4. Generate one continuous narration audio track and alignment when producing a video. Do not split the voiceover into independent scene audio files. Preserve consistent pitch, breath, and room tone across scene cuts.
5. Derive scene image windows from word or character timestamps: the first scene starts at `0.0`, every scene's end equals the next scene's start, and the final scene ends at the total audio duration. Avoid gaps and overlaps.
6. Keep narration natural across scene transitions. Avoid abrupt emotion swings or jarring tag jumps at scene starts. Use punctuation such as ellipses and em dashes for pacing, and spell out numbers and dates in words.
7. Default `tts_settings`:
   - `model`: `eleven_v3`
   - `stability`: `0.48`
   - `similarity_boost`: `0.78`
   - `style`: `0.12`
   - `use_request_stitching`: `true`
   - `generation_mode`: `single_pass_with_timestamps`
8. Default `video_settings`:
   - container: `mp4`
   - codecs: `libx264` and `aac`
   - pixel format: `yuv420p`
   - frame rate: `30`
   - resolution: `1920x1080`
   - normalize, scale, and pad source images to the target resolution
   - visual crossfade: `0.4s`
   - audio overlap: `0.3s`
   - continuous ambient bed: `-28 dB`
9. Cache TTS audio and alignment data by a hash of the combined script and effective settings. Reuse cache entries during visual or timing tweaks without redundant generation.
