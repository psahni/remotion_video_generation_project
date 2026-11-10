export type Focus =
  | 'overview' | 'channel' | 'pipeline' | 'turn' | 'stt' | 'router'
  | 'agent' | 'tts' | 'latency' | 'knowledge' | 'rag' | 'tools'
  | 'handoff' | 'safety' | 'observability' | 'alternative';

export type Beat = {
  second: number;
  focus: Focus;
  label: string;
  detail: string;
  lines: string[];
};

export type StoryScene = {title: string; durationInSeconds: number; beats: Beat[]};

export const storyboard: Record<string, StoryScene> = {
  hook: {
    title: 'How a Real-Time Voice AI Agent Works',
    durationInSeconds: 20,
    beats: [
      {
        second: 0, focus: 'overview', label: 'One call, several systems',
        detail: 'Follow a bank call from the first word to the spoken reply.',
        lines: [
          "You call a bank's AI agent.",
          'It answers in under a second, understands you,',
          'checks your balance and even handles interruptions.',
          'How? Let me break down this architecture in under five minutes.',
        ],
      },
    ],
  },
  channel: {
    title: 'How audio reaches the agent',
    durationInSeconds: 30,
    beats: [
      {
        second: 0, focus: 'channel', label: 'Caller ↔ transport',
        detail: 'Phone calls use SIP. Apps can use WebRTC.',
        lines: [
          'Everything starts with the caller, on a phone or in an app.',
          'Audio travels over SIP for phone calls or WebRTC for apps,',
          'using providers like Exotel, Plivo or LiveKit.',
        ],
      },
      {
        second: 20, focus: 'channel', label: 'Echo cancellation',
        detail: 'The system removes the returning echo of its own audio.',
        lines: ['Echo cancellation keeps the agent from hearing itself.'],
      },
    ],
  },
  pipeline: {
    title: 'The five-stage voice pipeline',
    durationInSeconds: 90,
    beats: [
      {
        second: 0, focus: 'pipeline', label: 'The real-time path',
        detail: 'Five stages turn a caller’s speech into a spoken answer.',
        lines: ['The heart of the system is a real-time pipeline with five stages.'],
      },
      {
        second: 6, focus: 'turn', label: '01 · Turn detection',
        detail: 'Detect the end of a turn. Stop playback when the caller interrupts.',
        lines: [
          'One, turn detection.',
          'A voice activity detector like Silero, plus an end-of-turn model,',
          "decides when you've actually finished speaking, not just paused.",
          'This is also how barge-in works:',
          'if you interrupt, the agent stops talking immediately.',
        ],
      },
      {
        second: 24, focus: 'stt', label: '02 · Speech-to-text',
        detail: 'Audio in. A streaming transcript out.',
        lines: [
          'Two, speech-to-text.',
          'Streaming STT like Sarvam, Deepgram or ElevenLabs',
          "converts your voice to text while you're still speaking.",
        ],
      },
      {
        second: 34, focus: 'router', label: '03 · Router',
        detail: 'Choose a direct reply, a knowledge lookup, or a tool.',
        lines: [
          'Three, the router. A quick decision step.',
          'A greeting? Skip ahead. A policy question? Go to RAG.',
          'Needs live data? Call a tool.',
        ],
      },
      {
        second: 46, focus: 'agent', label: '04 · LLM agent',
        detail: 'Use the conversation and any tool results to form an answer.',
        lines: [
          'Four, the LLM agent.',
          'It reasons, streams its answer and calls tools,',
          'using a framework like LangGraph.',
        ],
      },
      {
        second: 56, focus: 'tts', label: '05 · Text-to-speech',
        detail: 'Stream the voice back through the transport to the caller.',
        lines: [
          'Five, text-to-speech.',
          'Cartesia or ElevenLabs turns the text into natural voice,',
          "streamed as it's generated.",
          'That voice travels back through the same transport to the caller,',
          'and the loop repeats for every turn.',
        ],
      },
      {
        second: 72, focus: 'latency', label: 'Example latency budget',
        detail: 'Turn 100 · STT 150 · Route 300 · LLM 150 · TTS 100 ms',
        lines: [
          'The whole chain must finish in under 800 milliseconds.',
          'Each stage gets a small slice: about 100 ms for turn detection,',
          '150 for speech-to-text, 300 for the router,',
          '150 for the LLM and 100 for text-to-speech.',
          'Go slower and the conversation feels robotic.',
        ],
      },
    ],
  },
  'knowledge-actions': {
    title: 'Where the answers come from',
    durationInSeconds: 60,
    beats: [
      {
        second: 0, focus: 'knowledge', label: 'Knowledge and actions',
        detail: 'Use stored knowledge for policies and tools for live data.',
        lines: ['Now, where does the agent get its answers? Two places.'],
      },
      {
        second: 5, focus: 'rag', label: 'RAG · Find relevant knowledge',
        detail: 'Prepare searchable document chunks before the call. Retrieve them during it.',
        lines: [
          'First, static knowledge like policies and FAQs.',
          'Before any call happens, your documents are split into chunks',
          'and converted into embeddings, so searching them takes milliseconds.',
          'During the call, RAG with a database like Qdrant',
          'fetches the top three to five relevant chunks before the answer is generated.',
        ],
      },
      {
        second: 25, focus: 'tools', label: 'Tools · Fetch live data',
        detail: 'Agent requests a tool → code runs it → result returns to the agent.',
        lines: [
          'Second, live data like your balance, EMI or bookings.',
          'Here the agent works in three steps:',
          'the LLM asks for a tool, your code runs it,',
          'and the result goes back to the LLM to form the answer.',
          'While the tool runs, the agent says a short filler line',
          'like “Let me check that for you,” so there’s no dead silence.',
        ],
      },
      {
        second: 50, focus: 'handoff', label: 'Human handoff',
        detail: 'Transfer the caller and the conversation context.',
        lines: [
          'If the situation gets too complex, the agent hands off to a human,',
          'with the full conversation context.',
        ],
      },
    ],
  },
  safety: {
    title: 'Safety and compliance',
    durationInSeconds: 35,
    beats: [
      {
        second: 0, focus: 'safety', label: 'Verify the caller',
        detail: 'OTP verification · Customer ID from the session',
        lines: [
          'Voice agents deal with money and personal data, so guardrails matter.',
          'Verify the caller with an OTP.',
          'Take the customer ID from the session, never from the LLM.',
        ],
      },
      {
        second: 18, focus: 'safety', label: 'Protect the customer',
        detail: 'Payment confirmation · Consent · TRAI and DND · PII protection',
        lines: [
          'Confirm before any payment.',
          'And in India, respect consent, TRAI and DND rules, and protect PII.',
        ],
      },
    ],
  },
  observability: {
    title: 'Measure each conversation',
    durationInSeconds: 25,
    beats: [
      {
        second: 0, focus: 'observability', label: 'Observability',
        detail: 'Latency by stage · Transcripts · Task success · Cost per minute',
        lines: [
          'Finally, measure everything: latency per stage,',
          'transcripts, task success and cost per minute.',
          "If you can't measure it, you can't improve it.",
        ],
      },
    ],
  },
  recap: {
    title: 'From caller to spoken answer',
    durationInSeconds: 30,
    beats: [
      {
        second: 0, focus: 'overview', label: 'Hear → understand → decide → answer → speak',
        detail: 'A layered pipeline with guardrails and monitoring across the call.',
        lines: [
          'So the flow is: hear, understand, decide, answer, speak,',
          'all in under a second, while staying safe and measured.',
        ],
      },
      {
        second: 12, focus: 'alternative', label: 'Alternative · Speech-to-speech',
        detail: 'OpenAI Realtime and Gemini Live are examples of a direct voice approach.',
        lines: [
          "There's also a simpler alternative:",
          'speech-to-speech models like OpenAI Realtime or Gemini Live,',
          'which skip the pipeline.',
          'But this layered approach gives you more control and lets you swap any part.',
        ],
      },
    ],
  },
};

export const scaleBeatSecond = (
  sceneId: string,
  second: number,
  durationInFrames: number,
  fps: number,
) => {
  const scene = storyboard[sceneId];
  if (!scene) {
    throw new Error(`Missing voice-agent storyboard for "${sceneId}".`);
  }
  return second * (durationInFrames / fps / scene.durationInSeconds);
};
