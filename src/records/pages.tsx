import { formatValue, stages } from '../leads/data';
import { companies, contacts, deals, type Company, type Contact, type Deal } from './data';
import { ListPage, type Column } from './ListPage';

const companyName = new Map(companies.map((c) => [c.id, c.name]));
const stageLabel = new Map<string, string>(stages.map((s) => [s.id, s.label]));

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

const formatDate = (date: string) =>
  new Date(`${date}T00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const count = (n: number, singular: string, plural = `${singular}s`) => `${n} ${n === 1 ? singular : plural}`;
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

const statusClass: Record<Contact['status'], string> = {
  Customer: 'pill pill-success',
  Prospect: 'pill pill-neutral',
  Churned: 'pill pill-danger',
};

const contactColumns: Column<Contact>[] = [
  {
    header: 'Name',
    cell: (c) => (
      <div className="cell-main">
        <span className="avatar avatar-muted">{initials(c.name)}</span>
        <div>
          <div className="cell-title">{c.name}</div>
          <div className="cell-sub">{c.jobTitle}</div>
        </div>
      </div>
    ),
  },
  { header: 'Company', cell: (c) => companyName.get(c.companyId) },
  { header: 'Email', cell: (c) => <a href={`mailto:${c.email}`}>{c.email}</a> },
  { header: 'Phone', cell: (c) => <a href={`tel:${c.phone.replace(/\D/g, '')}`}>{c.phone}</a> },
  { header: 'Status', cell: (c) => <span className={statusClass[c.status]}>{c.status}</span> },
];

const companyColumns: Column<Company>[] = [
  {
    header: 'Company',
    cell: (c) => (
      <div className="cell-main">
        <span className="avatar avatar-muted">{initials(c.name)}</span>
        <div>
          <div className="cell-title">{c.name}</div>
          <div className="cell-sub">{c.website}</div>
        </div>
      </div>
    ),
  },
  { header: 'Industry', cell: (c) => c.industry },
  { header: 'City', cell: (c) => c.city },
  { header: 'Employees', numeric: true, cell: (c) => c.employees.toLocaleString('en-US') },
  { header: 'Contacts', numeric: true, cell: (c) => contacts.filter((p) => p.companyId === c.id).length },
  {
    header: 'Open deals',
    numeric: true,
    cell: (c) => formatValue(sum(deals.filter((d) => d.companyId === c.id && d.stage !== 'won').map((d) => d.value))),
  },
];

const dealColumns: Column<Deal>[] = [
  {
    header: 'Deal',
    cell: (d) => (
      <div>
        <div className="cell-title">{d.title}</div>
        <div className="cell-sub">{companyName.get(d.companyId)}</div>
      </div>
    ),
  },
  {
    header: 'Stage',
    cell: (d) => (
      <span className={d.stage === 'won' ? 'pill pill-success' : 'pill pill-neutral'}>{stageLabel.get(d.stage)}</span>
    ),
  },
  { header: 'Value', numeric: true, cell: (d) => formatValue(d.value) },
  { header: 'Close date', cell: (d) => formatDate(d.closeDate) },
  { header: 'Owner', cell: (d) => <span className="avatar avatar-muted">{d.owner}</span> },
];

export function Contacts() {
  return (
    <ListPage
      title="Contacts"
      rows={contacts}
      columns={contactColumns}
      rowKey={(c) => c.id}
      searchText={(c) => `${c.name} ${c.email} ${c.jobTitle} ${companyName.get(c.companyId)}`}
      summary={(rows) => count(rows.length, 'contact')}
    />
  );
}

export function Companies() {
  return (
    <ListPage
      title="Companies"
      rows={companies}
      columns={companyColumns}
      rowKey={(c) => c.id}
      searchText={(c) => `${c.name} ${c.industry} ${c.city}`}
      summary={(rows) => count(rows.length, 'company', 'companies')}
    />
  );
}

export function Deals() {
  return (
    <ListPage
      title="Deals"
      rows={deals}
      columns={dealColumns}
      rowKey={(d) => d.id}
      searchText={(d) => `${d.title} ${companyName.get(d.companyId)} ${stageLabel.get(d.stage)}`}
      summary={(rows) => `${formatValue(sum(rows.map((d) => d.value)))} · ${count(rows.length, 'deal')}`}
    />
  );
}
