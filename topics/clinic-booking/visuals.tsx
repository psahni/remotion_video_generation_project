import {interpolate, useCurrentFrame} from 'remotion';
import type {VisualProps} from '../../src/engine/types';

const colors = {
  cream: '#F6F2E8',
  paper: '#FFFEFA',
  ink: '#18342D',
  muted: '#64756D',
  green: '#2D7659',
  paleGreen: '#E8F2E8',
  line: '#DCE3D8',
  gold: '#E6B75A',
  rose: '#A94B45',
  paleRose: '#F8ECE8',
  blue: '#466F91',
  paleBlue: '#EAF0F5',
};
const font = 'Arial, sans-serif';

const fadeIn = (frame: number, start: number, duration = 12) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const moveIn = (frame: number, start: number, duration = 12) =>
  interpolate(frame, [start, start + duration], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const Heading = ({children, top = 168, size = 58}: {
  children: React.ReactNode;
  top?: number;
  size?: number;
}) => (
  <div style={{
    position: 'absolute',
    top,
    left: 72,
    width: 936,
    color: colors.ink,
    font: `800 ${size}px/${1.08} ${font}`,
    letterSpacing: -1.5,
    textAlign: 'center',
  }}>
    {children}
  </div>
);

const Eyebrow = ({children}: {children: React.ReactNode}) => (
  <div style={{
    color: colors.green,
    font: `700 22px ${font}`,
    letterSpacing: 1.7,
    textTransform: 'uppercase',
  }}>
    {children}
  </div>
);

const Panel = ({children, style = {}}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div style={{
    background: colors.paper,
    border: `2px solid ${colors.line}`,
    borderRadius: 30,
    boxShadow: '0 18px 48px rgba(37, 58, 44, 0.08)',
    boxSizing: 'border-box',
    ...style,
  }}>
    {children}
  </div>
);

const ChatHeader = ({compact = false}: {compact?: boolean}) => (
  <div style={{
    height: compact ? 88 : 104,
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    padding: compact ? '0 22px' : '0 30px',
    borderBottom: `2px solid ${colors.line}`,
    boxSizing: 'border-box',
  }}>
    <div style={{
      width: compact ? 48 : 56,
      height: compact ? 48 : 56,
      display: 'grid',
      placeItems: 'center',
      borderRadius: '50%',
      background: colors.paleGreen,
      color: colors.green,
      font: `800 ${compact ? 23 : 26}px ${font}`,
    }}>
      MC
    </div>
    <div>
      <div style={{font: `700 ${compact ? 26 : 29}px ${font}`, color: colors.ink}}>
        Maple Care Clinic
      </div>
      <div style={{marginTop: 4, font: `400 ${compact ? 19 : 21}px ${font}`, color: colors.muted}}>
        clinic WhatsApp
      </div>
    </div>
    <div style={{marginLeft: 'auto', color: colors.green, font: `700 22px ${font}`}}>●</div>
  </div>
);

const ChatBubble = ({children, side = 'left', style = {}}: {
  children: React.ReactNode;
  side?: 'left' | 'right';
  style?: React.CSSProperties;
}) => (
  <div style={{
    alignSelf: side === 'right' ? 'flex-end' : 'flex-start',
    maxWidth: side === 'right' ? '82%' : '88%',
    padding: '17px 22px',
    borderRadius: side === 'right' ? '24px 24px 7px 24px' : '24px 24px 24px 7px',
    background: side === 'right' ? colors.paleGreen : '#F0F1EA',
    color: colors.ink,
    font: `500 27px/1.26 ${font}`,
    boxSizing: 'border-box',
    ...style,
  }}>
    {children}
  </div>
);

const Phone = ({children, left, top, width, height}: {
  children: React.ReactNode;
  left: number;
  top: number;
  width: number;
  height: number;
}) => (
  <Panel style={{
    position: 'absolute',
    left,
    top,
    width,
    height,
    borderRadius: 36,
    overflow: 'hidden',
  }}>
    <ChatHeader compact />
    {children}
  </Panel>
);

const TapRipple = ({frame, start, left, top, size = 88}: {
  frame: number;
  start: number;
  left: number;
  top: number;
  size?: number;
}) => {
  const progress = interpolate(frame, [start, start + 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{
      position: 'absolute',
      left: left - size * progress / 2,
      top: top - size * progress / 2,
      width: size * progress,
      height: size * progress,
      border: `3px solid ${colors.green}`,
      borderRadius: '50%',
      opacity: 1 - progress,
      pointerEvents: 'none',
    }} />
  );
};

const IntroVisual = ({frame}: {frame: number}) => (
  <>
    <Heading top={177} size={57}>
      From WhatsApp chat to a confirmed clinic appointment.
    </Heading>
    <Panel style={{
      position: 'absolute',
      left: 70,
      top: 350,
      width: 430,
      height: 145,
      padding: '15px 18px',
    }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12}}>
        <div>
          <div style={{
            color: colors.green,
            font: `700 18px ${font}`,
            letterSpacing: 0.6,
            whiteSpace: 'nowrap',
          }}>DEDICATED WHATSAPP</div>
          <div style={{
            marginTop: 8,
            color: colors.ink,
            font: `700 17px ${font}`,
            whiteSpace: 'nowrap',
          }}>[Clinic WhatsApp number]</div>
        </div>
        <div style={{
          padding: '13px 15px',
          borderRadius: 16,
          background: colors.green,
          color: '#FFFFFF',
          textAlign: 'center',
          font: `700 21px/1.1 ${font}`,
        }}>
          Book on<br />WhatsApp ↗
        </div>
      </div>
      <div style={{marginTop: 8, color: colors.muted, font: `600 16px ${font}`}}>
        Tap to open the clinic’s dedicated chat
      </div>
    </Panel>
    <Phone left={70} top={510} width={430} height={900}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, padding: 22}}>
        <ChatBubble side="right">Hi</ChatBubble>
        <ChatBubble>Welcome to Maple Care Clinic. How can we help?</ChatBubble>
        <div style={{
          border: `2px solid ${colors.line}`,
          borderRadius: 20,
          overflow: 'hidden',
          color: colors.green,
          textAlign: 'center',
          font: `700 24px/1.2 ${font}`,
        }}>
          <div style={{padding: 15}}>Book Appointment</div>
          <div style={{height: 2, background: colors.line}} />
          <div style={{padding: 15, color: colors.blue, fontWeight: 600}}>Contact Support</div>
        </div>
      </div>
    </Phone>
    <Panel style={{
      position: 'absolute',
      left: 548,
      top: 548,
      width: 462,
      height: 824,
      padding: '30px 28px',
      opacity: fadeIn(frame, 12),
      transform: `translateY(${moveIn(frame, 12)}px)`,
    }}>
      <Eyebrow>Today · 19 Nov 2026</Eyebrow>
      <div style={{marginTop: 14, color: colors.ink, font: `800 38px ${font}`}}>Clinic agenda</div>
      <div style={{height: 2, background: colors.line, margin: '24px 0'}} />
      <div style={{display: 'flex', gap: 16, alignItems: 'stretch'}}>
        <div style={{width: 88, paddingTop: 5, color: colors.muted, font: `700 24px ${font}`}}>10:30</div>
        <div style={{
          flex: 1,
          padding: '20px 18px',
          borderRadius: 20,
          background: colors.paleGreen,
          borderLeft: `7px solid ${colors.green}`,
        }}>
          <div style={{font: `800 29px ${font}`, color: colors.ink}}>Aarav</div>
          <div style={{marginTop: 9, font: `500 24px ${font}`, color: colors.muted}}>Dr. Meera</div>
        </div>
      </div>
      <div style={{marginTop: 22, height: 2, background: colors.line}} />
      <div style={{marginTop: 22, color: colors.muted, font: `600 22px ${font}`}}>One shared clinic schedule</div>
    </Panel>
  </>
);

