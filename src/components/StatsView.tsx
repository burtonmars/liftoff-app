'use client';

import { useStats } from '@/hooks/useStats';
import { calculateBurdenScore } from '@/lib/burden';
import { CATEGORY_MAP } from '@/lib/constants';
import dayjs from 'dayjs';

export default function StatsView() {
  const { data, isLoading } = useStats();

  if (isLoading) return <div className="flex items-center justify-center h-48 text-sm text-gray-400">Loading…</div>;

  const stats = data?.stats;
  const completed = data?.completedTasks ?? [];

  const sortedCompleted = [...completed].sort((a, b) =>
    new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
  );

  if (!stats || completed.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-sm">No completed tasks yet.</p>
        <p className="text-sm mt-1">Get going.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{stats.tasksCompleted}</p>
          <p className="text-xs text-gray-400 mt-0.5">tasks cleared</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-900 tabular-nums">
            {Math.round(Number(stats.totalBurdenCleared))}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">burden points</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{stats.totalTokens}</p>
          <p className="text-xs text-gray-400 mt-0.5">tokens earned</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{stats.longestStreak}</p>
          <p className="text-xs text-gray-400 mt-0.5">day streak</p>
        </div>
      </div>

      {/* History */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">History</p>
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50">
          {sortedCompleted.map((task) => {
            const score = calculateBurdenScore(
              task.mentalRent,
              task.reliefFactor,
              task.dreadLevel,
              new Date(task.createdAt)
            );
            const cat = CATEGORY_MAP[task.category];
            return (
              <div key={task.id} className="px-4 py-3 flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{task.title}</p>
                  <p className="text-xs text-gray-400">{dayjs(task.completedAt).format('MMM D, YYYY')}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums text-gray-500">{score}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
