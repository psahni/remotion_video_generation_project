# Vertical vs Horizontal Scaling — Remotion Project Instructions

## Target output
- Project: `tech-scaling-video`
- Composition ID: `ScalingVideo`
- Resolution: 1080 × 1920
- Framerate: 30 FPS
- Duration: 900 frames / 30 seconds
- Output: `out/scaling-video.mp4` (H.264)

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

In `package.json`, include working scripts equivalent to:

```json
{
  "scripts": {
    "dev": "remotion studio",
    "build": "remotion render ScalingVideo out/scaling-video.mp4 --codec h264 --crf 18",
    "render:scene5": "remotion render ScalingVideo out/scene5.mp4 --frames=720-899 --codec h264",
    "typecheck": "tsc --noEmit",
    "render:frames": "remotion still ScalingVideo out/scene5-preview.png --frame=810"
  }
}
```

Merge these into the scaffold-generated scripts without deleting necessary existing entries. Add a `validate` script that executes the project's actual implemented timeline validator and TypeScript check. Use `npx remotion` directly if scripts were not set up.

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

## 6. Render full video

```bash
npm run typecheck
npm run build
```

Expected result: `out/scaling-video.mp4`.

To render manually without package scripts:

```bash
npx remotion render ScalingVideo out/scaling-video.mp4 --codec h264 --crf 18
```

## 7. Add audio
The scaling topic uses five optional audio clips in `public/audio/`. Their timeline start frames are configured in `topics/scaling/topic.json` under `narration`. Files are included only when present; a missing clip does not prevent rendering. The example's narration starts are staggered after each preceding clip's duration, with a short pause, so speech does not overlap. This can make narration drift across visual scene boundaries.

Each narration clip has a public-relative `file` path and `from` frame. Audio plays to its natural end or the end of the video, whichever comes first. It is not cut to the scene duration and may overlap another clip if its placement/length does so. Add `durationInFrames` only when intentionally trimming a clip. Adjust `from` values if the recorded audio timing should change.

A single optional voiceover can alternatively be configured with `"audioPath": "audio/voiceover.mp3"` in `topic.json`.

Frame-based captions are *not* automatically aligned to speech. Adjust caption cue starts/durations separately if the voiceover changes.

## 8. Edit content
- Narration and scene definitions: `src/data/script.ts`.
- Subtitle timing: `src/data/captions.ts`.
- Colors: `src/styles/theme.ts`.
- Illustrations: `src/components/ServerSVG.tsx`, `VerticalServer.tsx`, `HorizontalFleet.tsx`.
- Comparison layout: `src/scenes/OutroScene.tsx`.
- Overall composition: `src/ScalingVideo.tsx` and `src/Root.tsx`.

To change duration, update scene timing, composition duration, and subtitle cues together. Frame times are calculated as `seconds × 30`.

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
