import React from 'react';

export default function StatCard({ label, value, accentClass, loading }) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
      {loading ? (
        <div className="h-7 w-20 bg-slate-700/40 rounded animate-pulse mt-1" />
      ) : (
        <span className={`text-2xl font-semibold ${accentClass || 'text-slate-100'}`}>
          {value.toLocaleString()}
        </span>
      )}
    </div>
  );
}
