'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';

interface Props {
  count: number;
}

export default function TokenBadge({ count }: Props) {
  return (
    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
      <Coins size={14} className="text-amber-500" />
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-semibold text-amber-700 tabular-nums"
        >
          {count}
        </motion.span>
      </AnimatePresence>
      <span className="text-xs text-amber-500">tokens</span>
    </div>
  );
}
