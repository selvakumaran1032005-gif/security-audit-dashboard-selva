import apiClient from './apiClient';

export const fetchLogs = async (params) => {
  const { data } = await apiClient.get('/logs', { params });
  return data;
};

export const fetchLogStats = async () => {
  const { data } = await apiClient.get('/logs/stats');
  return data.data;
};

export const fetchFilterOptions = async () => {
  const { data } = await apiClient.get('/logs/filter-options');
  return data.data;
};

export const bulkUploadLogs = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post('/logs/bulk-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onUploadProgress && event.total) {
        onUploadProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });

  return data;
};
