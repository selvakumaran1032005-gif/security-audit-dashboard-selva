import React, { useEffect, useState } from 'react';
import { fetchFilterOptions } from '../services/logService';

const SEVERITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUS_OPTIONS = ['Resolved', 'Unresolved', 'Investigating', 'Ignored'];

function Select({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-surface-card border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/40"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function FilterPanel({ filters, onChange, onReset }) {
  const [dynamicOptions, setDynamicOptions] = useState({ actions: [], roles: [], regions: [] });

  useEffect(() => {
    fetchFilterOptions()
      .then(setDynamicOptions)
      .catch(() => setDynamicOptions({ actions: [], roles: [], regions: [] }));
  }, []);

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4 mb-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 items-end">
        <Select label="Severity" value={filters.severity} onChange={(v) => onChange({ severity: v })} options={SEVERITY_OPTIONS} />
        <Select label="Status" value={filters.status} onChange={(v) => onChange({ status: v })} options={STATUS_OPTIONS} />
        <Select label="Action" value={filters.action} onChange={(v) => onChange({ action: v })} options={dynamicOptions.actions} />
        <Select label="Role" value={filters.role} onChange={(v) => onChange({ role: v })} options={dynamicOptions.roles} />
        <Select label="Region" value={filters.region} onChange={(v) => onChange({ region: v })} options={dynamicOptions.regions} />

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/40"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/40"
          />
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="text-xs px-3 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:bg-surface hover:text-white transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
