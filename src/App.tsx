import { useState, type ComponentType } from 'react';
import { Calendar } from './calendar/Calendar';
import { Dashboard } from './components/Dashboard';
import { Sidebar, type Section } from './components/Sidebar';
import { Pipeline } from './leads/Pipeline';
import { Companies, Contacts, Deals } from './records/pages';

const pages: Partial<Record<Section, ComponentType>> = {
  Dashboard,
  Leads: Pipeline,
  Contacts,
  Companies,
  Deals,
  Calendar,
};

export default function App() {
  const [active, setActive] = useState<Section>('Dashboard');
  const Page = pages[active];

  return (
    <div className="layout">
      <Sidebar active={active} onSelect={setActive} />
      <main className="content">
        {Page ? (
          <Page />
        ) : (
          <>
            <header className="page-header">
              <h2>{active}</h2>
            </header>
            <div className="card">Nothing here yet.</div>
          </>
        )}
      </main>
    </div>
  );
}
