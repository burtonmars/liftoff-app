import { pgTable, uuid, text, integer, boolean, timestamp, numeric } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  notes: text('notes'),
  category: text('category', {
    enum: ['health', 'finances', 'home', 'relationships', 'admin', 'career'],
  }).notNull(),
  mentalRent: integer('mental_rent').notNull(),
  reliefFactor: integer('relief_factor').notNull(),
  dreadLevel: integer('dread_level').notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  completedAt: timestamp('completed_at'),
  tokensEarned: integer('tokens_earned').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const microSteps = pgTable('micro_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const rewards = pgTable('rewards', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  tokensSpent: integer('tokens_spent').default(1).notNull(),
  isRedeemed: boolean('is_redeemed').default(false).notNull(),
  redeemedAt: timestamp('redeemed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userStats = pgTable('user_stats', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  totalTokens: integer('total_tokens').default(0).notNull(),
  tokensSpent: integer('tokens_spent').default(0).notNull(),
  totalBurdenCleared: numeric('total_burden_cleared').default('0').notNull(),
  tasksCompleted: integer('tasks_completed').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  currentStreak: integer('current_streak').default(0).notNull(),
  lastCompletionDate: timestamp('last_completion_date'),
});
