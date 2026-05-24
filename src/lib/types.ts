export type Category = 'health' | 'finances' | 'home' | 'relationships' | 'admin' | 'career';

export interface Task {
  id: string;
  userId: string;
  title: string;
  notes: string | null;
  category: Category;
  mentalRent: number;
  reliefFactor: number;
  dreadLevel: number;
  isCompleted: boolean;
  completedAt: string | null;
  tokensEarned: number;
  createdAt: string;
  updatedAt: string;
}

export interface MicroStep {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  sortOrder: number;
  completedAt: string | null;
  createdAt: string;
}

export interface Reward {
  id: string;
  userId: string;
  title: string;
  tokensSpent: number;
  isRedeemed: boolean;
  redeemedAt: string | null;
  createdAt: string;
}

export interface UserStats {
  userId: string;
  totalTokens: number;
  tokensSpent: number;
  totalBurdenCleared: string;
  tasksCompleted: number;
  longestStreak: number;
  currentStreak: number;
  lastCompletionDate: string | null;
}

export interface TaskWithSteps extends Task {
  steps?: MicroStep[];
  burdenScore: number;
}

export interface CompletionResult {
  task: Task;
  tokensEarned: number;
  burdenScore: number;
}
