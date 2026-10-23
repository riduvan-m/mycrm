import { useState } from 'react';

type Slice = { label: string; value: number; color: string };

type Props = {
  data: Slice[];
  centerValue: string;
  centerLabel: string;
};

const SIZE = 180;
const THICKNESS = 24;
const RADIUS = (SIZE - THICKNESS) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 2;

const formatPercent = (share: number) => `${(share * 100).toFixed(1)}%`;

export function DonutChart({ data, centerValue, centerLabel }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const active = hover === null ? null : data[hover];

  let start = 0;
  const slices = data.map((d) => {
    const length = (d.value / total) * CIRCUMFERENCE;
    const slice = { ...d, dash: Math.max(length - GAP, 0), offset: -start };
    start += length;
    return slice;
  });

  return (
    <div className="donut" onPointerLeave={() => setHover(null)}>
      <div className="donut-figure">
        <svg width={SIZE} height={SIZE} aria-hidden="true">
          <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
            {slices.map((s, i) => (
              <circle
                key={s.label}
                className="donut-slice"
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                strokeWidth={hover === i ? THICKNESS + 4 : THICKNESS}
                strokeDasharray={`${s.dash} ${CIRCUMFERENCE - s.dash}`}
                strokeDashoffset={s.offset}
                style={{ stroke: s.color }}
                onPointerEnter={() => setHover(i)}
              />
            ))}
          </g>
        </svg>
        <div className="donut-center">
          <strong>{active ? formatPercent(active.value / total) : centerValue}</strong>
          <span>{active ? active.label : centerLabel}</span>
        </div>
      </div>
      <ul className="legend-list">
        {data.map((d, i) => (
          <li key={d.label} className={hover === i ? 'active' : undefined} onPointerEnter={() => setHover(i)}>
            <span className="swatch" style={{ background: d.color }} />
            {d.label}
            <span className="legend-value">{formatPercent(d.value / total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
