import React from 'react';
import UploadDropzone from '../components/UploadDropzone';

export default function UploadPage({ onUploadComplete }) {
  return (
    <div className="max-w-2xl">
      <UploadDropzone onUploadComplete={onUploadComplete} />
    </div>
  );
}
