const API_URL = 'http://localhost:3000/api/customer-pos';

export const getCustomerPos = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch Purchase Orders');
  return response.json();
};
