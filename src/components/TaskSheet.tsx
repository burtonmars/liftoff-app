'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import SliderInput from './SliderInput';
import { CATEGORIES } from '@/lib/constants';
import { calculateBurdenScore } from '@/lib/burden';
import type { TaskWithSteps, Category } from '@/lib/types';
import { useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';

interface Props {
  open: boolean;
  task?: TaskWithSteps | null;
  onClose: () => void;
}

const DEFAULT_STATE = {
  title: '',
  notes: '',
  category: 'admin' as Category,
  mentalRent: 5,
  reliefFactor: 5,
  dreadLevel: 5,
};

export default function TaskSheet({ open, task, onClose }: Props) {
  const [form, setForm] = useState(DEFAULT_STATE);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        notes: task.notes ?? '',
        category: task.category,
        mentalRent: task.mentalRent,
        reliefFactor: task.reliefFactor,
        dreadLevel: task.dreadLevel,
      });
    } else {
      setForm(DEFAULT_STATE);
    }
    setShowDeleteConfirm(false);
  }, [task, open]);

  const liveScore = calculateBurdenScore(
    form.mentalRent,
    form.reliefFactor,
    form.dreadLevel,
    task ? new Date(task.createdAt) : new Date()
  );

  const { label: categoryLabel, color: categoryColor } = CATEGORIES.find(c => c.key === form.category) ?? CATEGORIES[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (task) {
      await updateTask.mutateAsync({ id: task.id, data: form });
    } else {
      await createTask.mutateAsync(form);
    }
    onClose();
  }

  async function handleDelete() {
    if (!task) return;
    await deleteTask.mutateAsync(task.id);
    onClose();
  }

  const isPending = createTask.isPending || updateTask.isPending;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[92vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white pt-4 pb-2 px-5 flex items-center justify-between border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {task ? 'Edit Task' : 'New Task'}
              </h2>
              <div className="flex items-center gap-3">
                <div
                  className="text-xl font-bold tabular-nums"
                  style={{ color: categoryColor }}
                >
                  {liveScore}
                </div>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-5 pb-safe">
              <input
                type="text"
                placeholder="What do you need to do?"
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full text-base font-medium text-gray-900 placeholder-gray-300 border-none outline-none focus:outline-none bg-transparent"
                autoFocus={!task}
              />

              <textarea
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="w-full text-sm text-gray-600 placeholder-gray-300 border-none outline-none resize-none bg-gray-50 rounded-xl p-3"
              />

              {/* Category */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, category: c.key }))}
                      className="px-3 py-1.5 rounded-full text-sm font-medium transition-all min-h-[36px]"
                      style={
                        form.category === c.key
                          ? { backgroundColor: c.color, color: 'white' }
                          : { backgroundColor: `${c.color}15`, color: c.color }
                      }
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <SliderInput
                  label="Mental Rent"
                  hint="How often does this pop up?"
                  value={form.mentalRent}
                  onChange={(v) => setForm(f => ({ ...f, mentalRent: v }))}
                  color={categoryColor}
                />
                <SliderInput
                  label="Relief Factor"
                  hint="How good will it feel when done?"
                  value={form.reliefFactor}
                  onChange={(v) => setForm(f => ({ ...f, reliefFactor: v }))}
                  color={categoryColor}
                />
                <SliderInput
                  label="Dread Level"
                  hint="How much do you not want to do it?"
                  value={form.dreadLevel}
                  onChange={(v) => setForm(f => ({ ...f, dreadLevel: v }))}
                  color={categoryColor}
                />
              </div>

              <button
                type="submit"
                disabled={!form.title.trim() || isPending}
                className="w-full py-4 rounded-2xl font-semibold text-white transition-opacity disabled:opacity-40 min-h-[52px]"
                style={{ backgroundColor: categoryColor }}
              >
                {isPending ? 'Saving…' : task ? 'Save Changes' : 'Add Task'}
              </button>

              {task && (
                <div className="pb-2">
                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full text-center text-sm text-red-400 py-3 min-h-[44px]"
                    >
                      Delete Task
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 min-h-[44px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteTask.isPending}
                        className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-medium disabled:opacity-50 min-h-[44px]"
                      >
                        {deleteTask.isPending ? 'Deleting…' : 'Confirm Delete'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
