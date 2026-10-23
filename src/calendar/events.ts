import { newId, usePersistentState } from '../lib/storage';

export const eventTypes = [
  { id: 'meeting', label: 'Meeting', color: 'var(--series-1)' },
  { id: 'call', label: 'Call', color: 'var(--series-2)' },
  { id: 'demo', label: 'Demo', color: 'var(--series-3)' },
  { id: 'follow-up', label: 'Follow-up', color: 'var(--series-4)' },
] as const;

export type EventTypeId = (typeof eventTypes)[number]['id'];

export type CalendarEvent = {
  id: string;
  /** YYYY-MM-DD, local time. */
  date: string;
  /** HH:MM, 24-hour. */
  time: string;
  title: string;
  type: EventTypeId;
  with?: string;
};

export const eventType = (id: EventTypeId) => eventTypes.find((t) => t.id === id)!;

const pad = (n: number) => String(n).padStart(2, '0');
export const toDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Sample events are placed relative to today so the calendar never opens empty.
function daysFromToday(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toDateKey(d);
}

const sampleEvents: CalendarEvent[] = [
  { id: 'e1', date: daysFromToday(-9), time: '10:00', title: 'Kick-off meeting', type: 'meeting', with: 'Fantastic Hotels Ltd' },
  { id: 'e2', date: daysFromToday(-6), time: '14:30', title: 'Pricing call', type: 'call', with: 'Rio Housing' },
  { id: 'e3', date: daysFromToday(-3), time: '11:00', title: 'Product demo', type: 'demo', with: 'Bringit Media' },
  { id: 'e4', date: daysFromToday(-1), time: '16:00', title: 'Send proposal', type: 'follow-up', with: 'Park Place' },
  { id: 'e5', date: daysFromToday(0), time: '09:30', title: 'Discovery call', type: 'call', with: 'Willamette Co' },
  { id: 'e6', date: daysFromToday(0), time: '13:00', title: 'Contract review', type: 'meeting', with: 'Maria M. Retail Ltd' },
  { id: 'e7', date: daysFromToday(0), time: '15:30', title: 'Check in on renewal', type: 'follow-up', with: 'Trip Abroad Ltd' },
  { id: 'e8', date: daysFromToday(1), time: '10:30', title: 'Platform demo', type: 'demo', with: 'JD Manufacturing' },
  { id: 'e9', date: daysFromToday(3), time: '12:00', title: 'Lunch with CTO', type: 'meeting', with: 'Willamette Co' },
  { id: 'e10', date: daysFromToday(5), time: '09:00', title: 'Quarterly review', type: 'meeting', with: 'Fantastic Hotels Ltd' },
  { id: 'e11', date: daysFromToday(5), time: '15:00', title: 'Negotiation call', type: 'call', with: 'Maria M. Retail Ltd' },
  { id: 'e12', date: daysFromToday(8), time: '11:30', title: 'Follow up on demo', type: 'follow-up', with: 'JD Manufacturing' },
  { id: 'e13', date: daysFromToday(12), time: '14:00', title: 'Onboarding session', type: 'demo', with: 'Trip Abroad Ltd' },
  { id: 'e14', date: daysFromToday(16), time: '10:00', title: 'Budget call', type: 'call', with: 'Park Place' },
];

export function useEvents() {
  const [events, setEvents] = usePersistentState<CalendarEvent[]>('crm.events', sampleEvents);

  function addEvent(event: Omit<CalendarEvent, 'id'>) {
    setEvents((prev) => [...prev, { ...event, id: newId() }]);
  }

  return { events, addEvent };
}
