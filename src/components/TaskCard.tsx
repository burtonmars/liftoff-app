'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { CATEGORY_MAP } from '@/lib/constants';
import type { TaskWithSteps } from '@/lib/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Props {
  task: TaskWithSteps;
  onComplete: () => void;
  onEdit: () => void;
  completing?: boolean;
}

export default function TaskCard({ task, onComplete, onEdit, completing }: Props) {
  const { label, color } = CATEGORY_MAP[task.category];

  return (
    <motion.div
      layout
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white rounded-xl shadow-sm overflow-hidden active:scale-[0.98] transition-transform"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <button onClick={onEdit} className="w-full text-left p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{task.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {label}
              </span>
              <span className="text-xs text-gray-400">{dayjs(task.createdAt).fromNow()}</span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-2xl font-bold tabular-nums" style={{ color }}>
              {task.burdenScore}
            </div>
            <div className="text-xs text-gray-400">burden</div>
          </div>
        </div>
      </button>

      <div className="px-4 pb-3 flex justify-end">
        <button
          onClick={(e) => { e.stopPropagation(); onComplete(); }}
          disabled={completing}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50 min-h-[44px] px-2"
        >
          <Check size={16} />
          Done
        </button>
      </div>
    </motion.div>
  );
}
