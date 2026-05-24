'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import CategoryHealthBar from './CategoryHealthBar';
import MomentumMeter from './MomentumMeter';
import TokenBadge from './TokenBadge';
import TaskCard from './TaskCard';
import CompletionToast from './CompletionToast';
import TaskSheet from './TaskSheet';
import { CATEGORIES } from '@/lib/constants';
import { useTasks, useCompleteTask } from '@/hooks/useTasks';
import { useStats } from '@/hooks/useStats';
import type { TaskWithSteps, Category } from '@/lib/types';
import { calculateCategoryHealth } from '@/lib/burden';

export default function Dashboard() {
  const { data: tasks = [], isLoading } = useTasks();
  const { data: statsData } = useStats();
  const completeTask = useCompleteTask();

  const [editingTask, setEditingTask] = useState<TaskWithSteps | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState<{ score: number; tokens: number } | null>(null);

  const stats = statsData?.stats;
  const completedTasks = statsData?.completedTasks ?? [];
  const tokenBalance = stats ? stats.totalTokens - stats.tokensSpent : 0;

  // Category health bars
  const healthByCategory = CATEGORIES.map((cat) => {
    const scores = tasks
      .filter((t) => t.category === cat.key)
      .map((t) => t.burdenScore);
    return { category: cat.key as Category, health: calculateCategoryHealth(scores) };
  });

  // Top 3 highest-burden tasks
  const topBurdens = [...tasks]
    .sort((a, b) => b.burdenScore - a.burdenScore)
    .slice(0, 3);

  async function handleComplete(task: TaskWithSteps) {
    const result = await completeTask.mutateAsync(task.id);
    setToast({ score: result.burdenScore, tokens: result.tokensEarned });
    setTimeout(() => setToast(null), 4000);
  }

  function openEdit(task: TaskWithSteps) {
    setEditingTask(task);
    setSheetOpen(true);
  }

  function closeSheet() {
    setSheetOpen(false);
    setEditingTask(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-sm text-gray-400">Loading…</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
        <TokenBadge count={tokenBalance} />
      </div>

      {/* Category health bars */}
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Life Areas</p>
        {healthByCategory.map(({ category, health }) => (
          <CategoryHealthBar key={category} category={category} health={health} />
        ))}
      </div>

      {/* Momentum */}
      {completedTasks.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <MomentumMeter completedTasks={completedTasks} />
        </div>
      )}

      {/* Top burdens */}
      {topBurdens.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Heaviest right now</p>
          <AnimatePresence>
            {topBurdens.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => handleComplete(task)}
                onEdit={() => openEdit(task)}
                completing={completeTask.isPending}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Nothing here yet.</p>
          <p className="text-sm">Add a task to get started.</p>
        </div>
      )}

      <TaskSheet open={sheetOpen} task={editingTask} onClose={closeSheet} />

      <CompletionToast
        show={!!toast}
        burdenScore={toast?.score ?? 0}
        tokensEarned={toast?.tokens ?? 0}
        onDismiss={() => setToast(null)}
      />
    </div>
  );
}
