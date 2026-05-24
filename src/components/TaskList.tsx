'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import CompletionToast from './CompletionToast';
import TaskSheet from './TaskSheet';
import { useTasks, useCompleteTask } from '@/hooks/useTasks';
import type { TaskWithSteps, Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

type SortKey = 'burden' | 'category' | 'date' | 'dread';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'burden', label: 'Burden' },
  { key: 'dread', label: 'Dread' },
  { key: 'date', label: 'Oldest' },
  { key: 'category', label: 'Category' },
];

export default function TaskList() {
  const { data: tasks = [], isLoading } = useTasks();
  const completeTask = useCompleteTask();

  const [sortBy, setSortBy] = useState<SortKey>('burden');
  const [filterCategory, setFilterCategory] = useState<Category | null>(null);
  const [editingTask, setEditingTask] = useState<TaskWithSteps | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState<{ score: number; tokens: number } | null>(null);

  const sorted = [...tasks]
    .filter((t) => !filterCategory || t.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'burden') return b.burdenScore - a.burdenScore;
      if (sortBy === 'dread') return b.dreadLevel - a.dreadLevel;
      if (sortBy === 'date') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });

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
    return <div className="flex items-center justify-center h-48 text-sm text-gray-400">Loading…</div>;
  }

  return (
    <div className="space-y-4">
      {/* Sort bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
              sortBy === opt.key
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilterCategory(null)}
          className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors min-h-[32px] ${
            !filterCategory ? 'bg-gray-900 text-white' : 'bg-white text-gray-400 border border-gray-200'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilterCategory(filterCategory === cat.key ? null : cat.key)}
            className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all min-h-[32px]"
            style={
              filterCategory === cat.key
                ? { backgroundColor: cat.color, color: 'white' }
                : { backgroundColor: `${cat.color}15`, color: cat.color }
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Task cards */}
      <AnimatePresence>
        {sorted.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={() => handleComplete(task)}
            onEdit={() => openEdit(task)}
            completing={completeTask.isPending}
          />
        ))}
      </AnimatePresence>

      {sorted.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">{filterCategory ? 'No tasks in this category.' : 'No tasks yet.'}</p>
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
