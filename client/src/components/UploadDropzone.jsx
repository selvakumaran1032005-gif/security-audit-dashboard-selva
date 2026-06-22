import React, { useCallback, useRef, useState } from 'react';
import { bulkUploadLogs } from '../services/logService';

const STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default function UploadDropzone({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState(null);
  const inputRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json')) {
      setStatus(STATUS.ERROR);
      setMessage('Only .json files are supported');
      return;
    }

    setStatus(STATUS.UPLOADING);
    setProgress(0);
    setMessage('');
    setSummary(null);

    try {
      const result = await bulkUploadLogs(file, setProgress);
      setStatus(STATUS.SUCCESS);
      setSummary(result);
      setMessage(`Uploaded ${result.insertedCount} records (${result.failedCount} failed)`);
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      setStatus(STATUS.ERROR);
      setMessage(err.message);
    }
  }, [onUploadComplete]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const onBrowse = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-6">
      <h2 className="text-base font-semibold mb-1">Bulk Upload Audit Logs</h2>
      <p className="text-sm text-slate-400 mb-4">
        Upload a JSON file containing an array of audit log records (up to 20,000 per request).
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
          isDragging ? 'border-red-500 bg-red-500/5' : 'border-surface-border hover:border-slate-500'
        }`}
      >
        <input ref={inputRef} type="file" accept=".json,application/json" className="hidden" onChange={onBrowse} />
        <svg className="w-10 h-10 text-slate-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
        <p className="text-sm text-slate-300">
          <span className="text-red-400 font-medium">Click to browse</span> or drag and drop a JSON file
        </p>
        <p className="text-xs text-slate-500 mt-1">.json files only</p>
      </div>

      {status === STATUS.UPLOADING && (
        <div className="mt-4">
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-red-500 transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-1">Uploading... {progress}%</p>
        </div>
      )}

      {status === STATUS.SUCCESS && (
        <div className="mt-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-3">
          {message}
          {summary?.sampleFailures?.length > 0 && (
            <p className="text-xs text-green-300/70 mt-1">
              Some records failed validation. {summary.sampleFailures.length} sample errors available.
            </p>
          )}
        </div>
      )}

      {status === STATUS.ERROR && (
        <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {message}
        </div>
      )}
    </div>
  );
}
