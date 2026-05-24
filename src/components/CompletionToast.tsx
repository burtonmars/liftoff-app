'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';
import { getCompletionMessage } from '@/lib/constants';

interface Props {
  show: boolean;
  burdenScore: number;
  tokensEarned: number;
  onDismiss: () => void;
}

export default function CompletionToast({ show, burdenScore, tokensEarned, onDismiss }: Props) {
  const msg = getCompletionMessage(burdenScore);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-4 right-4 z-50 max-w-sm mx-auto"
          onClick={onDismiss}
        >
          <div className="bg-gray-900 text-white rounded-2xl p-5 shadow-xl">
            <p className="font-semibold text-base">{msg.title}</p>
            <p className="text-gray-300 text-sm mt-0.5">{msg.body}</p>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-400">{burdenScore} burden cleared</span>
              {tokensEarned > 0 && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex items-center gap-1 text-amber-400 text-sm font-medium"
                >
                  <Coins size={14} />
                  +{tokensEarned}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
