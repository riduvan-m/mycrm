import { BarChart } from '../charts/BarChart';
import { DataTable } from '../charts/DataTable';
import { DonutChart } from '../charts/DonutChart';
import { LineChart } from '../charts/LineChart';
import { formatCurrency, formatMillions, formatNumber } from '../charts/utils';
import { balance, customersByCountry, sales, stats, topProducts } from '../data';
import { Icon } from './Icon';
import { StatCard } from './StatCard';

const lineSeries = [
  { label: 'Gross', color: 'var(--series-2)', values: balance.gross },
  { label: 'Net total', color: 'var(--series-1)', values: balance.net },
];

const countryColors = ['var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)'];
const countrySlices = customersByCountry.map((d, i) => ({ ...d, color: countryColors[i] }));
const totalCustomers = customersByCountry.reduce((sum, d) => sum + d.value, 0);

function exportSalesCsv() {
  const rows = [['Month', 'Total sales ($M)'], ...sales.map((d) => [d.label, d.value])];
  const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sales.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function Dashboard() {
  return (
    <>
      <header className="page-header">
        <h2>Dashboard</h2>
        <div className="actions">
          <button className="btn" onClick={exportSalesCsv}>
            <Icon name="download" />
            Export
          </button>
          <button className="btn btn-primary">
            <Icon name="plus" />
            Create lead
          </button>
        </div>
      </header>

      <div className="dashboard">
        <div className="stats">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="row">
          <section className="card">
            <div className="card-header">
              <h3 className="card-title">Balance analytics</h3>
              <div className="legend">
                {lineSeries.map((s) => (
                  <span key={s.label} className="legend-item">
                    <span className="swatch" style={{ background: s.color }} />
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
            <LineChart labels={balance.labels} series={lineSeries} formatValue={formatMillions} />
            <DataTable
              caption="Balance analytics, in millions of dollars"
              columns={['Month', 'Gross', 'Net total']}
              rows={balance.labels.map((m, i) => [m, balance.gross[i], balance.net[i]])}
            />
          </section>

          <section className="card">
            <div className="card-header">
              <h3 className="card-title">Customers by country</h3>
            </div>
            <DonutChart data={countrySlices} centerValue={formatNumber(totalCustomers)} centerLabel="customers" />
          </section>
        </div>

        <div className="row">
          <section className="card">
            <div className="card-header">
              <h3 className="card-title">Total sales</h3>
            </div>
            <BarChart data={sales} formatValue={formatMillions} />
            <DataTable
              caption="Total sales by month, in millions of dollars"
              columns={['Month', 'Total sales']}
              rows={sales.map((d) => [d.label, d.value])}
            />
          </section>

          <section className="card">
            <div className="card-header">
              <h3 className="card-title">Top products</h3>
            </div>
            <ul className="product-list">
              {topProducts.map((p) => (
                <li key={p.name}>
                  <span className="avatar avatar-muted">{p.name[0]}</span>
                  <span className="product-name">{p.name}</span>
                  <span className="product-value">{formatCurrency(p.revenue)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
