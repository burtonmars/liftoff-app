import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import type { Category } from '@/lib/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, params.id), eq(tasks.userId, session.user.id)));

  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(task);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  const updates: {
    title?: string;
    notes?: string | null;
    category?: Category;
    mentalRent?: number;
    reliefFactor?: number;
    dreadLevel?: number;
    updatedAt: Date;
  } = { updatedAt: new Date() };

  if (body.title !== undefined) updates.title = body.title;
  if (body.notes !== undefined) updates.notes = body.notes;
  if (body.category !== undefined) updates.category = body.category as Category;
  if (body.mentalRent !== undefined) updates.mentalRent = Number(body.mentalRent);
  if (body.reliefFactor !== undefined) updates.reliefFactor = Number(body.reliefFactor);
  if (body.dreadLevel !== undefined) updates.dreadLevel = Number(body.dreadLevel);

  const [task] = await db
    .update(tasks)
    .set(updates)
    .where(and(eq(tasks.id, params.id), eq(tasks.userId, session.user.id)))
    .returning();

  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(task);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await db
    .delete(tasks)
    .where(and(eq(tasks.id, params.id), eq(tasks.userId, session.user.id)));

  return NextResponse.json({ success: true });
}
