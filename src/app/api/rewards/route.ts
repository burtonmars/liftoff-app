import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { rewards, userStats } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userRewards = await db
    .select()
    .from(rewards)
    .where(eq(rewards.userId, session.user.id));

  return NextResponse.json(userRewards);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

  // Check token balance
  const [stats] = await db
    .select({ totalTokens: userStats.totalTokens, tokensSpent: userStats.tokensSpent })
    .from(userStats)
    .where(eq(userStats.userId, session.user.id));

  const available = stats ? stats.totalTokens - stats.tokensSpent : 0;
  if (available < 1) {
    return NextResponse.json({ error: 'Not enough tokens' }, { status: 400 });
  }

  const [reward] = await db
    .insert(rewards)
    .values({ userId: session.user.id, title: body.title, tokensSpent: 1 })
    .returning();

  // Deduct token
  await db
    .update(userStats)
    .set({ tokensSpent: sql`${userStats.tokensSpent} + 1` })
    .where(eq(userStats.userId, session.user.id));

  return NextResponse.json(reward, { status: 201 });
}
