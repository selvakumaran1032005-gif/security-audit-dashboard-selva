import React from 'react';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-surface-border bg-surface-card/60 backdrop-blur sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold">
              SA
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">System Audit Dashboard</h1>
              <p className="text-xs text-slate-400">Security log monitoring & investigation</p>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-[1600px] mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
