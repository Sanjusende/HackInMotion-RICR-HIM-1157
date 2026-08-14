import api from './api';

export const analyzeCropHealth = async (description: string, imageUri?: string) => {
  try {
    const formData = new FormData();
    formData.append('description', description);

    if (imageUri) {
      const filename = imageUri.split('/').pop() || 'leaf.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      } as any);
    }

    const res = await api.post('/crop-health/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to analyze crop health.');
  }
};

export const getCropHealthHistory = async () => {
  try {
    const res = await api.get('/crop-health/history');
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to load scan history.');
  }
};
