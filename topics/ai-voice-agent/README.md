# How a Real-Time Voice AI Agent Actually Works

The 1080 × 1920 composition follows the supplied 4:50 outline at 30 fps. Its boxes and highlights are drawn in Remotion. Choose `AIVoiceAgent` in Studio after running `npm run dev`.

## Record the narration

Use the `lines` in `storyboard.ts` as the recording script. Read each scene's lines continuously and save one MP3 per scene under `public/audio/ai-voice-agent/`.

| Timeline | Filename |
| --- | --- |
| 0:00–0:20 | `01-hook.mp3` |
| 0:20–0:50 | `02-channel.mp3` |
| 0:50–2:20 | `03-pipeline.mp3` |
| 2:20–3:20 | `04-knowledge-actions.mp3` |
| 3:20–3:55 | `05-safety.mp3` |
| 3:55–4:20 | `06-observability.mp3` |
| 4:20–4:50 | `07-recap.mp3` |

The preview can run silently while the MP3s are being prepared. Restart Studio after adding clips so it picks them up. The listed times are the first-pass edit. Listen to the recordings before exporting. Update the scene lengths in `scenes.json` and the narration positions and slot lengths in `topic.json` together if the recording needs more or less time. A slot cuts off any audio past its end.

The `second` on each storyboard beat is measured from the start of its scene. It sets both the highlight and the first caption in that beat. The other captions within the beat use approximate word-count timing until the recording is available. Scrub through each beat against the finished voiceover before exporting.

## Render

- Full video — `npm run render:topic -- --topic ai-voice-agent`
- Pipeline preview — `npm run render:topic -- --topic ai-voice-agent --scene pipeline --output out/ai-voice-agent-pipeline.mp4`
- Sample stills — `node scripts/render-frames.mjs --topic ai-voice-agent --frames 90,720,1980,4980,6120,7170,7950`

## Hindi version

The Hindi composition uses the eight clips in `public/audio/ai-voice-agent/hindi/` in the same order as the English narration. It keeps the original English on-screen text and captions while using Hindi narration; scene and clip boundaries are set to the measured audio durations with no intentional pauses between clips.

- Full video — `npm run render:topic -- --topic ai-voice-agent-hindi --output out/ai-voice-agent-hindi.mp4`