const StartChatVisual = ({frame}: {frame: number}) => {
  const showHi = fadeIn(frame, 3);
  const showWelcome = fadeIn(frame, 34);
  const showButtons = fadeIn(frame, 67);
  return (
    <>
      <Heading>One message starts the visit</Heading>
      <Phone left={105} top={365} width={870} height={1060}>
        <div style={{
          height: 954,
          display: 'flex',
          flexDirection: 'column',
          gap: 25,
          padding: '35px 36px',
          boxSizing: 'border-box',
          background: '#FBFAF5',
        }}>
          <div style={{textAlign: 'center', color: colors.muted, font: `600 20px ${font}`}}>TODAY</div>
          <div style={{
            opacity: showHi,
            transform: `translateY(${moveIn(frame, 3)}px)`,
            alignSelf: 'flex-end',
          }}>
            <ChatBubble side="right" style={{fontSize: 32, padding: '18px 28px'}}>Hi</ChatBubble>
          </div>
          <div style={{opacity: showWelcome, transform: `translateY(${moveIn(frame, 34)}px)`}}>
            <ChatBubble style={{fontSize: 31, padding: '22px 26px'}}>
              Welcome to Maple Care Clinic. How can we help?
            </ChatBubble>
          </div>
          <div style={{opacity: showButtons, transform: `translateY(${moveIn(frame, 67)}px)`}}>
            <div style={{marginBottom: 13, color: colors.muted, font: `600 22px ${font}`}}>Choose a reply</div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              border: `2px solid ${colors.line}`,
              borderRadius: 22,
              overflow: 'hidden',
              background: colors.paper,
            }}>
              <div style={{
                display: 'grid',
                placeItems: 'center',
                minHeight: 82,
                color: colors.green,
                font: `700 30px ${font}`,
              }}>Book Appointment</div>
              <div style={{height: 2, background: colors.line}} />
              <div style={{
                display: 'grid',
                placeItems: 'center',
                minHeight: 82,
                color: colors.blue,
                font: `600 28px ${font}`,
              }}>Contact Support</div>
            </div>
          </div>
          <TapRipple frame={frame} start={80} left={435} top={501} size={110} />
        </div>
      </Phone>
    </>
  );
};

