import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {VisualProps} from '../../src/engine/types';
import {scaleBeatSecond, storyboard, type Focus} from './storyboard';

const blue = '#60A5FA';
const green = '#4ADE80';
const orange = '#FDBA74';
const gray = '#CBD5E1';

const pipeline = [
  {id: 'turn', title: 'Turn detection', subtitle: 'Detect the end of speech', budget: 100},
  {id: 'stt', title: 'Speech-to-text', subtitle: 'Stream the transcript', budget: 150},
  {id: 'router', title: 'Router', subtitle: 'Direct reply, RAG, or tool', budget: 300},
  {id: 'agent', title: 'LLM agent', subtitle: 'Form the answer', budget: 150},
  {id: 'tts', title: 'Text-to-speech', subtitle: 'Stream voice to the caller', budget: 100},
] as const;

const knowledge = [
  {id: 'rag', title: 'RAG', subtitle: 'Policies and FAQs'},
  {id: 'tools', title: 'Tools', subtitle: 'Live data and actions'},
  {id: 'handoff', title: 'Human handoff', subtitle: 'Escalate with context'},
] as const;

const connector = {
  height: 22,
  display: 'grid',
  placeItems: 'center',
  color: blue,
  fontSize: 20,
  lineHeight: 1,
};

const panel = (color: string, active: boolean) => ({
  border: `2px solid ${color}${active ? 'DA' : '42'}`,
  background: active ? `linear-gradient(110deg, ${color}26, #13213A)` : '#101B30',
  borderRadius: 18,
  boxShadow: active ? `0 0 24px ${color}32` : undefined,
});

const Tile = ({title, subtitle, color, active}: {
  title: string;
  subtitle: string;
  color: string;
  active: boolean;
}) => (
  <div style={{...panel(color, active), flex: 1, minWidth: 0, padding: '10px 14px'}}>
    <div style={{color, fontWeight: 800, fontSize: 24}}>{title}</div>
    <div style={{fontSize: 19, color: '#E2E8F0', marginTop: 3}}>{subtitle}</div>
  </div>
);

const Row = ({children}: {children: React.ReactNode}) => (
  <div style={{display: 'flex', gap: 12, alignItems: 'stretch'}}>{children}</div>
);

const accentFor = (focus: Focus) => {
  if (['knowledge', 'rag', 'tools', 'handoff'].includes(focus)) return green;
  if (focus === 'safety') return orange;
  if (focus === 'observability') return gray;
  if (focus === 'alternative') return '#C4B5FD';
  return blue;
};

export const ArchitectureVisual = ({scene, durationInFrames}: VisualProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const section = storyboard[scene.id];
  if (!section) throw new Error(`Missing voice-agent storyboard for "${scene.id}".`);

  const beat = section.beats.reduce((active, candidate) =>
    frame >= Math.round(scaleBeatSecond(scene.id, candidate.second, durationInFrames, fps) * fps)
      ? candidate
      : active,
  );
  const focus = beat.focus;
  const overview = focus === 'overview';
  const accent = accentFor(focus);
  const beatFrame =
    frame - Math.round(scaleBeatSecond(scene.id, beat.second, durationInFrames, fps) * fps);
  const detailOpacity = interpolate(beatFrame, [0, 9], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const activeChannel = overview || focus === 'channel';
  const activePipeline = overview || focus === 'pipeline' || focus === 'latency';
  const step = Object.keys(storyboard).indexOf(scene.id) + 1;

  return (
    <div style={{
      position: 'absolute',
      inset: '84px 76px 0',
      color: '#F8FAFC',
      fontFamily: 'Inter, Arial, sans-serif',
    }}>
      <div style={{color: accent, fontSize: 22, letterSpacing: 3, fontWeight: 800}}>
        VOICE AI ARCHITECTURE · {String(step).padStart(2, '0')} / 07
      </div>
      <div style={{height: 6, background: '#263650', borderRadius: 4, marginTop: 16}}>
        <div style={{
          width: `${100 * (frame + 1) / durationInFrames}%`,
          height: '100%',
          background: accent,
          borderRadius: 4,
        }} />
      </div>
      <h1 style={{margin: '25px 0 0', fontSize: 62, lineHeight: 1.02, letterSpacing: -2}}>
        {section.title}
      </h1>

      <div style={{position: 'absolute', top: 232, left: 0, right: 0}}>
        <Row>
          <Tile title="Caller" subtitle="Phone or app" color={blue} active={activeChannel} />
          <div style={{alignSelf: 'center', color: blue, fontSize: 34}}>↔</div>
          <Tile title="Transport" subtitle="SIP or WebRTC" color={blue} active={activeChannel} />
        </Row>

        <div style={connector}>↓</div>
        {pipeline.map((stage, index) => {
          const active = activePipeline || focus === stage.id;
          return (
            <div key={stage.id}>
              <div style={{
                ...panel(blue, active),
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '10px 18px',
                minHeight: 68,
                boxSizing: 'border-box',
              }}>
                <div style={{
                  display: 'grid', placeItems: 'center', width: 44, height: 44,
                  borderRadius: 12, background: active ? blue : '#21334F',
                  color: active ? '#081223' : '#BFDBFE', fontWeight: 900, fontSize: 24,
                }}>
                  {index + 1}
                </div>
                <div style={{fontSize: 29, fontWeight: 800}}>{stage.title}</div>
                <div style={{marginLeft: 'auto', fontSize: 23, color: active ? '#BFDBFE' : '#B3C1D7'}}>
                  {focus === 'latency' ? `${stage.budget} ms` : stage.subtitle}
                </div>
              </div>
              {index < pipeline.length - 1 && <div style={connector}>↓</div>}
            </div>
          );
        })}
        <div style={{marginTop: 11, color: '#BFDBFE', textAlign: 'right', fontSize: 19}}>
          {focus === 'turn' ? '↳ Barge-in stops agent playback' : '↳ Voice returns to the caller'}
        </div>

        <div style={{margin: '22px 0 8px', color: green, fontSize: 19, fontWeight: 800, letterSpacing: 2}}>
          KNOWLEDGE AND ACTIONS
        </div>
        <Row>
          {knowledge.map(({id, title, subtitle}) => (
            <Tile key={id} title={title} subtitle={subtitle} color={green}
              active={overview || focus === 'knowledge' || focus === id} />
          ))}
        </Row>
        <div style={{marginTop: 12}}>
          <Row>
            <Tile title="Safety & compliance" subtitle="Identity · Consent · Payment checks"
              color={orange} active={overview || focus === 'safety'} />
            <Tile title="Observability" subtitle="Latency · Outcomes · Cost"
              color={gray} active={overview || focus === 'observability'} />
          </Row>
        </div>
      </div>

      <div style={{
        ...panel(accent, true), position: 'absolute', top: 1100, left: 0, right: 0,
        minHeight: 149, boxSizing: 'border-box', padding: '22px 27px', opacity: detailOpacity,
      }}>
        <div style={{fontSize: 32, fontWeight: 900, color: accent}}>{beat.label}</div>
        <div style={{fontSize: 26, lineHeight: 1.3, marginTop: 7}}>{beat.detail}</div>
      </div>
    </div>
  );
};
