export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  due_date?: string; // ISO date string
  created_at: string;
  updated_at: string;
}
