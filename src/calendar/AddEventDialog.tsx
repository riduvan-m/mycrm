import type { FormEvent, Ref } from 'react';
import { eventTypes, type CalendarEvent, type EventTypeId } from './events';

type Props = {
  ref: Ref<HTMLDialogElement>;
  defaultDate: string;
  onAdd: (event: Omit<CalendarEvent, 'id'>) => void;
};

export function AddEventDialog({ ref, defaultDate, onAdd }: Props) {
  // The form uses method="dialog", so the dialog closes itself after a valid submit.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const data = new FormData(form);
    const withWhom = String(data.get('with')).trim();
    onAdd({
      title: String(data.get('title')).trim(),
      date: String(data.get('date')),
      time: String(data.get('time')),
      type: data.get('type') as EventTypeId,
      with: withWhom || undefined,
    });
    form.reset();
  }

  return (
    <dialog ref={ref} className="dialog" aria-labelledby="add-event-title">
      <form method="dialog" onSubmit={handleSubmit}>
        <h3 id="add-event-title">New event</h3>
        <label>
          Title
          <input name="title" required />
        </label>
        <div className="form-row">
          <label>
            Date
            <input name="date" type="date" defaultValue={defaultDate} required />
          </label>
          <label>
            Time
            <input name="time" type="time" defaultValue="09:00" required />
          </label>
        </div>
        <label>
          Type
          <select name="type" defaultValue={eventTypes[0].id}>
            {eventTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          With (optional)
          <input name="with" placeholder="Company or contact" />
        </label>
        <div className="dialog-actions">
          <button type="button" className="btn" onClick={(e) => e.currentTarget.closest('dialog')?.close()}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add event
          </button>
        </div>
      </form>
    </dialog>
  );
}
