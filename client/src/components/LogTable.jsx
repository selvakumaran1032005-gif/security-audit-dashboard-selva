import React from 'react';
import SortableHeader from './SortableHeader';
import { SeverityBadge, StatusBadge } from './Badges';
import { formatTimestamp } from '../utils/formatters';

const COLUMNS = [
  { field: 'actor', label: 'Actor' },
  { field: 'role', label: 'Role' },
  { field: 'action', label: 'Action' },
  { field: 'resource', label: 'Resource' },
  { field: 'resourceType', label: 'Resource Type' },
  { field: 'ipAddress', label: 'IP Address' },
  { field: 'region', label: 'Region' },
  { field: 'severity', label: 'Severity' },
  { field: 'status', label: 'Status' },
  { field: 'timestamp', label: 'Timestamp' },
];

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-t border-surface-border">
          {COLUMNS.map((c) => (
            <td key={c.field} className="px-4 py-3">
              <div className="h-3.5 bg-slate-700/40 rounded animate-pulse w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function LogTable({ logs, loading, error, sortBy, order, onSort }) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface/60">
            <tr>
              {COLUMNS.map((c) => (
                <SortableHeader
                  key={c.field}
                  field={c.field}
                  label={c.label}
                  sortBy={sortBy}
                  order={order}
                  onSort={onSort}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <LoadingRows />}

            {!loading && error && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-red-400">
                  Failed to load logs: {error}
                </td>
              </tr>
            )}

            {!loading && !error && logs.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-slate-500">
                  No audit logs match the current filters.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              logs.map((log) => (
                <tr key={log._id} className="border-t border-surface-border hover:bg-surface/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-100 whitespace-nowrap">{log.actor}</td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{log.role}</td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{log.action}</td>
                  <td className="px-4 py-3 text-slate-300 max-w-[220px] truncate" title={log.resource}>
                    {log.resource}
                  </td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{log.resourceType}</td>
                  <td className="px-4 py-3 text-slate-300 font-mono text-xs whitespace-nowrap">{log.ipAddress}</td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{log.region}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <SeverityBadge severity={log.severity} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatTimestamp(log.timestamp)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
