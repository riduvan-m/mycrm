import { useState } from 'react';
import { barPath, niceTicks, useElementWidth } from './utils';

type Props = {
  data: { label: string; value: number }[];
  formatValue: (v: number) => string;
  height?: number;
};

const PAD = { top: 16, right: 8, bottom: 28, left: 44 };

export function BarChart({ data, formatValue, height = 240 }: Props) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const ticks = niceTicks(Math.max(...data.map((d) => d.value)));
  const yMax = ticks[ticks.length - 1];
  const plotW = Math.max(width - PAD.left - PAD.right, 0);
  const plotH = height - PAD.top - PAD.bottom;
  const band = plotW / data.length;
  const barW = Math.min(band * 0.5, 24);
  const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH;
  const center = (i: number) => PAD.left + band * i + band / 2;

  return (
    <div ref={ref} className="chart">
      {width > 0 && (
        <svg width={width} height={height} aria-hidden="true" onPointerLeave={() => setHover(null)}>
          {ticks.map((t) => (
            <g key={t}>
              <line
                className={t === 0 ? 'axis-line' : 'grid-line'}
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(t)}
                y2={y(t)}
              />
              <text className="tick tick-y" x={PAD.left - 8} y={y(t)}>
                {formatValue(t)}
              </text>
            </g>
          ))}
          {data.map((d, i) => (
            <g key={d.label}>
              <path
                className={hover === i ? 'bar active' : 'bar'}
                d={barPath(center(i) - barW / 2, y(d.value), barW, y(0) - y(d.value))}
              />
              <text className="tick tick-x" x={center(i)} y={height - 8}>
                {d.label}
              </text>
              {/* Full-height hit target, wider than the bar itself. */}
              <rect
                className="hit-target"
                x={PAD.left + band * i}
                y={PAD.top}
                width={band}
                height={plotH}
                onPointerEnter={() => setHover(i)}
              />
            </g>
          ))}
        </svg>
      )}
      {hover !== null && (
        <div className="tooltip tooltip-above" style={{ left: center(hover), top: y(data[hover].value) - 8 }}>
          <div className="tooltip-title">{data[hover].label}</div>
          <strong>{formatValue(data[hover].value)}</strong>
        </div>
      )}
    </div>
  );
}
