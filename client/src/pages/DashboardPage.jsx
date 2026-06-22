import React, { useState } from 'react';
import StatsOverview from '../components/StatsOverview';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import LogTable from '../components/LogTable';
import Pagination from '../components/Pagination';
import useLogs from '../hooks/useLogs';

export default function DashboardPage() {
  const {
    logs,
    pagination,
    filters,
    sortBy,
    order,
    page,
    loading,
    error,
    setPage,
    updateFilters,
    resetFilters,
    updateSort,
  } = useLogs();

  const [statsRefreshKey] = useState(0);

  return (
    <div>
      <StatsOverview refreshKey={statsRefreshKey} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <SearchBar onSearch={(value) => updateFilters({ search: value })} />
      </div>

      <FilterPanel filters={filters} onChange={updateFilters} onReset={resetFilters} />

      <LogTable logs={logs} loading={loading} error={error} sortBy={sortBy} order={order} onSort={updateSort} />

      <div className="bg-surface-card border border-t-0 border-surface-border rounded-b-xl">
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
