import React from 'react';
import { SEVERITY_STYLES, STATUS_STYLES } from '../utils/formatters';

export function SeverityBadge({ severity }) {
  const cls = SEVERITY_STYLES[severity] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      {severity}
    </span>
  );
}

export function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || 'bg-slate-500/10 text-slate-400';
  return <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{status}</span>;
}
