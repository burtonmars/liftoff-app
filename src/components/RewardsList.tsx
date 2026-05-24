'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Coins, Plus } from 'lucide-react';
import RewardCard from './RewardCard';
import { useRewards, useCreateReward, useRedeemReward } from '@/hooks/useRewards';
import { useStats } from '@/hooks/useStats';

export default function RewardsList() {
  const { data: rewards = [], isLoading } = useRewards();
  const { data: statsData } = useStats();
  const createReward = useCreateReward();
  const redeemReward = useRedeemReward();

  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const stats = statsData?.stats;
  const tokenBalance = stats ? stats.totalTokens - stats.tokensSpent : 0;

  const active = rewards.filter((r) => !r.isRedeemed);
  const redeemed = rewards.filter((r) => r.isRedeemed);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createReward.mutateAsync(newTitle.trim());
    setNewTitle('');
    setAdding(false);
  }

  if (isLoading) return <div className="flex items-center justify-center h-48 text-sm text-gray-400">Loading…</div>;

  return (
    <div className="space-y-6">
      {/* Token balance */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-amber-600 font-medium">Available tokens</p>
          <p className="text-3xl font-bold text-amber-700 tabular-nums mt-0.5">{tokenBalance}</p>
        </div>
        <Coins size={32} className="text-amber-300" />
      </div>

      {/* Add reward */}
      {tokenBalance > 0 && (
        <div>
          {!adding ? (
            <button
              onClick={() => setAdding(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-400 text-white rounded-2xl font-medium min-h-[52px]"
            >
              <Plus size={18} />
              Add a reward (1 token)
            </button>
          ) : (
            <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
              <p className="text-sm font-medium text-gray-700">What did you earn?</p>
              <input
                type="text"
                placeholder="Movie night, sleep in Saturday…"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
                className="w-full border-b border-gray-200 pb-2 text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-amber-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdding(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || createReward.isPending}
                  className="flex-1 py-2.5 bg-amber-400 text-white rounded-xl text-sm font-medium disabled:opacity-50 min-h-[44px]"
                >
                  {createReward.isPending ? 'Adding…' : 'Add'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Active rewards */}
      {active.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Earned rewards</p>
          <AnimatePresence>
            {active.map((r) => (
              <RewardCard
                key={r.id}
                reward={r}
                onRedeem={() => redeemReward.mutate(r.id)}
                redeeming={redeemReward.isPending}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Redeemed */}
      {redeemed.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Redeemed</p>
          {redeemed.map((r) => (
            <RewardCard key={r.id} reward={r} onRedeem={() => {}} />
          ))}
        </div>
      )}

      {rewards.length === 0 && tokenBalance === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Complete high-burden tasks to earn tokens.</p>
        </div>
      )}
    </div>
  );
}
