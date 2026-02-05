const API_URL = 'http://localhost:3000/api/orders';
const UPLOAD_URL = 'http://localhost:3000/api/upload';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const getUploadHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    } else {
      const text = await response.text();
      throw new Error(text || 'Request failed');
    }
  }
  return response.json();
};

export const ordersApi = {
  create: async (data: any) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getAll: async (query?: { status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.search) params.append('search', query.search);

    const response = await fetch(`${API_URL}?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateStep: async (id: string, stepName: string, data: any) => {
    const response = await fetch(`${API_URL}/${id}/step/${encodeURIComponent(stepName)}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Metadata upload (link file to PO)
  uploadDocument: async (id: string, stepId: string | null, fileData: { type: string; fileName: string; fileUrl: string }) => {
    const response = await fetch(`${API_URL}/${id}/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ stepId, ...fileData }),
    });
    return handleResponse(response);
  },

  // Physical file upload
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      headers: getUploadHeaders(), // No Content-Type (let browser set multipart/boundary)
      body: formData
    });
    return handleResponse(response);
  }
};
