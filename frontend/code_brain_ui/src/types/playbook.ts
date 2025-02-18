export interface Playbook {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

export interface PlaybookCreate {
  name: string;
  content: string;
}
