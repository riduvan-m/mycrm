import { useState, type PointerEvent } from 'react';
import { niceTicks, smoothPath, useElementWidth } from './utils';

type Series = { label: string; color: string; values: number[] };

type Props = {
  labels: string[];
  series: Series[];
  formatValue: (v: number) => string;
  height?: number;
};

const PAD = { top: 16, right: 56, bottom: 28, left: 44 };

export function LineChart({ labels, series, formatValue, height = 240 }: Props) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const ticks = niceTicks(Math.max(...series.flatMap((s) => s.values)));
  const yMax = ticks[ticks.length - 1];
  const plotW = Math.max(width - PAD.left - PAD.right, 0);
  const plotH = height - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (i * plotW) / (labels.length - 1);
  const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH;

  function handleMove(e: PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left - PAD.left) / plotW) * (labels.length - 1));
    setHover(Math.min(Math.max(i, 0), labels.length - 1));
  }

  return (
    <div ref={ref} className="chart">
      {width > 0 && (
        <svg
          width={width}
          height={height}
          aria-hidden="true"
          onPointerMove={handleMove}
          onPointerLeave={() => setHover(null)}
        >
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
          {labels.map((label, i) => (
            <text key={label} className="tick tick-x" x={x(i)} y={height - 8}>
              {label}
            </text>
          ))}
          {hover !== null && (
            <line className="crosshair" x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + plotH} />
          )}
          {series.map((s) => {
            const points = s.values.map((v, i) => [x(i), y(v)] as const);
            const [lastX, lastY] = points[points.length - 1];
            return (
              <g key={s.label}>
                <path className="line" d={smoothPath(points)} style={{ stroke: s.color }} />
                <text className="end-label" x={lastX + 8} y={lastY}>
                  {s.label}
                </text>
                {hover !== null && (
                  <circle className="marker" cx={x(hover)} cy={y(s.values[hover])} r={4} style={{ fill: s.color }} />
                )}
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && (
        <div
          className="tooltip"
          data-side={hover > (labels.length - 1) / 2 ? 'left' : 'right'}
          style={{ left: x(hover), top: PAD.top }}
        >
          <div className="tooltip-title">{labels[hover]}</div>
          {series.map((s) => (
            <div key={s.label} className="tooltip-row">
              <span className="swatch" style={{ background: s.color }} />
              {s.label}
              <strong>{formatValue(s.values[hover])}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
