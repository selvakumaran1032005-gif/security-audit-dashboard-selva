import React from 'react';

export default function Pagination({ page, totalPages, totalCount, limit, onPageChange }) {
  if (totalCount === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalCount);

  const goTo = (p) => {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border text-sm text-slate-400">
      <span>
        Showing <span className="text-slate-200">{start}</span>–<span className="text-slate-200">{end}</span> of{' '}
        <span className="text-slate-200">{totalCount.toLocaleString()}</span> logs
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-lg border border-surface-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-card transition-colors"
        >
          Previous
        </button>
        <span className="px-2">
          Page <span className="text-slate-200">{page}</span> of <span className="text-slate-200">{totalPages}</span>
        </span>
        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg border border-surface-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-card transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
