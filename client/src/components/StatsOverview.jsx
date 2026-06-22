import React, { useEffect, useState } from 'react';
import StatCard from './StatCard';
import { fetchLogStats } from '../services/logService';

export default function StatsOverview({ refreshKey }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchLogStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setStats({ totalLogs: 0, highSeverityLogs: 0, resolvedLogs: 0, unresolvedLogs: 0 });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const s = stats || { totalLogs: 0, highSeverityLogs: 0, resolvedLogs: 0, unresolvedLogs: 0 };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="Total Logs" value={s.totalLogs} loading={loading} />
      <StatCard label="High Severity" value={s.highSeverityLogs} accentClass="text-red-400" loading={loading} />
      <StatCard label="Resolved" value={s.resolvedLogs} accentClass="text-green-400" loading={loading} />
      <StatCard label="Unresolved" value={s.unresolvedLogs} accentClass="text-orange-400" loading={loading} />
    </div>
  );
}
