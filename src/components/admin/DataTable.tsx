'use client';

import { ReactNode, useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchableColumns?: (keyof T)[];
  onRowClick?: (row: T) => void;
  actions?: (row: T) => ReactNode;
  emptyState?: {
    title: string;
    description: string;
    icon?: ReactNode;
  };
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  searchableColumns,
  onRowClick,
  actions,
  emptyState,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering and sorting
  const processedData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchQuery && searchableColumns) {
      result = result.filter((row) =>
        searchableColumns.some((col) => {
          const value = row[col];
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, sortKey, sortDirection, searchQuery, searchableColumns]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Search Bar */}
      {searchableColumns && searchableColumns.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {processedData.length === 0 ? (
          <div className="px-6 py-12 text-center">
            {emptyState ? (
              <div>
                {emptyState.icon && <div className="mb-4 flex justify-center">{emptyState.icon}</div>}
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{emptyState.title}</h3>
                <p className="text-xs text-gray-500">{emptyState.description}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            {/* Header */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                      col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {col.sortable && sortKey === col.key && (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-blue-600" />
                        )
                      )}
                    </div>
                  </th>
                ))}
                {actions && <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">
              {processedData.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-6 py-4 text-gray-700">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">{actions(row)}</div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
