import { useEffect, useRef, useState } from 'react';

/** Tracks an element's rendered width so charts draw at real pixel size. */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

/** Evenly spaced axis ticks from 0 to the first round step at or above max. */
export function niceTicks(max: number, count = 3): number[] {
  const raw = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= raw)!;
  const ticks: number[] = [];
  for (let v = 0; v < max + step; v += step) ticks.push(v);
  return ticks;
}

/** Smooth path through points; control points sit at horizontal midpoints, so it never overshoots. */
export function smoothPath(points: (readonly [number, number])[]): string {
  return points
    .map(([x, y], i) => {
      if (i === 0) return `M${x},${y}`;
      const [px, py] = points[i - 1];
      const mx = (px + x) / 2;
      return `C${mx},${py} ${mx},${y} ${x},${y}`;
    })
    .join(' ');
}

/** Bar with 4px rounded top corners, square at the baseline. */
export function barPath(x: number, y: number, w: number, h: number, radius = 4): string {
  const r = Math.min(radius, w / 2, h);
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

export const formatMillions = (v: number) => (v === 0 ? '0' : `$${v}M`);

export const formatCurrency = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

export const formatNumber = (v: number) => new Intl.NumberFormat('en-US').format(v);
