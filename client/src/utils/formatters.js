export const formatTimestamp = (isoString) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const SEVERITY_STYLES = {
  CRITICAL: 'bg-red-950 text-red-300 border-red-800',
  HIGH: 'bg-red-500/10 text-red-400 border-red-500/30',
  MEDIUM: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  LOW: 'bg-green-500/10 text-green-400 border-green-500/30',
};

export const STATUS_STYLES = {
  Resolved: 'bg-green-500/10 text-green-400',
  Unresolved: 'bg-red-500/10 text-red-400',
  Investigating: 'bg-blue-500/10 text-blue-400',
  Ignored: 'bg-slate-500/10 text-slate-400',
};
