import React from 'react';

export default function SortableHeader({ field, label, sortBy, order, onSort }) {
  const isActive = sortBy === field;

  return (
    <th
      onClick={() => onSort(field)}
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors whitespace-nowrap"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive && <span className="text-red-400">{order === 'asc' ? '▲' : '▼'}</span>}
      </span>
    </th>
  );
}
