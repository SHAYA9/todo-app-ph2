export type RecurrenceType = 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  due_datetime?: string; // ISO date string combined with time
  recurrence_type?: RecurrenceType;
  recurrence_id?: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}
