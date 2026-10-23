type Props = {
  caption: string;
  columns: string[];
  rows: (string | number)[][];
};

/** Screen-reader copy of a chart's data, since the SVG itself is hidden from assistive tech. */
export function DataTable({ caption, columns, rows }: Props) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c} scope="col">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
