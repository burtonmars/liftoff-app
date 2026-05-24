import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { tasks, userStats } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [stats] = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, session.user.id));

  const completedTasks = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, session.user.id), eq(tasks.isCompleted, true)));

  return NextResponse.json({ stats: stats ?? null, completedTasks });
}
