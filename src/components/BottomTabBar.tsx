'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListTodo, Plus, Gift, BarChart2 } from 'lucide-react';

const TABS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/tasks/new', label: '', icon: Plus, isAction: true },
  { href: '/rewards', label: 'Rewards', icon: Gift },
  { href: '/stats', label: 'Stats', icon: BarChart2 },
];

export default function BottomTabBar({ onQuickAdd }: { onQuickAdd: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around max-w-lg mx-auto px-2">
        {TABS.map((tab) => {
          if (tab.isAction) {
            return (
              <button
                key={tab.href}
                onClick={onQuickAdd}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white -mt-4 shadow-lg active:scale-95 transition-transform"
              >
                <Plus size={22} />
              </button>
            );
          }

          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-3 px-4 min-w-[60px] gap-0.5 transition-colors ${
                isActive ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
