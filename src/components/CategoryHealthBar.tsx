'use client';

import { motion } from 'framer-motion';
import type { Category } from '@/lib/types';
import { CATEGORY_MAP } from '@/lib/constants';

interface Props {
  category: Category;
  health: number;
  onFilter?: () => void;
  active?: boolean;
}

export default function CategoryHealthBar({ category, health, onFilter, active }: Props) {
  const { label, color } = CATEGORY_MAP[category];

  return (
    <button
      onClick={onFilter}
      className={`w-full text-left group transition-opacity ${active === false ? 'opacity-40' : ''}`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className="text-xs text-gray-400 tabular-nums">{health}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${health}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </button>
  );
}