const VerifyEmailVisual = ({frame}: {frame: number}) => (
  <>
    <Heading top={157} size={53}>Verify by email, right in WhatsApp</Heading>
    <Phone left={48} top={340} width={550} height={1100}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '18px 17px',
        boxSizing: 'border-box',
        background: '#FBFAF5',
      }}>
        {[
          {text: 'What name should we use?', side: 'left', at: 0},
          {text: 'Aarav', side: 'right', at: 13},
          {text: 'What’s your email?', side: 'left', at: 27},
          {text: 'aarav@example.test', side: 'right', at: 41},
          {text: 'Enter the code we sent to your email.', side: 'left', at: 55},
          {text: '482193', side: 'right', at: 83},
          {text: 'Email verified ✓', side: 'left', at: 106},
        ].map((message) => (
          <div key={message.text} style={{
            opacity: fadeIn(frame, message.at),
            transform: `translateY(${moveIn(frame, message.at)}px)`,
          }}>
            <ChatBubble side={message.side as 'left' | 'right'} style={{
              padding: '13px 17px',
              fontSize: message.text === '482193' ? 34 : 24,
              fontWeight: message.text === '482193' ? 800 : 500,
            }}>
              {message.text}
            </ChatBubble>
          </div>
        ))}
      </div>
    </Phone>
    <Panel style={{
      position: 'absolute',
      left: 627,
      top: 615,
      width: 405,
      minHeight: 500,
      padding: 26,
      opacity: fadeIn(frame, 52),
      transform: `translateY(${moveIn(frame, 52)}px)`,
    }}>
      <Eyebrow>Delivered by email</Eyebrow>
      <div style={{
        marginTop: 22,
        padding: '19px 17px',
        border: `2px solid ${colors.line}`,
        borderRadius: 18,
        background: '#FFFFFF',
      }}>
        <div style={{font: `700 22px ${font}`, color: colors.ink}}>To: aarav@example.test</div>
        <div style={{marginTop: 9, font: `500 19px ${font}`, color: colors.muted}}>Maple Care Clinic</div>
        <div style={{height: 2, background: colors.line, margin: '18px 0'}} />
        <div style={{font: `600 23px/1.3 ${font}`, color: colors.ink}}>Your verification code:</div>
        <div style={{
          marginTop: 10,
          color: colors.green,
          font: `800 54px ${font}`,
          letterSpacing: 5,
          textAlign: 'center',
        }}>482193</div>
      </div>
      <div style={{
        marginTop: 23,
        padding: '15px 14px',
        borderRadius: 16,
        background: colors.paleGreen,
        color: colors.green,
        font: `700 23px/1.25 ${font}`,
        textAlign: 'center',
      }}>
        Code entered in WhatsApp
      </div>
    </Panel>
    <div style={{
      position: 'absolute',
      left: 635,
      top: 1140,
      width: 392,
      color: colors.muted,
      textAlign: 'center',
      font: `600 23px/1.3 ${font}`,
    }}>
      Email inbox → WhatsApp chat
    </div>
  </>
);

