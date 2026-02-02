const API_URL = 'http://localhost:3000/api/admin';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const createUser = async (data: any) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create user');
  }
  return response.json();
};

export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export const updateUserStatus = async (id: string, isActive: boolean) => {
  const response = await fetch(`${API_URL}/users/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ isActive })
  });
  if (!response.ok) throw new Error('Failed to update user status');
  return response.json();
};
