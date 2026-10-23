import type { Stat } from '../data';

export function StatCard({ label, value, change }: Stat) {
  const up = change >= 0;
  return (
    <section className="card">
      <h3 className="card-title">{label}</h3>
      <div className="stat-row">
        <span className="stat-value">{value}</span>
        <span className={up ? 'delta up' : 'delta down'}>
          <span aria-hidden="true">{up ? '↑' : '↓'}</span> {up ? 'Up' : 'Down'} {Math.abs(change)}%
        </span>
      </div>
      <p className="stat-note">vs last month</p>
    </section>
  );
}
