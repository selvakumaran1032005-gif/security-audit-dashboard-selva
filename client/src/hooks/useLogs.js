import { useCallback, useEffect, useState } from 'react';
import { fetchLogs } from '../services/logService';

const INITIAL_FILTERS = {
  severity: '',
  status: '',
  role: '',
  action: '',
  region: '',
  startDate: '',
  endDate: '',
  search: '',
};

export default function useLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalCount: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState('timestamp');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = {
      page,
      limit: pagination.limit,
      sortBy,
      order,
      ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')),
    };

    try {
      const response = await fetchLogs(params);
      setLogs(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, order, filters, pagination.limit]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const updateFilters = (partialFilters) => {
    setFilters((prev) => ({ ...prev, ...partialFilters }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  const updateSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  return {
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
    refetch: loadLogs,
  };
}
