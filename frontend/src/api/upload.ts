const API_URL = 'http://localhost:3000/api/upload';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    // Content-Type is set automatically by browser for FormData
    'Authorization': `Bearer ${token}`
  };
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: formData
  });

  if (!response.ok) {
     const error = await response.json().catch(() => ({ message: 'Failed to upload file' }));
     throw new Error(error.message);
  }
  return response.json();
};
