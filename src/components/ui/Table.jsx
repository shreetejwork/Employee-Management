import { IoChevronUp, IoChevronDown } from 'react-icons/io5';

const Table = ({ columns, data, onSort, sortField, sortOrder, emptyMessage = 'No data found' }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-card sticky top-0 z-10">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={`
                px-4 py-3 text-left font-semibold text-primary border-b border-border
                ${col.sortable ? 'cursor-pointer select-none hover:bg-border/50' : ''}
                ${col.className || ''}
              `}
              onClick={() => col.sortable && onSort?.(col.key)}
            >
              <div className="flex items-center gap-1">
                {col.label}
                {col.sortable && sortField === col.key && (
                  sortOrder === 'asc'
                    ? <IoChevronUp size={14} />
                    : <IoChevronDown size={14} />
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center py-8 text-text-secondary">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr
              key={row.id || idx}
              className="border-b border-border hover:bg-primary-light/20 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-text ${col.className || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default Table;
