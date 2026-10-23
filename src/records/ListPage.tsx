import { useState, type ReactNode } from 'react';
import './records.css';

export type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  numeric?: boolean;
};

type Props<T> = {
  title: string;
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  searchText: (row: T) => string;
  summary: (rows: T[]) => string;
};

/** Searchable table page. On narrow screens each row becomes a stacked card (see records.css). */
export function ListPage<T>({ title, rows, columns, rowKey, searchText, summary }: Props<T>) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const visible = q ? rows.filter((row) => searchText(row).toLowerCase().includes(q)) : rows;

  return (
    <>
      <header className="page-header">
        <h2>{title}</h2>
      </header>

      <div className="toolbar">
        <input
          type="search"
          className="search"
          placeholder={`Search ${title.toLowerCase()}`}
          aria-label={`Search ${title.toLowerCase()}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="toolbar-summary">{summary(visible)}</span>
      </div>

      <div className="card table-card">
        <table className="record-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.header} scope="col" className={c.numeric ? 'num' : undefined}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((c) => (
                  <td key={c.header} data-label={c.header} className={c.numeric ? 'num' : undefined}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="table-empty">
                  No {title.toLowerCase()} match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
