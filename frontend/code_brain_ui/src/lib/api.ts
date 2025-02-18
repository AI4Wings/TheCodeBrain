const API_URL = import.meta.env.VITE_API_URL;

export async function fetchPlaybooks() {
  const response = await fetch(`${API_URL}/api/v1/playbooks`);
  if (!response.ok) {
    throw new Error('Failed to fetch playbooks');
  }
  return response.json();
}

export async function createPlaybook(data: { name: string; content: string }) {
  const response = await fetch(`${API_URL}/api/v1/playbooks`, {
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
  const response = await fetch(`${API_URL}/api/v1/tasks`, {
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
