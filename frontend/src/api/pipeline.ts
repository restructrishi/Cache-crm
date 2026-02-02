const API_URL = 'http://localhost:3000/api/pipeline';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const fetchPipelines = async () => {
  const response = await fetch(API_URL, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch pipelines');
  return response.json();
};

export const fetchPipelineById = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch pipeline');
  return response.json();
};

export const createPipeline = async (dealId: string, accountId?: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ dealId, accountId })
  });
  if (!response.ok) {
     const error = await response.json().catch(() => ({ message: 'Failed to create pipeline' }));
     throw new Error(error.message);
  }
  return response.json();
};

export const updatePipelineStep = async (pipelineId: string, stepName: string, data: any) => {
  const response = await fetch(`${API_URL}/${pipelineId}/step/${encodeURIComponent(stepName)}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
     const error = await response.json().catch(() => ({ message: 'Failed to update step' }));
     throw new Error(error.message);
  }
  return response.json();
};
