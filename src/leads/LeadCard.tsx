import type { PointerEvent } from 'react';
import { Icon } from '../components/Icon';
import { formatValue, stages, type Lead, type StageId } from './data';

type Props = {
  lead: Lead;
  hidden?: boolean;
  onPointerDown?: (e: PointerEvent<HTMLElement>) => void;
  onMove?: (stage: StageId) => void;
};

export function LeadCard({ lead, hidden, onPointerDown, onMove }: Props) {
  const won = lead.stage === 'won';
  const overdue = lead.overdue && !won;
  const className = ['lead-card', overdue && 'overdue', won && 'won'].filter(Boolean).join(' ');

  return (
    <article
      className={className}
      data-lead-id={lead.id}
      hidden={hidden}
      onPointerDown={onPointerDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="lead-title">{lead.title}</div>
      <div className="lead-company">{lead.company}</div>
      <div className="lead-footer">
        <span className="avatar avatar-muted" title="Owner">
          {lead.owner}
        </span>
        {won && <span className="pill pill-success">✓ Won</span>}
        {overdue && <span className="pill pill-danger">! Overdue</span>}
        <span className="lead-value">{formatValue(lead.value)}</span>
        {onMove && (
          // Tap-friendly alternative to dragging: a native select hidden over the arrow icon.
          <label className="move" title="Move to stage">
            <Icon name="arrow" />
            <select
              value={lead.stage}
              aria-label={`Move ${lead.title} to stage`}
              onChange={(e) => onMove(e.target.value as StageId)}
            >
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </article>
  );
}