const ListRow = ({children, selected = false, disabled = false}: {
  children: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
}) => (
  <div style={{
    minHeight: 48,
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 13,
    boxSizing: 'border-box',
    color: disabled ? '#89948D' : selected ? colors.green : colors.ink,
    background: selected ? colors.paleGreen : disabled ? '#F0F0EB' : colors.paper,
    font: `${selected ? 700 : 600} 25px ${font}`,
  }}>
    {children}
    {selected && <span aria-label="selected">✓</span>}
  </div>
);

const ChooseSlotVisual = ({frame}: {frame: number}) => (
  <>
    <Heading top={158} size={53}>Choose an open date, then a time</Heading>
    <Panel style={{
      position: 'absolute',
      left: 82,
      top: 340,
      width: 916,
      height: 1120,
      overflow: 'hidden',
    }}>
      <ChatHeader compact />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 13,
        padding: '16px 24px 20px',
        background: '#FBFAF5',
      }}>
        <div style={{opacity: fadeIn(frame, 0), transform: `translateY(${moveIn(frame, 0)}px)`}}>
          <div style={{
            padding: '12px 15px',
            borderRadius: 16,
            background: '#F0F1EA',
          }}>
            <div style={{marginBottom: 9, color: colors.muted, font: `700 20px ${font}`}}>AVAILABLE DATES</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
              <ListRow>18 Nov 2026</ListRow>
              <ListRow selected>19 Nov 2026</ListRow>
              <ListRow>20 Nov 2026</ListRow>
            </div>
          </div>
        </div>
        <div style={{alignSelf: 'flex-end', opacity: fadeIn(frame, 38)}}>
          <ChatBubble side="right" style={{padding: '11px 18px', fontSize: 25, whiteSpace: 'nowrap'}}>19 Nov 2026</ChatBubble>
        </div>
        <div style={{opacity: fadeIn(frame, 69), transform: `translateY(${moveIn(frame, 69)}px)`}}>
          <div style={{
            padding: '12px 15px',
            borderRadius: 16,
            background: '#F0F1EA',
          }}>
            <div style={{marginBottom: 9, color: colors.muted, font: `700 20px ${font}`}}>AVAILABLE TIMES · 19 NOV</div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6}}>
              <ListRow>9:30 AM</ListRow>
              <ListRow selected>10:30 AM</ListRow>
              <ListRow>11:30 AM</ListRow>
              <ListRow>2:00 PM</ListRow>
            </div>
          </div>
        </div>
        <div style={{alignSelf: 'flex-end', opacity: fadeIn(frame, 96)}}>
          <ChatBubble side="right" style={{padding: '10px 17px', fontSize: 24, whiteSpace: 'nowrap'}}>10:30 AM</ChatBubble>
        </div>
        <div style={{opacity: fadeIn(frame, 108)}}>
          <div style={{
            padding: '13px 18px',
            borderRadius: 17,
            background: colors.paleGreen,
            color: colors.ink,
            font: `600 24px/1.3 ${font}`,
          }}>
            <div style={{            marginBottom: 6, color: colors.green, fontWeight: 800}}>APPOINTMENT SUMMARY</div>
            Aarav · Dr. Meera<br />
            19 Nov 2026 · 10:30 AM IST
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
          opacity: fadeIn(frame, 126),
        }}>
          <div style={{
            position: 'relative',
            padding: '12px 18px',
            border: `2px solid ${frame >= 138 ? colors.green : colors.line}`,
            borderRadius: 15,
            background: frame >= 138 ? colors.paleGreen : colors.paper,
            color: colors.ink,
            textAlign: 'center',
          }}>
            <div style={{font: `800 25px ${font}`}}>Confirm + updates</div>
            <div style={{marginTop: 4, color: colors.muted, font: `500 18px ${font}`}}>
              Opt in to future WhatsApp appointment updates
            </div>
            <TapRipple frame={frame} start={138} left={812} top={42} size={94} />
          </div>
          <div style={{
            padding: '11px 18px',
            border: `2px solid ${colors.line}`,
            borderRadius: 15,
            background: colors.paper,
            color: colors.ink,
            textAlign: 'center',
          }}>
            <div style={{font: `700 24px ${font}`}}>Confirm only</div>
            <div style={{marginTop: 4, color: colors.muted, font: `500 18px ${font}`}}>
              Book without WhatsApp updates
            </div>
          </div>
          <div style={{
            padding: '10px 18px',
            border: `2px solid ${colors.line}`,
            borderRadius: 15,
            background: colors.paper,
            color: colors.muted,
            textAlign: 'center',
            font: `600 22px ${font}`,
          }}>Cancel</div>
        </div>
      </div>
    </Panel>
  </>
);

