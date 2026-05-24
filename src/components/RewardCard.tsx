'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Reward } from '@/lib/types';
import dayjs from 'dayjs';

interface Props {
  reward: Reward;
  onRedeem: () => void;
  redeeming?: boolean;
}

export default function RewardCard({ reward, onRedeem, redeeming }: Props) {
  return (
    <motion.div
      layout
      className={`bg-amber-50 border border-amber-100 rounded-xl p-4 ${reward.isRedeemed ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-gray-800 ${reward.isRedeemed ? 'line-through text-gray-400' : ''}`}>
            {reward.title}
          </p>
          <p className="text-xs text-amber-600 mt-1">
            {reward.isRedeemed
              ? `Redeemed ${dayjs(reward.redeemedAt).format('MMM D')}`
              : `Added ${dayjs(reward.createdAt).format('MMM D')}`}
          </p>
        </div>

        {!reward.isRedeemed && (
          <button
            onClick={onRedeem}
            disabled={redeeming}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-amber-400 text-white rounded-full text-xs font-medium disabled:opacity-50 min-h-[36px]"
          >
            <Check size={12} />
            Done
          </button>
        )}
      </div>
    </motion.div>
  );
}
