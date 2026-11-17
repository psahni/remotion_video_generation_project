import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CSSProperties, ReactNode} from 'react';
import {getVisualNumber} from '../../src/engine/types';
import type {VisualProps} from '../../src/engine/types';

type HookBeatId = 'hire' | 'repeat' | 'claude-code' | 'memory';

const hookBeats: {id: HookBeatId; startFrame: number}[] = [
  {id: 'hire', startFrame: 0},
  {id: 'repeat', startFrame: 84},
  {id: 'claude-code', startFrame: 219},
  {id: 'memory', startFrame: 363},
];

export const HookVisual = ({durationInFrames, scene}: VisualProps) => {
  const speedFactor = getVisualNumber(scene, 'speedFactor', 1);
  const frame = useCurrentFrame() * speedFactor;
  const visualDurationInFrames = durationInFrames * speedFactor;
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        color: '#F8FAFC',
        fontFamily: 'Inter, Arial, sans-serif',
        background:
          'radial-gradient(ellipse at 50% 45%, rgba(32, 63, 107, 0.28) 0%, rgba(8, 14, 30, 0) 58%)',
      }}
    >
      {hookBeats.map((beat, index) => {
        const endFrame = hookBeats[index + 1]?.startFrame ?? visualDurationInFrames;
        const fadeFrames = Math.min(10, Math.floor((endFrame - beat.startFrame) / 4));
        const opacity = interpolate(
          frame,
          [
            beat.startFrame,
            beat.startFrame + fadeFrames,
            endFrame - fadeFrames,
            endFrame,
          ],
          [0, 1, 1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        );
        const localFrame = Math.max(0, frame - beat.startFrame);
        const entrance = spring({
          frame: localFrame,
          fps,
          config: {damping: 18, stiffness: 90},
          durationInFrames: 22,
        });

        return (
          <div
            key={beat.id}
            style={{
              position: 'absolute',
              inset: 0,
              opacity,
              transform: `scale(${interpolate(entrance, [0, 1], [0.97, 1])})`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 120,
                right: 72,
                bottom: 120,
                left: 72,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <HookBeatContent id={beat.id} frame={localFrame} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
const HookBeatContent = ({id, frame}: {id: HookBeatId; frame: number}) => {
  if (id === 'hire') {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 56}}>
          <ProfileCard initials="YOU" label="Developer" accent="#60A5FA" />
          <div style={{color: '#64748B', fontSize: 48, fontWeight: 500}}>→</div>
          <ProfileCard initials="AI" label="Assistant" accent="#A78BFA" />
      </div>
    );
  }

  if (id === 'repeat') {
    const instructions = ['Don’t edit this file', 'Run tests this way', 'Use 2 spaces'];
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
        {instructions.map((instruction, index) => {
          const itemOpacity = interpolate(
            frame,
            [12 + index * 18, 22 + index * 18],
            [0, 1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
          );
          return (
            <div
              key={instruction}
              style={{
                padding: '22px 28px',
                borderLeft: '4px solid #60A5FA',
                background: 'rgba(16, 27, 48, 0.75)',
                color: '#E2E8F0',
                fontSize: 32,
                fontWeight: 750,
                opacity: itemOpacity,
                transform: `translateY(${interpolate(itemOpacity, [0, 1], [12, 0])}px)`,
              }}
            >
              {instruction}
            </div>
          );
        })}
      </div>
    );
  }

  if (id === 'claude-code') {
    const codeOpacity = interpolate(frame, [45, 55], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <div
        style={{
          width: '100%',
          maxWidth: 760,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 18,
            borderBottom: '1px solid #334155',
            color: '#94A3B8',
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          <span style={{opacity: codeOpacity}}>CLAUDE CODE</span>
          <span style={{color: '#FBBF24', fontSize: 30}}>↻</span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 24}}>
          {['Don’t edit this file', 'Run tests this way', 'Use 2 spaces'].map((instruction) => (
            <div
              key={instruction}
              style={{
                padding: '20px 24px',
                borderLeft: '4px solid #60A5FA',
                background: 'rgba(16, 27, 48, 0.75)',
                color: '#E2E8F0',
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              {instruction}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id === 'memory') {
    const activeChat = Math.floor(frame / 60) % 2;
    const memoryOpacity = interpolate(frame, [252, 270], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 24, width: '100%'}}>
          {['CHAT 01', 'CHAT 02'].map((chat, index) => (
            <div
              key={chat}
              style={{
                flex: 1,
                minHeight: 160,
                padding: '24px 18px',
                borderBottom: `3px solid ${activeChat === index ? '#60A5FA' : '#334155'}`,
                borderRadius: 22,
                background: 'rgba(16, 27, 48, 0.75)',
                textAlign: 'center',
                opacity: activeChat === index ? 1 : 0.65,
              }}
            >
              <div style={{color: '#60A5FA', fontSize: 21, fontWeight: 900}}>{chat}</div>
              <div style={{marginTop: 28, color: '#CBD5E1', fontSize: 24, fontWeight: 700}}>
                FILE · TESTS · STYLE
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            color: '#60A5FA',
            fontSize: 40,
            fontWeight: 600,
            lineHeight: 1,
            opacity: memoryOpacity,
            transform: `translateY(${interpolate(memoryOpacity, [0, 1], [10, 0])}px)`,
          }}
        >
          ↓
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            opacity: memoryOpacity,
          }}
        >
          <span style={{color: '#60A5FA', fontSize: 32}}>▤</span>
          <span style={{color: '#F8FAFC', fontSize: 28, fontWeight: 800}}>CLAUDE MEMORY</span>
        </div>
      </div>
    );
  }
};

const ProfileCard = ({initials, label, accent}: {initials: string; label: string; accent: string}) => (
  <div
    style={{
      width: 240,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18,
    }}
  >
    <div
      style={{
        width: 140,
        height: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: `3px solid ${accent}`,
        background: 'rgba(16, 27, 48, 0.75)',
        color: accent,
        fontSize: 40,
        fontWeight: 900,
      }}
    >
      {initials}
    </div>
    <div style={{color: '#CBD5E1', fontSize: 28, fontWeight: 700}}>{label}</div>
  </div>
);

type MemoryTypeBeatId = 'overview' | 'handbook' | 'auto-memory' | 'together';

const memoryTypeBeats: {id: MemoryTypeBeatId; startFrame: number}[] = [
  {id: 'overview', startFrame: 0},
  {id: 'handbook', startFrame: 123},
  {id: 'auto-memory', startFrame: 269},
  {id: 'together', startFrame: 600},
];

export const MemoryTypesVisual = ({durationInFrames, scene}: VisualProps) => {
  const speedFactor = getVisualNumber(scene, 'speedFactor', 1);
  const frame = useCurrentFrame() * speedFactor;
  const visualDurationInFrames = durationInFrames * speedFactor;

  return (
    <AbsoluteFill
      style={{
        color: '#F8FAFC',
        fontFamily: 'Inter, Arial, sans-serif',
        background:
          'radial-gradient(ellipse at 50% 45%, rgba(32, 63, 107, 0.22) 0%, rgba(8, 14, 30, 0) 58%)',
      }}
    >
      {memoryTypeBeats.map((beat, index) => {
        const endFrame = memoryTypeBeats[index + 1]?.startFrame ?? visualDurationInFrames;
        const fadeFrames = Math.min(8, Math.floor((endFrame - beat.startFrame) / 4));
        const opacity = interpolate(
          frame,
          [beat.startFrame, beat.startFrame + fadeFrames, endFrame - fadeFrames, endFrame],
          [0, 1, 1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        );
        const localFrame = Math.max(0, frame - beat.startFrame);

        return (
          <div
            key={beat.id}
            style={{position: 'absolute', inset: 0, opacity}}
          >
            <div
              style={{
                position: 'absolute',
                top: 120,
                right: 72,
                bottom: 120,
                left: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MemoryTypeBeatContent id={beat.id} frame={localFrame} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const MemoryTypeBeatContent = ({id, frame}: {id: MemoryTypeBeatId; frame: number}) => {
  if (id === 'overview') {
    return (
      <div style={{display: 'flex', justifyContent: 'center', gap: 24, width: '100%'}}>
        <MemorySourceCard title="CLAUDE.md" detail="YOU WRITE" accent="#60A5FA" />
        <MemorySourceCard title="AUTO MEMORY" detail="CLAUDE LEARNS" accent="#A78BFA" />
      </div>
    );
  }

  if (id === 'handbook') {
    const rules = ['Build steps', 'Test commands', 'Code style'];
    return (
      <div
        style={{
          width: '100%',
          maxWidth: 680,
          margin: '0 auto',
          padding: 32,
          border: '1px solid #334155',
          borderRadius: 22,
          background: 'rgba(16, 27, 48, 0.78)',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 26}}>
          <FileMark accent="#60A5FA" />
          <div style={{color: '#F8FAFC', fontSize: 32, fontWeight: 800}}>CLAUDE.md</div>
        </div>
        {rules.map((rule, index) => {
          const opacity = interpolate(frame, [12 + index * 18, 22 + index * 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={rule}
              style={{
                marginTop: 14,
                padding: '18px 22px',
                borderLeft: '3px solid #60A5FA',
                color: '#CBD5E1',
                background: '#0F172A',
                fontSize: 27,
                opacity,
              }}
            >
              {rule}
            </div>
          );
        })}
      </div>
    );
  }

  if (id === 'auto-memory') {
    const notesOpacity = interpolate(frame, [78, 96], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%'}}>
        <div
          style={{
            width: '100%',
            maxWidth: 640,
            padding: '24px 28px',
            border: '1px solid #334155',
            borderRadius: 18,
            background: '#101B30',
            color: '#CBD5E1',
            fontSize: 28,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          WORK SESSION
        </div>
        <div style={{color: '#64748B', fontSize: 36}}>↓</div>
        <div
          style={{
            width: '100%',
            maxWidth: 640,
            padding: '28px',
            borderLeft: '4px solid #A78BFA',
            background: 'rgba(16, 27, 48, 0.82)',
            opacity: notesOpacity,
          }}
        >
          <div style={{marginBottom: 20, color: '#C4B5FD', fontSize: 22, fontWeight: 800}}>
            AUTO MEMORY
          </div>
          <div style={{color: '#CBD5E1', fontSize: 27, lineHeight: 1.6}}>
            Testing pattern
            <br />
            Project convention
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
      <div style={{display: 'flex', justifyContent: 'center', gap: 20}}>
        <MemorySourceCard title="CLAUDE.md" detail="YOUR RULES" accent="#60A5FA" compact />
        <MemorySourceCard title="AUTO MEMORY" detail="LEARNED NOTES" accent="#A78BFA" compact />
      </div>
      <div style={{color: '#64748B', fontSize: 36}}>↓</div>
      <div
        style={{
          padding: '20px 34px',
          border: '1px solid #334155',
          borderRadius: 999,
          background: '#101B30',
          color: '#F8FAFC',
          fontSize: 30,
          fontWeight: 800,
        }}
      >
        CLAUDE
      </div>
    </div>
  );
};

const MemorySourceCard = ({
  title,
  detail,
  accent,
  compact = false,
}: {
  title: string;
  detail: string;
  accent: string;
  compact?: boolean;
}) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      maxWidth: compact ? 320 : 420,
      padding: compact ? '24px 18px' : '32px 22px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
      border: '1px solid #334155',
      borderRadius: 22,
      background: 'rgba(16, 27, 48, 0.78)',
      textAlign: 'center',
    }}
  >
    <FileMark accent={accent} />
    <div style={{color: '#F8FAFC', fontSize: compact ? 23 : 26, fontWeight: 800}}>{title}</div>
    <div style={{color: accent, fontSize: 18, fontWeight: 800, letterSpacing: 1}}>{detail}</div>
  </div>
);

const FileMark = ({accent}: {accent: string}) => (
  <div
    style={{
      width: 52,
      height: 66,
      padding: '14px 10px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: `2px solid ${accent}`,
      borderRadius: 7,
    }}
  >
    {[0, 1, 2].map((line) => (
      <div key={line} style={{height: 2, background: accent, opacity: 0.8}} />
    ))}
  </div>
);

export const MemoryVisual = (props: VisualProps) => {
  const {scene} = props;

  switch (scene.id) {
    case 'claude-md':
      return <ClaudeMdEditor {...props} />;
    case 'personal-rules':
      return <PersonalRulesVisual {...props} />;
    case 'auto-memory':
      return <AutoMemoryVisual {...props} />;
    case 'golden-rule':
      return <GoldenRuleVisual {...props} />;
    case 'outro':
      return <OutroVisual {...props} />;
    default:
      throw new Error(`Missing Claude Memory visual for "${scene.id}".`);
  }
};

type TimedBeat = {id: string; startFrame: number};

const TimedVisual = ({
  beats,
  durationInFrames,
  speedFactor,
  renderBeat,
}: {
  beats: TimedBeat[];
  durationInFrames: number;
  speedFactor: number;
  renderBeat: (id: string, frame: number) => ReactNode;
}) => {
  const frame = useCurrentFrame() * speedFactor;
  const visualDurationInFrames = durationInFrames * speedFactor;

  return (
    <AbsoluteFill
      style={{
        color: '#F8FAFC',
        fontFamily: 'Inter, Arial, sans-serif',
        background:
          'radial-gradient(ellipse at 50% 45%, rgba(32, 63, 107, 0.28) 0%, rgba(8, 14, 30, 0) 58%)',
      }}
    >
      {beats.map((beat, index) => {
        const endFrame = beats[index + 1]?.startFrame ?? visualDurationInFrames;
        const fadeFrames = Math.min(10, Math.floor((endFrame - beat.startFrame) / 4));
        const opacity = interpolate(
          frame,
          [
            beat.startFrame,
            beat.startFrame + fadeFrames,
            endFrame - fadeFrames,
            endFrame,
          ],
          [0, 1, 1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        );

        return (
          <div key={beat.id} style={{position: 'absolute', inset: 0, opacity}}>
            <div
              style={{
                position: 'absolute',
                top: 140,
                right: 72,
                bottom: 140,
                left: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {renderBeat(beat.id, Math.max(0, frame - beat.startFrame))}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const VisualPanel = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      boxSizing: 'border-box',
      padding: '30px 34px',
      border: '1px solid #334155',
      borderRadius: 18,
      background: 'rgba(16, 27, 48, 0.88)',
      ...style,
    }}
  >
    {children}
  </div>
);

const FileRow = ({name, accent = '#60A5FA'}: {name: string; accent?: string}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, color: '#E2E8F0'}}>
    <div style={{width: 12, height: 18, border: `2px solid ${accent}`, borderRadius: 3}} />
    <span style={{fontSize: 24, fontWeight: 700}}>{name}</span>
  </div>
);

const personalRulesBeats: TimedBeat[] = [
  {id: 'big-file', startFrame: 0},
  {id: 'rules-folder', startFrame: 205},
  {id: 'auto-load', startFrame: 554},
  {id: 'local-file', startFrame: 723},
  {id: 'ignore', startFrame: 890},
];

const PersonalRulesVisual = ({durationInFrames, scene}: VisualProps) => (
  <TimedVisual
    beats={personalRulesBeats}
    durationInFrames={durationInFrames}
    speedFactor={getVisualNumber(scene, 'speedFactor', 1)}
    renderBeat={(id, frame) => <PersonalRulesBeat id={id} frame={frame} />}
  />
);

const PersonalRulesBeat = ({id, frame}: {id: string; frame: number}) => {
  if (id === 'big-file') {
    return (
      <VisualPanel style={{width: '100%', maxWidth: 680}}>
        <div style={{fontSize: 27, fontWeight: 800, marginBottom: 28}}>CLAUDE.md</div>
        <div style={{display: 'grid', gap: 18}}>
          {[0, 1, 2, 3, 4, 5].map((line) => (
            <div
              key={line}
              style={{
                width: `${94 - (line % 3) * 13}%`,
                height: 8,
                borderRadius: 4,
                background: '#64748B',
                opacity: 0.75,
              }}
            />
          ))}
        </div>
      </VisualPanel>
    );
  }

  if (id === 'rules-folder') {
    return (
      <VisualPanel style={{width: '100%', maxWidth: 680}}>
        <div style={{color: '#60A5FA', fontSize: 25, fontWeight: 800, marginBottom: 26}}>
          .claude/rules/
        </div>
        <div style={{display: 'grid', gap: 22}}>
          <FileRow name="testing.md" />
          <FileRow name="database.md" />
        </div>
      </VisualPanel>
    );
  }

  if (id === 'auto-load') {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32}}>
        <VisualPanel style={{minWidth: 300}}>
          <FileRow name=".claude/rules/" />
        </VisualPanel>
        <div style={{color: '#60A5FA', fontSize: 42, fontWeight: 800}}>→</div>
        <div
          style={{
            width: 220,
            height: 220,
            border: '2px solid #60A5FA',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          CLAUDE
        </div>
      </div>
    );
  }

  if (id === 'local-file') {
    return (
      <div style={{display: 'flex', alignItems: 'stretch', gap: 24, width: '100%', maxWidth: 760}}>
        <VisualPanel style={{flex: 1}}>
          <div style={{color: '#94A3B8', fontSize: 18, fontWeight: 800, marginBottom: 24}}>TEAM</div>
          <FileRow name="CLAUDE.md" />
        </VisualPanel>
        <VisualPanel style={{flex: 1, borderColor: '#C084FC'}}>
          <div style={{color: '#C084FC', fontSize: 18, fontWeight: 800, marginBottom: 24}}>PERSONAL</div>
          <FileRow name="CLAUDE.local.md" accent="#C084FC" />
        </VisualPanel>
      </div>
    );
  }

  if (id === 'ignore') {
    return (
      <VisualPanel style={{width: '100%', maxWidth: 680, borderColor: '#C084FC'}}>
        <div style={{color: '#94A3B8', fontSize: 18, fontWeight: 800, marginBottom: 24}}>
          .gitignore
        </div>
        <FileRow name="CLAUDE.local.md" accent="#C084FC" />
      </VisualPanel>
    );
  }

  throw new Error(`Unknown personal-rules visual beat "${id}".`);
};

const autoMemoryBeats: TimedBeat[] = [
  {id: 'feature-flow', startFrame: 0},
  {id: 'fresh-chat', startFrame: 248},
  {id: 'local-memory', startFrame: 403},
  {id: 'saved-learning', startFrame: 649},
  {id: 'inspect', startFrame: 959},
];

const AutoMemoryVisual = ({durationInFrames, scene}: VisualProps) => (
  <TimedVisual
    beats={autoMemoryBeats}
    durationInFrames={durationInFrames}
    speedFactor={getVisualNumber(scene, 'speedFactor', 1)}
    renderBeat={(id, frame) => <AutoMemoryBeat id={id} frame={frame} />}
  />
);

const AutoMemoryBeat = ({id, frame}: {id: string; frame: number}) => {
  if (id === 'feature-flow') {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28}}>
        <VisualPanel style={{minWidth: 260, textAlign: 'center', fontSize: 27, fontWeight: 800}}>
          FEATURE 1
        </VisualPanel>
        <div style={{color: '#60A5FA', fontSize: 40}}>→</div>
        <VisualPanel style={{minWidth: 260, textAlign: 'center', fontSize: 27, fontWeight: 800}}>
          FEATURE 2
        </VisualPanel>
      </div>
    );
  }

  if (id === 'fresh-chat') {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24}}>
        <VisualPanel style={{width: 290}}>
          <div style={{color: '#60A5FA', fontSize: 18, fontWeight: 800, marginBottom: 18}}>CHAT 01</div>
          <div style={{height: 8, width: '90%', borderRadius: 4, background: '#64748B'}} />
          <div style={{height: 8, width: '65%', marginTop: 12, borderRadius: 4, background: '#475569'}} />
        </VisualPanel>
        <div style={{color: '#64748B', fontSize: 25, fontWeight: 800}}>NEW</div>
        <VisualPanel style={{width: 290}}>
          <div style={{color: '#60A5FA', fontSize: 18, fontWeight: 800, marginBottom: 18}}>CHAT 02</div>
          <div style={{height: 8, width: '90%', borderRadius: 4, background: '#64748B'}} />
          <div style={{height: 8, width: '65%', marginTop: 12, borderRadius: 4, background: '#475569'}} />
        </VisualPanel>
      </div>
    );
  }

  if (id === 'local-memory') {
    const enabled = interpolate(frame, [175, 190], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return (
      <div style={{width: '100%', maxWidth: 650, textAlign: 'center'}}>
        <VisualPanel>
          <div style={{color: '#94A3B8', fontSize: 18, fontWeight: 800, marginBottom: 24}}>
            THIS COMPUTER
          </div>
          <FileRow name="MEMORY.md" />
        </VisualPanel>
        <div
          style={{
            marginTop: 24,
            opacity: enabled,
            color: '#86EFAC',
            fontSize: 21,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          AUTO MEMORY · ON
        </div>
      </div>
    );
  }

  if (id === 'saved-learning') {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20}}>
        <VisualPanel style={{textAlign: 'center'}}>
          <div style={{fontSize: 20, fontWeight: 800}}>CORRECTION</div>
          <div style={{marginTop: 12, color: '#94A3B8'}}>Feature 1</div>
        </VisualPanel>
        <div style={{color: '#60A5FA', fontSize: 36}}>→</div>
        <VisualPanel style={{textAlign: 'center', borderColor: '#86EFAC'}}>
          <FileMark accent="#86EFAC" />
          <div style={{marginTop: 12, color: '#86EFAC', fontWeight: 800}}>SAVED</div>
        </VisualPanel>
        <div style={{color: '#60A5FA', fontSize: 36}}>→</div>
        <VisualPanel style={{textAlign: 'center'}}>
          <div style={{fontSize: 20, fontWeight: 800}}>FEATURE 2</div>
          <div style={{marginTop: 12, color: '#86EFAC'}}>FIXED</div>
        </VisualPanel>
      </div>
    );
  }

  if (id === 'inspect') {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28}}>
        <VisualPanel style={{fontFamily: '"Courier New", monospace', fontSize: 30, color: '#86EFAC'}}>
          $ /memory
        </VisualPanel>
        <div style={{color: '#60A5FA', fontSize: 40}}>→</div>
        <VisualPanel style={{minWidth: 300}}>
          <FileRow name="saved notes" accent="#86EFAC" />
          <div style={{height: 7, width: '88%', marginTop: 20, borderRadius: 4, background: '#64748B'}} />
          <div style={{height: 7, width: '63%', marginTop: 12, borderRadius: 4, background: '#475569'}} />
        </VisualPanel>
      </div>
    );
  }

  throw new Error(`Unknown auto-memory visual beat "${id}".`);
};

const goldenRuleBeats: TimedBeat[] = [
  {id: 'repeat', startFrame: 0},
  {id: 'save', startFrame: 59},
  {id: 'future', startFrame: 251},
  {id: 'filter', startFrame: 427},
];

const GoldenRuleVisual = ({durationInFrames, scene}: VisualProps) => (
  <TimedVisual
    beats={goldenRuleBeats}
    durationInFrames={durationInFrames}
    speedFactor={getVisualNumber(scene, 'speedFactor', 1)}
    renderBeat={(id) => <GoldenRuleBeat id={id} />}
  />
);

const GoldenRuleBeat = ({id}: {id: string}) => {
  if (id === 'repeat') {
    return (
      <VisualPanel style={{width: '100%', maxWidth: 600}}>
        <div style={{display: 'grid', gap: 20}}>
          {[0, 1].map((line) => (
            <div
              key={line}
              style={{
                height: 12,
                width: line === 0 ? '92%' : '70%',
                borderRadius: 6,
                background: line === 0 ? '#60A5FA' : '#475569',
              }}
            />
          ))}
        </div>
      </VisualPanel>
    );
  }

  if (id === 'save') {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40}}>
        <VisualPanel style={{fontSize: 25, fontWeight: 800}}>INSTRUCTION</VisualPanel>
        <div style={{color: '#60A5FA', fontSize: 42}}>→</div>
        <VisualPanel style={{borderColor: '#86EFAC'}}>
          <FileMark accent="#86EFAC" />
        </VisualPanel>
      </div>
    );
  }

  if (id === 'future') {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36}}>
        <VisualPanel style={{borderColor: '#86EFAC'}}>
          <FileRow name="memory note" accent="#86EFAC" />
        </VisualPanel>
        <div style={{color: '#60A5FA', fontSize: 42}}>→</div>
        <VisualPanel style={{fontSize: 25, fontWeight: 800}}>NEXT CHAT</VisualPanel>
      </div>
    );
  }

  if (id === 'filter') {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28}}>
        <VisualPanel style={{borderColor: '#86EFAC', textAlign: 'center'}}>
          <div style={{color: '#86EFAC', fontSize: 20, fontWeight: 800}}>KEEP</div>
          <div style={{marginTop: 12, fontSize: 23}}>Project learning</div>
        </VisualPanel>
        <VisualPanel style={{borderColor: '#64748B', textAlign: 'center', opacity: 0.65}}>
          <div style={{color: '#94A3B8', fontSize: 20, fontWeight: 800}}>SKIP</div>
          <div style={{marginTop: 12, fontSize: 23}}>Random detail</div>
        </VisualPanel>
      </div>
    );
  }

  throw new Error(`Unknown golden-rule visual beat "${id}".`);
};

const outroBeats: TimedBeat[] = [
  {id: 'agent', startFrame: 0},
  {id: 'part-two', startFrame: 277},
  {id: 'recap', startFrame: 413},
  {id: 'cta', startFrame: 596},
];

const OutroVisual = ({durationInFrames, scene}: VisualProps) => (
  <TimedVisual
    beats={outroBeats}
    durationInFrames={durationInFrames}
    speedFactor={getVisualNumber(scene, 'speedFactor', 1)}
    renderBeat={(id, frame) => <OutroBeat id={id} frame={frame} />}
  />
);

const OutroBeat = ({id, frame}: {id: string; frame: number}) => {
  if (id === 'agent') {
    const memoryOpacity = interpolate(frame, [165, 185], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return (
      <div style={{width: '100%', maxWidth: 660}}>
        <VisualPanel style={{textAlign: 'center', fontSize: 27, fontWeight: 800}}>
          CODE REVIEWER
        </VisualPanel>
        <div style={{height: 28, borderLeft: '2px solid #60A5FA', marginLeft: '50%'}} />
        <div style={{opacity: memoryOpacity}}>
          <VisualPanel style={{width: '80%', margin: '0 auto', borderColor: '#86EFAC'}}>
            <FileRow name="agent memory" accent="#86EFAC" />
          </VisualPanel>
        </div>
      </div>
    );
  }

  if (id === 'part-two') {
    return (
      <div style={{textAlign: 'center'}}>
        <div style={{color: '#60A5FA', fontSize: 30, fontWeight: 800, letterSpacing: 5}}>
          PART 2
        </div>
        <div style={{marginTop: 24, fontSize: 48, fontWeight: 900}}>SUB-AGENT MEMORY</div>
      </div>
    );
  }

  if (id === 'recap') {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24}}>
        <VisualPanel style={{textAlign: 'center'}}>
          <FileMark accent="#60A5FA" />
          <div style={{marginTop: 14, fontSize: 22, fontWeight: 800}}>CLAUDE.md</div>
        </VisualPanel>
        <VisualPanel style={{fontFamily: '"Courier New", monospace', fontSize: 27, color: '#86EFAC'}}>
          /memory
        </VisualPanel>
      </div>
    );
  }

  if (id === 'cta') {
    return (
      <div style={{display: 'flex', justifyContent: 'center', gap: 24}}>
        {['SHARE', 'FOLLOW'].map((label) => (
          <VisualPanel
            key={label}
            style={{minWidth: 190, textAlign: 'center', fontSize: 22, fontWeight: 800}}
          >
            {label}
          </VisualPanel>
        ))}
      </div>
    );
  }

  throw new Error(`Unknown outro visual beat "${id}".`);
};

