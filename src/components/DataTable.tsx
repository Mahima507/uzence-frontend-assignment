
import React, { useMemo, useState } from 'react';
import { clsx } from 'clsx';

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
}

export interface DataTableProps<T extends { id?: string | number }> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  emptyText?: string;
  primaryKey?: keyof T; // defaults to 'id' if present
}

type SortState<T> = { key: keyof T | null; direction: 'asc' | 'desc' | null };

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  emptyText = 'No data',
  primaryKey,
}: DataTableProps<T>) {
  const keyField = (primaryKey ?? ('id' as keyof T));

  const [sort, setSort] = useState<SortState<T>>({ key: null, direction: null });
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const sorted = useMemo(() => {
    if (!sort.key || !sort.direction) return data;
    const arr = [...data];
    arr.sort((a, b) => {
      const av = a[sort.key as keyof T];
      const bv = b[sort.key as keyof T];
      if (av == null && bv == null) return 0;
      if (av == null) return -1;
      if (bv == null) return 1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sort.direction === 'asc' ? av - bv : bv - av;
      }
      return sort.direction === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [data, sort]);

  const allSelected = selectable && sorted.length > 0 && sorted.every(row => selected.has((row[keyField] as any) ?? (JSON.stringify(row))));

  const toggleAll = () => {
    if (!selectable) return;
    const next = new Set<string | number>();
    if (!allSelected) {
      sorted.forEach(r => {
        const k = (r[keyField] as any) ?? (JSON.stringify(r));
        next.add(k);
      });
    }
    setSelected(next);
    onRowSelect?.(sorted.filter(r => next.has(((r as any)[keyField]) ?? JSON.stringify(r))));
  };

  const toggleOne = (row: T) => {
    if (!selectable) return;
    const k = ((row as any)[keyField]) ?? JSON.stringify(row);
    const next = new Set(selected);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setSelected(next);
    onRowSelect?.(sorted.filter(r => next.has(((r as any)[keyField]) ?? JSON.stringify(r))));
  };

  const headerCell = (col: Column<T>) => {
    const isSorted = sort.key === col.dataIndex;
    const dir = isSorted ? sort.direction : null;
    const sortable = col.sortable;
    return (
      <th
        key={col.key}
        scope="col"
        className={clsx('px-4 py-2 text-left text-sm font-medium', sortable && 'cursor-pointer select-none')}
        onClick={() => {
          if (!sortable) return;
          setSort(prev => {
            if (prev.key !== col.dataIndex) return { key: col.dataIndex, direction: 'asc' };
            if (prev.direction === 'asc') return { key: col.dataIndex, direction: 'desc' };
            return { key: null, direction: null };
          });
        }}
        aria-sort={isSorted ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        <span className="inline-flex items-center gap-1">
          {col.title}
          {sortable && (
            <span aria-hidden className="text-xs">
              {isSorted ? (dir === 'asc' ? '▲' : '▼') : '↕'}
            </span>
          )}
        </span>
      </th>
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200" role="table">
        <thead className="bg-gray-50" role="rowgroup">
          <tr role="row">
            {selectable && (
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={allSelected}
                  onChange={toggleAll}
                />
              </th>
            )}
            {columns.map(headerCell)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100" role="rowgroup">
          {loading ? (
            <tr>
              <td colSpan={(columns.length + (selectable ? 1 : 0))} className="px-4 py-8 text-center text-sm text-gray-500">
                Loading...
              </td>
            </tr>
          ) : sorted.length === 0 ? (
            <tr>
              <td colSpan={(columns.length + (selectable ? 1 : 0))} className="px-4 py-8 text-center text-sm text-gray-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            sorted.map((row, idx) => {
              const k = ((row as any)[keyField]) ?? JSON.stringify(row);
              const isSelected = selected.has(k);
              return (
                <tr key={k} role="row" className={clsx(isSelected && 'bg-blue-50/40')}>
                  {selectable && (
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        aria-label={`Select row ${idx + 1}`}
                        checked={isSelected}
                        onChange={() => toggleOne(row)}
                      />
                    </td>
                  )}
                  {columns.map(col => {
                    const value = row[col.dataIndex];
                    return (
                      <td key={String(col.key)} className="px-4 py-2 text-sm">
                        {col.render ? col.render(value, row) : (value as any)?.toString()}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
