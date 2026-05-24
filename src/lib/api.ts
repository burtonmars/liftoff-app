import type { Task, MicroStep, Reward, UserStats, TaskWithSteps, CompletionResult } from './types';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error ?? 'Request failed');
  }
  return res.json();
}

// Tasks
export const getTasks = () => fetchJSON<Task[]>('/api/tasks');

export const createTask = (data: {
  title: string;
  notes?: string;
  category: string;
  mentalRent: number;
  reliefFactor: number;
  dreadLevel: number;
}) =>
  fetchJSON<Task>('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const updateTask = (
  id: string,
  data: Partial<{
    title: string;
    notes: string;
    category: string;
    mentalRent: number;
    reliefFactor: number;
    dreadLevel: number;
  }>
) =>
  fetchJSON<Task>(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const deleteTask = (id: string) =>
  fetchJSON<{ success: true }>(`/api/tasks/${id}`, { method: 'DELETE' });

export const completeTask = (id: string) =>
  fetchJSON<CompletionResult>(`/api/tasks/${id}/complete`, { method: 'POST' });

// Steps
export const getSteps = (taskId: string) =>
  fetchJSON<MicroStep[]>(`/api/tasks/${taskId}/steps`);

export const createStep = (taskId: string, title: string) =>
  fetchJSON<MicroStep>(`/api/tasks/${taskId}/steps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

export const updateStep = (taskId: string, stepId: string, data: { isCompleted?: boolean; title?: string }) =>
  fetchJSON<MicroStep>(`/api/tasks/${taskId}/steps/${stepId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const deleteStep = (taskId: string, stepId: string) =>
  fetchJSON<{ success: true }>(`/api/tasks/${taskId}/steps/${stepId}`, { method: 'DELETE' });

// Rewards
export const getRewards = () => fetchJSON<Reward[]>('/api/rewards');

export const createReward = (title: string) =>
  fetchJSON<Reward>('/api/rewards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

export const redeemReward = (id: string) =>
  fetchJSON<Reward>(`/api/rewards/${id}/redeem`, { method: 'POST' });

// Stats
export const getStats = () =>
  fetchJSON<{ stats: UserStats; completedTasks: Task[] }>('/api/stats');
