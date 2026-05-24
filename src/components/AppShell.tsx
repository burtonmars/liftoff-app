'use client';

import { useState } from 'react';
import BottomTabBar from './BottomTabBar';
import TaskSheet from './TaskSheet';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-28">
        {children}
      </main>

      <BottomTabBar onQuickAdd={() => setQuickAddOpen(true)} />

      <TaskSheet
        open={quickAddOpen}
        task={null}
        onClose={() => setQuickAddOpen(false)}
      />
    </div>
  );
}
