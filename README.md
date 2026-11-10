# Tech Scaling Video

A 30-second Remotion short explaining vertical and horizontal scaling, built on a reusable topic-based video engine.

## Quick start

```sh
npm install
npm run dev
```

Validate the project with `npm run validate`. Render the example as `out/scaling.mp4` with `npm run render:topic -- --topic scaling`. Add future topics under `topics/<topic-id>/`; see [INSTRUCTIONS.md](./INSTRUCTIONS.md) for the topic file contract, audio, previews, sample stills, and rendering details.

## Architecture

- `src/engine/` contains reusable Remotion composition logic, transitions, subtitles, shared components, types, and theme.
- `topics/scaling/` contains the example video's narration, caption timings, scene durations, visual configuration, and SVG/React scene visuals.
- The engine discovers `topics/*/topic.tsx` automatically; adding a topic does not require editing the renderer.
