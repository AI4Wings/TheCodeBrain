export interface PlanStep {
  id: string;
  description: string;
  status: string;
}

export interface Plan {
  steps: PlanStep[];
  status: string;
}

export interface AnalysisResults {
  ui_impacts: Record<string, string[]>;
  compatibility_requirements: {
    system_versions: string[];
    screen_resolutions: string[];
    orientations: string[];
    device_types: string[];
  };
  status: string;
}

export interface Task {
  id: string;
  description: string;
  playbook_id?: string;
  status: 'pending' | 'planning' | 'awaiting_confirmation' | 'in_progress' | 'completed' | 'failed';
  created_at: string;
  plan?: Plan;
  results?: AnalysisResults;
}

export interface TaskCreate {
  description: string;
  playbook_id?: string;
}
