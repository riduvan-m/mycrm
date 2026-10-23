import { Fragment, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { AddLeadDialog } from './AddLeadDialog';
import { formatValue, stages } from './data';
import { LeadCard } from './LeadCard';
import { useCardDrag } from './useCardDrag';
import { useLeads } from './useLeads';
import './leads.css';

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
const countLabel = (n: number) => `${n} ${n === 1 ? 'lead' : 'leads'}`;

export function Pipeline() {
  const { leads, moveLead, addLead } = useLeads();
  const { drag, boardRef, startDrag } = useCardDrag(moveLead);
  const [query, setQuery] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  const q = query.trim().toLowerCase();
  const visible = q ? leads.filter((l) => `${l.title} ${l.company}`.toLowerCase().includes(q)) : leads;
  const dragged = drag && leads.find((l) => l.id === drag.id);
  const placeholder = drag && <div className="drop-placeholder" style={{ height: drag.height }} />;

  return (
    <>
      <header className="page-header">
        <h2>Leads</h2>
        <div className="actions">
          <button className="btn btn-primary" onClick={() => dialogRef.current?.showModal()}>
            <Icon name="plus" />
            Lead
          </button>
        </div>
      </header>

      <div className="toolbar">
        <input
          type="search"
          className="search"
          placeholder="Search leads"
          aria-label="Search leads"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="toolbar-summary">
          {formatValue(sum(visible.map((l) => l.value)))} · {countLabel(visible.length)}
        </span>
      </div>

      <div ref={boardRef} className={drag ? 'board dragging' : 'board'}>
        {stages.map((stage) => {
          const items = visible.filter((l) => l.stage === stage.id);
          const isOver = drag?.overStage === stage.id;
          return (
            <section
              key={stage.id}
              className={isOver ? 'column over' : 'column'}
              data-stage={stage.id}
              aria-label={stage.label}
            >
              <header className="column-header">
                <h3>{stage.label}</h3>
                <span>
                  {formatValue(sum(items.map((l) => l.value)))} · {countLabel(items.length)}
                </span>
              </header>
              <div className="column-body">
                {items.map((lead) => (
                  <Fragment key={lead.id}>
                    {isOver && drag.beforeId === lead.id && placeholder}
                    <LeadCard
                      lead={lead}
                      hidden={drag?.id === lead.id}
                      onPointerDown={(e) => startDrag(e, lead.id)}
                      onMove={(target) => moveLead(lead.id, target, null)}
                    />
                  </Fragment>
                ))}
                {isOver && drag.beforeId === null && placeholder}
                {items.length === 0 && !isOver && <p className="column-empty">Drop leads here</p>}
              </div>
            </section>
          );
        })}
      </div>

      {drag && dragged && (
        <div
          className="drag-ghost"
          style={{ width: drag.width, transform: `translate(${drag.x - drag.offsetX}px, ${drag.y - drag.offsetY}px)` }}
        >
          <LeadCard lead={dragged} />
        </div>
      )}

      <AddLeadDialog ref={dialogRef} onAdd={addLead} />
    </>
  );
}
