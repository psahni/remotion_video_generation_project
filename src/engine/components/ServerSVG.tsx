import {useId} from 'react';

type ServerSVGProps = {
  width: number;
  height: number;
  accent: string;
  label?: string;
};

export const ServerSVG = ({width, height, accent, label = 'Server'}: ServerSVGProps) => {
  const id = useId().replaceAll(':', '');
  const racks = [0, 1, 2, 3];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 360"
      role="img"
      aria-label={label}
      style={{display: 'block', overflow: 'visible'}}
    >
      <defs>
        <linearGradient id={`${id}-shell`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1B2B49" />
          <stop offset="100%" stopColor="#0A1326" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="11" y="9" width="218" height="342" rx="24" fill={`url(#${id}-shell)`} stroke="#344563" strokeWidth="5" />
      {racks.map((rack) => {
        const y = 31 + rack * 78;
        return (
          <g key={rack}>
            <rect x="31" y={y} width="178" height="63" rx="11" fill="#0B1428" stroke="#30415E" strokeWidth="3" />
            <rect x="48" y={y + 13} width="118" height="7" rx="3.5" fill="#253752" />
            <rect x="48" y={y + 28} width="118" height="7" rx="3.5" fill="#253752" />
            <rect x="48" y={y + 43} width="82" height="7" rx="3.5" fill="#253752" />
            <circle cx="185" cy={y + 23} r="6" fill={accent} filter={`url(#${id}-glow)`} />
            <circle cx="185" cy={y + 43} r="6" fill="#FACC15" opacity="0.9" />
          </g>
        );
      })}
      <path d="M37 337h166" stroke={accent} strokeWidth="4" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
};
