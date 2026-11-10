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

Expected result: `out/scaling.mp4`. The render includes the topic's narration clips when their audio files are present in `public/audio/`; if a clip is missing, it is skipped.

To run validation separately:

```bash
npm run validate
```

## 7. Add audio
The scaling topic uses five optional audio clips in `public/audio/`. Their timeline start frames are configured in `topics/scaling/topic.json` under `narration`. Files are included only when present; a missing clip does not prevent rendering. The example's narration starts are staggered after each preceding clip's duration, with a short pause, so speech does not overlap. This can make narration drift across visual scene boundaries.

Each narration clip has a public-relative `file` path and `from` frame. Audio plays to its natural end or the end of the video, whichever comes first. It is not cut to the scene duration and may overlap another clip if its placement/length does so. Add `durationInFrames` only when intentionally trimming a clip. Adjust `from` values if the recorded audio timing should change.

A single optional voiceover can alternatively be configured with `"audioPath": "audio/voiceover.mp3"` in `topic.json`.

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

Official docs: https://www.remotion.dev/docs/ and https://www.remotiondocs.com/docs/cli/create-video
