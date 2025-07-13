import React from 'react';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  zebra?: boolean;
  compact?: boolean;
  hoverable?: boolean;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  className = '',
  zebra = false,
  compact = false,
  hoverable = false,
}: TableProps<T>) {
  const tableClasses = [
    'table',
    'w-full',
    zebra && 'table-zebra',
    compact && 'table-compact',
    hoverable && 'table-hover',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="overflow-x-auto">
      <table className={tableClasses}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {column.render 
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}