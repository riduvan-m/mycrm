import { Icon, type IconName } from './Icon';

export const sections = ['Dashboard', 'Leads', 'Contacts','Companies', 'Deals', 'Calendar', 'Reports'] as const;
export type Section = (typeof sections)[number];

const icons: Record<Section, IconName> = {
  Dashboard: 'dashboard',
  Leads: 'leads',
  Contacts: 'contacts',
  Companies: 'companies',
  Deals: 'deals',
  Calendar: 'calendar',
  Reports: 'reports',
};

type Props = {
  active: Section;
  onSelect: (section: Section) => void;
};

export function Sidebar({ active, onSelect }: Props) {
  return (
    <aside className="sidebar">
      <h1 className="brand">
        <span className="brand-mark">CR</span>
        React CRM
      </h1>
      <nav className="nav">
        {sections.map((section) => (
          <button
            key={section}
            className={section === active ? 'nav-item active' : 'nav-item'}
            aria-current={section === active ? 'page' : undefined}
            onClick={() => onSelect(section)}
          >
            <Icon name={icons[section]} />
            {section}
          </button>
        ))}
      </nav>
      <div className="nav nav-bottom">
        <button className="nav-item">
          <Icon name="notifications" />
          Notifications
        </button>
        <button className="nav-item">
          <Icon name="settings" />
          Settings
        </button>
      </div>
      <div className="user">
        <span className="avatar">AU</span>
        <div>
          <div className="user-name">Admin User</div>
          <div className="user-role">Admin</div>
        </div>
      </div>
    </aside>
  );
}
