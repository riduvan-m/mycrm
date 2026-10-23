import type { FormEvent, Ref } from 'react';
import { stages, type Lead, type StageId } from './data';

type Props = {
  ref: Ref<HTMLDialogElement>;
  onAdd: (lead: Omit<Lead, 'id'>) => void;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export function AddLeadDialog({ ref, onAdd }: Props) {
  // The form uses method="dialog", so the dialog closes itself after a valid submit.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const data = new FormData(form);
    onAdd({
      title: String(data.get('title')).trim(),
      company: String(data.get('company')).trim(),
      owner: initials(String(data.get('owner'))),
      value: Number(data.get('value')),
      stage: data.get('stage') as StageId,
    });
    form.reset();
  }

  return (
    <dialog ref={ref} className="dialog" aria-labelledby="add-lead-title">
      <form method="dialog" onSubmit={handleSubmit}>
        <h3 id="add-lead-title">New lead</h3>
        <label>
          Title
          <input name="title" required />
        </label>
        <label>
          Company
          <input name="company" required />
        </label>
        <label>
          Value (USD)
          <input name="value" type="number" min="0" step="1" inputMode="numeric" required />
        </label>
        <label>
          Owner
          <input name="owner" placeholder="e.g. Jane Smith" required />
        </label>
        <label>
          Stage
          <select name="stage" defaultValue={stages[0].id}>
            {stages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <div className="dialog-actions">
          <button type="button" className="btn" onClick={(e) => e.currentTarget.closest('dialog')?.close()}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add lead
          </button>
        </div>
      </form>
    </dialog>
  );
}