const claudeMdLines = [
  '# CLAUDE.md',
  '',
  '## Project Rules',
  '- Use functional components.',
  '- Route database queries through the service layer.',
  '- Use theme variables; avoid hardcoded colors.',
  '',
  '## Keep it short',
  '- Aim for 150–200 lines.',
];

const ruleHighlights: Record<number, number> = {
  3: 300,
  4: 390,
  5: 480,
  8: 810,
};

const ClaudeMdEditor = ({scene}: VisualProps) => {
  const frame = useCurrentFrame() * getVisualNumber(scene, 'speedFactor', 1);
  const visibleCharacters = Math.floor(frame * 2.5);
  const sessionReadOpacity = interpolate(frame, [600, 620], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lineLimitOpacity = interpolate(frame, [790, 810], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  let lineStart = 0;

  return (
    <AbsoluteFill
      style={{
        boxSizing: 'border-box',
        padding: '108px 60px 0',
        color: '#F8FAFC',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <div style={{color: '#60A5FA', fontSize: 24, fontWeight: 800, letterSpacing: 4}}>
        PROJECT HANDBOOK
      </div>
      <div
        style={{
          marginTop: 34,
          overflow: 'hidden',
          border: '2px solid #3B4658',
          borderRadius: 18,
          background: '#1E1E1E',
          boxShadow: '0 28px 80px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          style={{
            height: 74,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 24px',
            boxSizing: 'border-box',
            background: '#252526',
            borderBottom: '1px solid #3B3B3B',
          }}
        >
          <div style={{display: 'flex', gap: 10, marginRight: 20}}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((color) => (
              <span
                key={color}
                style={{width: 16, height: 16, borderRadius: '50%', background: color}}
              />
            ))}
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
              borderTop: '2px solid #60A5FA',
              background: '#1E1E1E',
              color: '#E2E8F0',
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            CLAUDE.md
          </div>
        </div>
        <div
          style={{
            padding: '34px 30px 42px',
            fontFamily: '"Courier New", monospace',
            fontSize: 23,
            lineHeight: 1.65,
            color: '#D4D4D4',
          }}
        >
          {claudeMdLines.map((line, index) => {
            const textStart = lineStart;
            lineStart += line.length + 1;
            const visibleLength = Math.max(0, Math.min(line.length, visibleCharacters - textStart));
            const highlightFrame = ruleHighlights[index];
            const highlightOpacity = highlightFrame === undefined
              ? 0
              : interpolate(frame, [highlightFrame, highlightFrame + 12], [0, 0.42], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });

            return (
              <div
                key={`${index}-${line}`}
                style={{
                  minHeight: '1.65em',
                  padding: '0 5px',
                  margin: '0 -5px',
                  borderRadius: 3,
                  background: `rgba(250, 204, 21, ${highlightOpacity})`,
                  color: highlightOpacity > 0.2 ? '#FFF7CC' : '#D4D4D4',
                  whiteSpace: 'pre',
                }}
              >
                {line.slice(0, visibleLength)}
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 930,
          left: 80,
          right: 80,
          opacity: sessionReadOpacity,
        }}
      >
        <VisualPanel
          style={{
            maxWidth: 700,
            margin: '0 auto',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
          }}
        >
          <span style={{color: '#94A3B8', fontSize: 18, fontWeight: 800}}>NEW CHAT</span>
          <span style={{color: '#60A5FA', fontSize: 24}}>→</span>
          <span style={{fontSize: 22, fontWeight: 800}}>CLAUDE.md READ</span>
        </VisualPanel>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1075,
          left: 80,
          right: 80,
          opacity: lineLimitOpacity,
        }}
      >
        <VisualPanel style={{maxWidth: 700, margin: '0 auto', padding: '20px 26px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{color: '#94A3B8', fontSize: 18, fontWeight: 800}}>KEEP IT SHORT</span>
            <span style={{color: '#FDE68A', fontSize: 22, fontWeight: 800}}>150–200 lines</span>
          </div>
          <div style={{height: 8, marginTop: 16, borderRadius: 4, background: '#334155'}}>
            <div style={{height: '100%', width: '72%', borderRadius: 4, background: '#FDE68A'}} />
          </div>
        </VisualPanel>
      </div>
    </AbsoluteFill>
  );
};
