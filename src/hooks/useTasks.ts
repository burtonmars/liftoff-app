import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { calculateBurdenScore } from '@/lib/burden';
import type { Task, TaskWithSteps } from '@/lib/types';

function withBurden(task: Task): TaskWithSteps {
  return {
    ...task,
    burdenScore: calculateBurdenScore(
      task.mentalRent,
      task.reliefFactor,
      task.dreadLevel,
      new Date(task.createdAt)
    ),
  };
}

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = await api.getTasks();
      return tasks.map(withBurden);
    },
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.updateTask>[1] }) =>
      api.updateTask(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useCompleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.completeTask,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
