import { useMemo, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { AddEventDialog } from './AddEventDialog';
import { eventType, eventTypes, toDateKey, useEvents, type CalendarEvent } from './events';
import './calendar.css';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const parseDateKey = (key: string) => new Date(`${key}T00:00`);

/** Every day shown in the month view: whole weeks, Monday first. */
function monthDays(month: Date): Date[] {
  const year = month.getFullYear();
  const index = month.getMonth();
  const leading = (new Date(year, index, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, index + 1, 0).getDate();
  const weeks = Math.ceil((leading + daysInMonth) / 7);
  return Array.from({ length: weeks * 7 }, (_, i) => new Date(year, index, i - leading + 1));
}

export function Calendar() {
  const { events, addEvent } = useEvents();
  const todayKey = toDateKey(new Date());
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState(todayKey);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of [...events].sort((a, b) => a.time.localeCompare(b.time))) {
      map.set(event.date, [...(map.get(event.date) ?? []), event]);
    }
    return map;
  }, [events]);

  const selectedEvents = byDate.get(selected) ?? [];

  function goToday() {
    setMonth(startOfMonth(new Date()));
    setSelected(todayKey);
  }

  function handleAdd(event: Omit<CalendarEvent, 'id'>) {
    addEvent(event);
    setSelected(event.date);
    setMonth(startOfMonth(parseDateKey(event.date)));
  }

  return (
    <>
      <header className="page-header">
        <h2>Calendar</h2>
        <div className="actions">
          <button className="btn btn-primary" onClick={() => dialogRef.current?.showModal()}>
            <Icon name="plus" />
            Event
          </button>
        </div>
      </header>

      <div className="calendar-nav">
        <button
          className="btn icon-btn"
          aria-label="Previous month"
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
        >
          ‹
        </button>
        <button className="btn" onClick={goToday}>
          Today
        </button>
        <button
          className="btn icon-btn"
          aria-label="Next month"
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
        >
          ›
        </button>
        <h3 className="calendar-month" aria-live="polite">
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
      </div>

      <div className="calendar-layout">
        <div className="card calendar-card">
          <div className="calendar-grid" aria-hidden="true">
            {WEEKDAYS.map((d) => (
              <div key={d} className="weekday">
                {d}
              </div>
            ))}
          </div>
          <div className="calendar-grid">
            {monthDays(month).map((day) => {
              const key = toDateKey(day);
              const list = byDate.get(key) ?? [];
              const className = [
                'day',
                day.getMonth() !== month.getMonth() && 'outside',
                key === todayKey && 'today',
                key === selected && 'selected',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <button
                  key={key}
                  className={className}
                  aria-pressed={key === selected}
                  aria-label={`${day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}, ${list.length} ${list.length === 1 ? 'event' : 'events'}`}
                  onClick={() => setSelected(key)}
                >
                  <span className="day-number">{day.getDate()}</span>
                  <span className="day-events">
                    {list.slice(0, 2).map((event) => (
                      <span key={event.id} className="event-chip">
                        <span className="event-bar" style={{ background: eventType(event.type).color }} />
                        <span className="event-text">
                          {event.time} {event.title}
                        </span>
                      </span>
                    ))}
                    {list.length > 2 && <span className="event-more">+{list.length - 2} more</span>}
                  </span>
                  {list.length > 0 && (
                    <span className="day-dots">
                      {list.slice(0, 3).map((event) => (
                        <span key={event.id} className="dot" style={{ background: eventType(event.type).color }} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="card agenda">
          <h3 className="card-title">
            {parseDateKey(selected).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          {selectedEvents.length === 0 ? (
            <p className="agenda-empty">No events on this day.</p>
          ) : (
            <ul className="agenda-list">
              {selectedEvents.map((event) => {
                const type = eventType(event.type);
                return (
                  <li key={event.id}>
                    <span className="agenda-time">{event.time}</span>
                    <span className="event-bar" style={{ background: type.color }} />
                    <div>
                      <div className="agenda-title">{event.title}</div>
                      <div className="agenda-sub">
                        {type.label}
                        {event.with && ` · ${event.with}`}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="legend type-legend">
            {eventTypes.map((t) => (
              <span key={t.id} className="legend-item">
                <span className="swatch" style={{ background: t.color }} />
                {t.label}
              </span>
            ))}
          </div>
        </aside>
      </div>

      {/* Keyed on the selected day so the form's date defaults to it. */}
      <AddEventDialog key={selected} ref={dialogRef} defaultDate={selected} onAdd={handleAdd} />
    </>
  );
}
