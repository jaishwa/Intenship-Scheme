import { useEffect, useRef } from 'react';
import { scoreColor } from '../lib/aiMatcher';

interface MatchScoreRingProps {
  score: number;
  size?: number;
}

export default function MatchScoreRing({ score, size = 72 }: MatchScoreRingProps) {
  const svgRef = useRef<SVGCircleElement>(null);
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.style.strokeDashoffset = `${circumference}`;
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (svgRef.current) {
            svgRef.current.style.transition = 'stroke-dashoffset 1s ease-out';
            svgRef.current.style.strokeDashoffset = `${offset}`;
          }
        }, 100);
      });
    }
  }, [score, circumference, offset]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={6}
        />
        <circle
          ref={svgRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      <span
        className="absolute text-sm font-bold"
        style={{ color }}
      >
        {score}%
      </span>
    </div>
  );
}
