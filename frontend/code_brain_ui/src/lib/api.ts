const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api/v1';

// Construct the full API URL
export const API_URL = `${BASE_URL}${API_PREFIX}`;

export async function fetchPlaybooks() {
  const response = await fetch(`${API_URL}/playbooks`);
  if (!response.ok) {
    throw new Error('Failed to fetch playbooks');
  }
  return response.json();
}

export async function createPlaybook(data: { name: string; content: string }) {
  const response = await fetch(`${API_URL}/playbooks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create playbook');
  }
  return response.json();
}

export async function createTask(description: string, playbookId?: string) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description,
      playbook_id: playbookId,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  const task = await response.json();
  return task;
}
