import { newId, usePersistentState } from '../lib/storage';
import { sampleLeads, type Lead, type StageId } from './data';

export function useLeads() {
  const [leads, setLeads] = usePersistentState<Lead[]>('crm.leads', sampleLeads);

  /** Moves a lead into a stage, placed before `beforeId` or at the end of the column. */
  function moveLead(id: string, stage: StageId, beforeId: string | null) {
    setLeads((prev) => {
      const lead = prev.find((l) => l.id === id);
      if (!lead) return prev;
      const rest = prev.filter((l) => l.id !== id);
      const moved = { ...lead, stage };
      const at = beforeId ? rest.findIndex((l) => l.id === beforeId) : -1;
      return at === -1 ? [...rest, moved] : [...rest.slice(0, at), moved, ...rest.slice(at)];
    });
  }

  function addLead(lead: Omit<Lead, 'id'>) {
    setLeads((prev) => [...prev, { ...lead, id: newId() }]);
  }

  return { leads, moveLead, addLead };
}
