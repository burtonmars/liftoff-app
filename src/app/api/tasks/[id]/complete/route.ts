import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { tasks, userStats } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { calculateBurdenScore } from '@/lib/burden';
import { getTokensForScore } from '@/lib/constants';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, params.id), eq(tasks.userId, session.user.id)));

  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (task.isCompleted) return NextResponse.json({ error: 'Already completed' }, { status: 400 });

  const burdenScore = calculateBurdenScore(
    task.mentalRent,
    task.reliefFactor,
    task.dreadLevel,
    task.createdAt
  );

  const tokensEarned = getTokensForScore(burdenScore);
  const now = new Date();

  const [updatedTask] = await db
    .update(tasks)
    .set({ isCompleted: true, completedAt: now, tokensEarned, updatedAt: now })
    .where(eq(tasks.id, params.id))
    .returning();

  // Update user stats — upsert
  await db
    .insert(userStats)
    .values({
      userId: session.user.id,
      totalTokens: tokensEarned,
      tokensSpent: 0,
      totalBurdenCleared: String(burdenScore),
      tasksCompleted: 1,
      longestStreak: 0,
      currentStreak: 0,
      lastCompletionDate: now,
    })
    .onConflictDoUpdate({
      target: userStats.userId,
      set: {
        totalTokens: sql`${userStats.totalTokens} + ${tokensEarned}`,
        totalBurdenCleared: sql`${userStats.totalBurdenCleared} + ${burdenScore}`,
        tasksCompleted: sql`${userStats.tasksCompleted} + 1`,
        lastCompletionDate: now,
      },
    });

  return NextResponse.json({ task: updatedTask, tokensEarned, burdenScore });
}
