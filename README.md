# Tech Scaling Video

A 30-second Remotion short explaining vertical and horizontal scaling, built on a reusable topic-based video engine.

## Quick start

```sh
npm install
npm run dev
```

Validate the project with `npm run validate`. Render the example as `out/scaling.mp4` with `npm run render:topic -- --topic scaling`. Add future topics under `topics/<topic-id>/`; see [INSTRUCTIONS.md](./INSTRUCTIONS.md) for the topic file contract, audio, previews, sample stills, and rendering details.

Create a video from scene images and narration with `npm run create:video -- --input path/to/manifest.json --topic my-video --voice-id YOUR_ELEVENLABS_VOICE_ID`. Put `ELEVENLABS_API_KEY` and optionally `ELEVENLABS_VOICE_ID` in the project `.env`; the voice setting accepts either a voice ID or a voice-library URL. The command generates one ElevenLabs MP3 per scene, sets scene durations from the audio, and renders `out/my-video.mp4`. See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for the manifest format and options.

Add word-timed subtitles to a generated topic with `npm run align:captions -- --topic my-video`, then render it again. The active spoken word is highlighted yellow; alignment requires the API key's `forced_alignment` permission.

Bundle rendered videos and generated narration audio with `npm run zip:media`. This creates `out/generated-media.zip` with videos from `out/` and audio from `public/audio/generated-videos/`. Choose another archive path with `npm run zip:media -- --output path/to/archive.zip`.

## Architecture

- `src/engine/` contains reusable Remotion composition logic, transitions, subtitles, shared components, types, and theme.
- `topics/scaling/` contains the example video's narration, caption timings, scene durations, visual configuration, and SVG/React scene visuals.
- The engine discovers `topics/*/topic.tsx` automatically; adding a topic does not require editing the renderer.
