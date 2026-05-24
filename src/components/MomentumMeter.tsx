'use client';

import { motion } from 'framer-motion';
import type { Task } from '@/lib/types';
import { calculateBurdenScore } from '@/lib/burden';
import dayjs from 'dayjs';

interface Props {
  completedTasks: Task[];
}

export default function MomentumMeter({ completedTasks }: Props) {
  const sevenDaysAgo = dayjs().subtract(7, 'day');
  const recent = completedTasks.filter(
    (t) => t.completedAt && dayjs(t.completedAt).isAfter(sevenDaysAgo)
  );

  const points = recent.reduce((sum, t) => {
    const score = calculateBurdenScore(
      t.mentalRent,
      t.reliefFactor,
      t.dreadLevel,
      new Date(t.createdAt)
    );
    return sum + score;
  }, 0);

  const MAX_POINTS = 300;
  const pct = Math.min(100, Math.round((points / MAX_POINTS) * 100));

  if (points === 0) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-500">7-day momentum</span>
        <span className="text-xs text-gray-400">{points} pts cleared</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
