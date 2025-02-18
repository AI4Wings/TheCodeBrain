export interface PlanStep {
  id: string;
  description: string;
  status: string;
}

export interface Plan {
  steps: PlanStep[];
  status: string;
}

export interface Task {
  id: string;
  description: string;
  playbook_id?: string;
  status: 'pending' | 'planning' | 'awaiting_confirmation' | 'in_progress' | 'completed' | 'failed';
  created_at: string;
  plan?: Plan;
  results?: Record<string, any>;
}

export interface TaskCreate {
  description: string;
  playbook_id?: string;
}
