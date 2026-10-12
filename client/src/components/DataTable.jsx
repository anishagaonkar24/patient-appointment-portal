// columns: [{ key, label, render? }]   rows: array of records
function DataTable({ columns, rows, onDelete, emptyText = 'No records found.' }) {
  if (rows.length === 0) {
    return <p className="empty">{emptyText}</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {onDelete && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
              {onDelete && (
                <td>
                  <button className="btn danger" onClick={() => onDelete(row)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
