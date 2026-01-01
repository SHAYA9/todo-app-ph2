import { Task } from '@/types/Task';

// Use environment variable for production, fallback to /api for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const handleError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Something went wrong');
  }
  return response;
};

export const getTasks = async (
  search?: string,
  completed?: boolean,
  priority?: Task['priority'],
  has_due_date?: boolean,
  sort_by?: string,
  sort_order?: string
): Promise<Task[]> => {
  const url = new URL(`${API_URL}/tasks`, window.location.origin);
  if (search) {
    url.searchParams.append('search', search);
  }
  if (completed !== undefined) {
    url.searchParams.append('completed', completed.toString());
  }
  if (priority) {
    url.searchParams.append('priority', priority);
  }
  if (has_due_date !== undefined) {
    url.searchParams.append('has_due_date', has_due_date.toString());
  }
  if (sort_by) {
    url.searchParams.append('sort_by', sort_by);
  }
  if (sort_order) {
    url.searchParams.append('sort_order', sort_order);
  }

  const response = await fetch(url.toString());
  return handleError(response).then((res) => res.json());
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  return handleError(response).then((res) => res.json());
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  return handleError(response).then((res) => res.json());
};

export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  return handleError(response).then(() => {});
};

export const getUpcomingTasks = async (minutesOffset: number = 15): Promise<Task[]> => {
  const url = new URL(`${API_URL}/tasks/upcoming`, window.location.origin);
  url.searchParams.append('minutes_offset', minutesOffset.toString());
  const response = await fetch(url.toString());
  return handleError(response).then((res) => res.json());
};
