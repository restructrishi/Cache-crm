const API_URL = 'http://localhost:3000/api/deployments';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
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

export const fetchDeployments = async () => {
  const response = await fetch(API_URL, {
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const fetchDeployment = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const createDeployment = async (data: any) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const updateDeployment = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// Task/Checklist API
export const addDeploymentTask = async (deploymentId: string, data: any) => {
  const response = await fetch(`${API_URL}/${deploymentId}/tasks`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const updateDeploymentTask = async (taskId: string, data: any) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const deleteDeploymentTask = async (taskId: string) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(response);
};