const BookingConfirmedVisual = ({frame}: {frame: number}) => {
  const confirmed = frame >= 45;
  const cardProgress = fadeIn(frame, 88, 30);
  const cardX = interpolate(frame, [88, 118], [62, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <>
      <Heading top={166} size={55}>Saved once. Confirmed everywhere.</Heading>
      <Phone left={62} top={365} width={435} height={1050}>
        <div style={{padding: '28px 22px', background: '#FBFAF5', height: 955, boxSizing: 'border-box'}}>
          <div style={{margin: '0 auto 24px', textAlign: 'center', color: colors.muted, font: `600 20px ${font}`}}>TODAY</div>
          {!confirmed ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '17px 22px',
              borderRadius: 22,
              background: '#F0F1EA',
              color: colors.ink,
              font: `700 29px ${font}`,
            }}>
              <span style={{width: 16, height: 16, border: `3px solid ${colors.green}`, borderTopColor: 'transparent', borderRadius: '50%'}} />
              Booking…
            </div>
          ) : (
            <div style={{
              padding: '22px 20px',
              borderRadius: 22,
              background: colors.paleGreen,
              color: colors.ink,
              font: `600 26px/1.4 ${font}`,
              opacity: fadeIn(frame, 45),
              transform: `translateY(${moveIn(frame, 45)}px)`,
            }}>
              <div style={{color: colors.green, font: `800 29px ${font}`}}>Appointment confirmed ✓</div>
              <div style={{marginTop: 14, fontWeight: 700}}>Aarav</div>
              <div>Dr. Meera</div>
              <div>19 Nov 2026 · 10:30 AM IST</div>
            </div>
          )}
        </div>
      </Phone>
      <Panel style={{
        position: 'absolute',
        left: 533,
        top: 408,
        width: 474,
        height: 850,
        padding: '30px 25px',
      }}>
        <Eyebrow>Daily agenda</Eyebrow>
        <div style={{marginTop: 12, color: colors.ink, font: `800 36px ${font}`}}>19 Nov 2026</div>
        <div style={{marginTop: 23, height: 2, background: colors.line}} />
        <div style={{
          position: 'relative',
          marginTop: 30,
          padding: '22px 18px',
          borderRadius: 20,
          background: colors.paleGreen,
          borderLeft: `7px solid ${colors.green}`,
          opacity: cardProgress,
          transform: `translateX(${cardX}px)`,
        }}>
          <div style={{color: colors.green, font: `800 23px ${font}`}}>10:30 AM</div>
          <div style={{marginTop: 12, color: colors.ink, font: `800 31px ${font}`}}>Aarav</div>
          <div style={{marginTop: 8, color: colors.muted, font: `600 24px ${font}`}}>Dr. Meera</div>
        </div>
        <div style={{
          position: 'absolute',
          left: 36,
          right: 30,
          bottom: 36,
          padding: '15px 13px',
          borderRadius: 14,
          background: '#F4F3ED',
          color: colors.muted,
          textAlign: 'center',
          font: `600 20px/1.25 ${font}`,
        }}>
          Same patient · same date · same time
        </div>
      </Panel>
    </>
  );
};

