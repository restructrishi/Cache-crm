const API_URL = 'http://localhost:3000/api/super-admin';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const createOrganization = async (data: any) => {
  const response = await fetch(`${API_URL}/organizations`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create organization');
  }
  return response.json();
};

export const createOrgAdmin = async (data: any) => {
  const response = await fetch(`${API_URL}/org-admin`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create org admin');
  }
  return response.json();
};

export const fetchOrganizations = async () => {
  const response = await fetch(`${API_URL}/organizations`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch organizations');
  return response.json();
};
