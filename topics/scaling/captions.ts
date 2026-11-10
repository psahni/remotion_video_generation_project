import type {CaptionCue} from '../../src/engine/types';

export const scalingCaptions: Record<string, CaptionCue[]> = {
  hook: [
    {startFrame: 0, durationInFrames: 39, text: 'Your app gets a', highlightedKeyword: 'app'},
    {startFrame: 40, durationInFrames: 38, text: 'MILLION USERS overnight?!', highlightedKeyword: 'MILLION USERS'},
    {startFrame: 79, durationInFrames: 41, text: 'How do you stop it from crashing?', highlightedKeyword: 'crashing'},
  ],
  vertical: [
    {startFrame: 0, durationInFrames: 44, text: 'Option one:', highlightedKeyword: 'one'},
    {startFrame: 44, durationInFrames: 62, text: 'Vertical scaling.', highlightedKeyword: 'Vertical'},
    {startFrame: 108, durationInFrames: 72, text: 'Upgrade one server with more power.', highlightedKeyword: 'more power'},
  ],
  limit: [
    {startFrame: 0, durationInFrames: 52, text: "It's simple, but there's a catch.", highlightedKeyword: 'a catch'},
    {startFrame: 54, durationInFrames: 60, text: 'One machine can only get so powerful.', highlightedKeyword: 'only'},
    {startFrame: 116, durationInFrames: 64, text: 'There is a hardware limit.', highlightedKeyword: 'hardware limit'},
  ],
  horizontal: [
    {startFrame: 0, durationInFrames: 48, text: 'Option two:', highlightedKeyword: 'two'},
    {startFrame: 48, durationInFrames: 74, text: 'Horizontal scaling.', highlightedKeyword: 'Horizontal'},
    {startFrame: 124, durationInFrames: 64, text: 'Add servers and spread the work.', highlightedKeyword: 'spread the work'},
    {startFrame: 190, durationInFrames: 50, text: 'Share the load.', highlightedKeyword: 'Share'},
  ],
  comparison: [
    {startFrame: 0, durationInFrames: 54, text: 'Vertical means a bigger machine.', highlightedKeyword: 'bigger'},
    {startFrame: 58, durationInFrames: 56, text: 'Horizontal means more machines.', highlightedKeyword: 'more'},
    {startFrame: 118, durationInFrames: 62, text: "That's the difference!", highlightedKeyword: 'difference'},
  ],
};