const AgendaRow = ({time, name}: {
  time: string;
  name: string;
}) => {
  return (
    <div style={{display: 'flex', gap: 18, marginTop: 20, alignItems: 'stretch'}}>
      <div style={{width: 118, paddingTop: 16, color: colors.ink, font: `800 26px ${font}`}}>{time}</div>
      <div style={{
        flex: 1,
        padding: '18px 22px',
        borderLeft: `8px solid ${colors.green}`,
        borderRadius: 18,
        background: colors.paleGreen,
      }}>
        <div style={{color: colors.ink, font: `800 31px ${font}`}}>{name}</div>
        <div style={{marginTop: 8, color: colors.muted, font: `600 22px ${font}`}}>Dr. Meera</div>
      </div>
    </div>
  );
};

const DailyAgendaVisual = () => (
  <>
    <Heading top={166} size={57}>One shared view for the clinic day</Heading>
    <Panel style={{
      position: 'absolute',
      left: 83,
      top: 362,
      width: 914,
      height: 1055,
      padding: '34px 35px',
    }}>
      <div style={{display: 'flex', alignItems: 'end', justifyContent: 'space-between'}}>
        <div>
          <Eyebrow>Clinic workspace</Eyebrow>
          <div style={{marginTop: 10, color: colors.ink, font: `800 43px ${font}`}}>Daily agenda</div>
        </div>
        <div style={{
          padding: '11px 15px',
          borderRadius: 17,
          background: colors.paleGreen,
          color: colors.green,
          font: `700 22px ${font}`,
        }}>19 Nov 2026</div>
      </div>
      <div style={{height: 2, margin: '27px 0 8px', background: colors.line}} />
      <AgendaRow time="10:30 AM" name="Aarav" />
      <AgendaRow time="11:30 AM" name="Nila Shah" />
      <div style={{
        marginTop: 33,
        padding: '18px 20px',
        borderRadius: 18,
        background: '#F5F4EE',
        color: colors.ink,
        font: `600 24px/1.3 ${font}`,
      }}>
        Both appointments appear in the same clinic schedule.
      </div>
      <div style={{
        marginTop: 27,
        color: colors.muted,
        textAlign: 'center',
        font: `600 22px ${font}`,
      }}>For doctors and reception staff</div>
    </Panel>
  </>
);

