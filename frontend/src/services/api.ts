import { Task } from '@/types/Task';

// Use environment variable with Railway backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://todo-app-ph2-production.up.railway.app';

const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const getUserId = (): number => {
  if (typeof window === 'undefined') return 0;
  const userStr = localStorage.getItem('user');
  if (!userStr) throw new Error('Not authenticated');
  const user = JSON.parse(userStr);
  return user.id;
};

const handleError = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - clear auth and redirect to signin
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/signin';
      }
    }
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
  const userId = getUserId();
  const url = new URL(`${API_URL}/api/${userId}/tasks`);
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

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  return handleError(response).then((res) => res.json());
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const userId = getUserId();
  const response = await fetch(`${API_URL}/api/${userId}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });
  return handleError(response).then((res) => res.json());
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const userId = getUserId();
  const response = await fetch(`${API_URL}/api/${userId}/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });
  return handleError(response).then((res) => res.json());
};

export const deleteTask = async (id: number): Promise<void> => {
  const userId = getUserId();
  const response = await fetch(`${API_URL}/api/${userId}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleError(response).then(() => {});
};

export const getUpcomingTasks = async (minutesOffset: number = 1): Promise<Task[]> => {
  const userId = getUserId();
  const url = new URL(`${API_URL}/api/${userId}/tasks/upcoming`);
  url.searchParams.append('minutes_offset', minutesOffset.toString());
  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  return handleError(response).then((res) => res.json());
};
