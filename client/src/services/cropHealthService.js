import api from './api';

export const analyzeCropHealth = async (formData) => {
  const res = await api.post('/crop-health/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getCropHealthHistory = async () => {
  const res = await api.get('/crop-health/history');
  return res.data;
};

export const downloadCropHealthPdf = async (id) => {
  const res = await api.get(`/crop-health/${id}/pdf`, {
    responseType: 'blob',
  });
  const file = new Blob([res.data], { type: 'application/pdf' });
  const fileURL = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = fileURL;
  link.setAttribute('download', `KrishiMitra_Report_${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