const AvailabilityVisual = () => (
  <>
    <Heading top={165} size={54}>Working hours shape what patients can book</Heading>
    <Panel style={{
      position: 'absolute',
      left: 66,
      top: 366,
      width: 456,
      height: 1005,
      padding: '28px 24px',
    }}>
      <Eyebrow>Doctor’s schedule</Eyebrow>
      <div style={{marginTop: 15, color: colors.ink, font: `800 33px ${font}`}}>Dr. Meera</div>
      <div style={{marginTop: 23, padding: '16px', borderRadius: 16, background: '#F4F3ED'}}>
        <div style={{color: colors.muted, font: `700 19px ${font}`}}>WORKING HOURS</div>
        <div style={{marginTop: 9, color: colors.ink, font: `800 27px ${font}`}}>9:00 AM – 5:00 PM</div>
      </div>
      <div style={{marginTop: 16, padding: '16px', borderRadius: 16, background: colors.paleRose}}>
        <div style={{color: colors.rose, font: `700 19px ${font}`}}>BLOCKED BREAK</div>
        <div style={{marginTop: 9, color: colors.ink, font: `800 26px ${font}`}}>1:00 – 1:30 PM</div>
      </div>
      <div style={{marginTop: 20, color: colors.muted, font: `700 20px ${font}`}}>Existing appointment</div>
      <div style={{
        marginTop: 9,
        padding: '14px 15px',
        borderRadius: 14,
        border: `2px solid ${colors.line}`,
        color: colors.ink,
        font: `700 24px ${font}`,
      }}>10:30 AM · Aarav</div>
      <div style={{
        marginTop: 17,
        padding: '12px 13px',
        borderRadius: 14,
        background: colors.paleGreen,
        color: colors.green,
        font: `700 19px/1.25 ${font}`,
        textAlign: 'center',
      }}>Existing bookings stay in place</div>
    </Panel>
    <Panel style={{
      position: 'absolute',
      left: 548,
      top: 366,
      width: 466,
      height: 1005,
      padding: '28px 23px',
    }}>
      <Eyebrow>Patient availability</Eyebrow>
      <div style={{marginTop: 15, color: colors.ink, font: `800 32px ${font}`}}>19 Nov · choose a time</div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 13, marginTop: 22}}>
        <ListRow>9:30 AM <span>Available</span></ListRow>
        <ListRow disabled>10:30 AM <span>Booked</span></ListRow>
        <ListRow>11:30 AM <span>Available</span></ListRow>
        <ListRow disabled>
          <span style={{fontSize: 22}}>1:00–1:30 PM</span>
          <span style={{fontSize: 18}}>Break · unavailable</span>
        </ListRow>
        <ListRow>2:00 PM <span>Available</span></ListRow>
      </div>
      <div style={{
        marginTop: 22,
        padding: '15px 13px',
        borderRadius: 15,
        background: '#F4F3ED',
        color: colors.ink,
        font: `600 20px/1.3 ${font}`,
      }}>
        Only open times are selectable.
      </div>
    </Panel>
  </>
);

