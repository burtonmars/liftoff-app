import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { rewards } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [reward] = await db
    .select()
    .from(rewards)
    .where(and(eq(rewards.id, params.id), eq(rewards.userId, session.user.id)));

  if (!reward) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (reward.isRedeemed) return NextResponse.json({ error: 'Already redeemed' }, { status: 400 });

  const [updated] = await db
    .update(rewards)
    .set({ isRedeemed: true, redeemedAt: new Date() })
    .where(eq(rewards.id, params.id))
    .returning();

  return NextResponse.json(updated);
}
