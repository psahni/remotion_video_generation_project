import type {CaptionCue} from '../types';
import {Caption} from './Caption';

type CaptionsProps = {
  cues: CaptionCue[];
};

export const Captions = ({cues}: CaptionsProps) => (
  <>
    {cues.map((cue, index) => (
      <Caption key={`${cue.startFrame}-${index}`} cue={cue} />
    ))}
  </>
);