const CancellationVisual = ({frame}: {frame: number}) => (
  <>
    <Heading top={164} size={54}>Cancel clearly. Keep the patient informed.</Heading>
    <Panel style={{
      position: 'absolute',
      left: 76,
      top: 354,
      width: 928,
      minHeight: 528,
      padding: '28px 30px',
    }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Eyebrow>Clinic appointment</Eyebrow>
        <div style={{
          padding: '8px 14px',
          borderRadius: 18,
          background: frame >= 73 ? colors.paleRose : '#F5F1E3',
          color: frame >= 73 ? colors.rose : '#866827',
          font: `800 20px ${font}`,
        }}>{frame >= 73 ? 'CANCELLED' : 'CONFIRM CANCELLATION'}</div>
      </div>
      <div style={{marginTop: 14, color: colors.ink, font: `800 32px ${font}`}}>Aarav · Dr. Meera</div>
      <div style={{marginTop: 7, color: colors.muted, font: `600 24px ${font}`}}>19 Nov 2026 · 10:30 AM IST</div>
      <div style={{
        marginTop: 20,
        padding: '14px 17px',
        border: `2px solid ${colors.line}`,
        borderRadius: 14,
        color: colors.ink,
        font: `600 24px ${font}`,
      }}>
        Reason: <strong>Doctor unavailable</strong>
      </div>
      {frame < 73 ? (
        <div style={{
          marginTop: 18,
          padding: '17px',
          borderRadius: 15,
          background: colors.rose,
          color: '#FFFFFF',
          textAlign: 'center',
          font: `700 25px ${font}`,
        }}>Confirm cancellation</div>
      ) : (
        <div style={{
          marginTop: 18,
          padding: '17px',
          borderRadius: 15,
          background: colors.paleRose,
          color: colors.rose,
          textAlign: 'center',
          font: `800 25px ${font}`,
        }}>Appointment cancelled</div>
      )}
    </Panel>
    <Panel style={{
      position: 'absolute',
      left: 76,
      top: 914,
      width: 928,
      height: 454,
      padding: '25px 28px',
      opacity: fadeIn(frame, 62),
      transform: `translateY(${moveIn(frame, 62)}px)`,
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: 15}}>
        <div style={{
          width: 46,
          height: 46,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '50%',
          background: colors.paleGreen,
          color: colors.green,
          font: `800 21px ${font}`,
        }}>MC</div>
        <div style={{color: colors.ink, font: `700 24px ${font}`}}>WhatsApp notice to Aarav</div>
      </div>
      <div style={{
        marginTop: 20,
        padding: '19px 20px',
        borderRadius: 20,
        borderTopLeftRadius: 5,
        background: '#F0F1EA',
        color: colors.ink,
        font: `500 25px/1.35 ${font}`,
      }}>
        Your appointment on 19 Nov at 10:30 AM IST has been cancelled. Please contact the clinic or book another available time.
      </div>
      <div style={{
        marginTop: 15,
        color: colors.ink,
        textAlign: 'center',
        font: `700 28px/1.25 ${font}`,
      }}>
        Sent only when Aarav opted in to WhatsApp updates and the clinic has configured an approved WhatsApp message template.
      </div>
      <div style={{
        marginTop: 10,
        color: colors.rose,
        textAlign: 'center',
        font: `700 20px ${font}`,
      }}>No automatic rescheduling · No time reserved</div>
    </Panel>
  </>
);

const OutroVisual = () => (
  <>
    <div style={{
      position: 'absolute',
      top: 190,
      left: 72,
      width: 936,
      color: colors.ink,
      textAlign: 'center',
      font: `800 58px ${font}`,
      letterSpacing: -1,
    }}>
      Maple Care Clinic
    </div>
    <Phone left={72} top={366} width={435} height={790}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, padding: 22}}>
        <ChatBubble side="right">Hi</ChatBubble>
        <ChatBubble side="right" style={{fontSize: 24}}>Book Appointment</ChatBubble>
        <ChatBubble side="right" style={{fontSize: 23}}>19 Nov · 10:30 AM</ChatBubble>
        <ChatBubble side="right" style={{fontSize: 23}}>Appointment confirmed ✓</ChatBubble>
      </div>
    </Phone>
    <Panel style={{
      position: 'absolute',
      left: 545,
      top: 402,
      width: 465,
      height: 720,
      padding: '27px 23px',
    }}>
      <Eyebrow>Daily agenda</Eyebrow>
      <div style={{marginTop: 12, color: colors.ink, font: `800 33px ${font}`}}>19 Nov 2026</div>
      <div style={{height: 2, background: colors.line, margin: '22px 0'}} />
      <div style={{
        padding: '22px 17px',
        borderRadius: 18,
        background: colors.paleGreen,
        borderLeft: `7px solid ${colors.green}`,
      }}>
        <div style={{color: colors.green, font: `800 22px ${font}`}}>10:30 AM · Dr. Meera</div>
        <div style={{marginTop: 11, color: colors.ink, font: `800 29px ${font}`}}>Aarav</div>
      </div>
      <div style={{marginTop: 22, color: colors.muted, font: `600 21px ${font}`}}>One clear shared schedule</div>
    </Panel>
    <div style={{
      position: 'absolute',
      top: 1245,
      left: 78,
      width: 924,
      color: colors.ink,
      font: `800 53px/1.12 ${font}`,
      letterSpacing: -1,
      textAlign: 'center',
    }}>
      Easy for patients.<br />
      Clear for your clinic.
    </div>
  </>
);

export const ClinicBookingVisual = ({scene}: VisualProps) => {
  const frame = useCurrentFrame();
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: colors.cream,
      color: colors.ink,
      fontFamily: font,
    }}>
      {scene.id === 'intro' && <IntroVisual frame={frame} />}
      {scene.id === 'start-chat' && <StartChatVisual frame={frame} />}
      {scene.id === 'verify-email' && <VerifyEmailVisual frame={frame} />}
      {scene.id === 'choose-slot' && <ChooseSlotVisual frame={frame} />}
      {scene.id === 'booking-confirmed' && <BookingConfirmedVisual frame={frame} />}
      {scene.id === 'daily-agenda' && <DailyAgendaVisual />}
      {scene.id === 'availability' && <AvailabilityVisual />}
      {scene.id === 'cancellation' && <CancellationVisual frame={frame} />}
      {scene.id === 'outro' && <OutroVisual />}
    </div>
  );
};
