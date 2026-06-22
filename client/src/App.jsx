import React, { useState } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'upload', label: 'Upload Logs' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshSignal, setRefreshSignal] = useState(0);

  return (
    <DashboardLayout>
      <div className="flex gap-2 mb-6 border-b border-surface-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && <DashboardPage key={refreshSignal} />}
      {activeTab === 'upload' && (
        <UploadPage
          onUploadComplete={() => {
            setRefreshSignal((prev) => prev + 1);
            setActiveTab('dashboard');
          }}
        />
      )}
    </DashboardLayout>
  );
}
