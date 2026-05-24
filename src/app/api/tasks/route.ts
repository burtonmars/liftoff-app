import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userTasks = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, session.user.id), eq(tasks.isCompleted, false)));

  return NextResponse.json(userTasks);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  if (!body.title || !body.category || body.mentalRent == null || body.reliefFactor == null || body.dreadLevel == null) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const [task] = await db
    .insert(tasks)
    .values({
      userId: session.user.id,
      title: body.title,
      notes: body.notes || null,
      category: body.category,
      mentalRent: Number(body.mentalRent),
      reliefFactor: Number(body.reliefFactor),
      dreadLevel: Number(body.dreadLevel),
    })
    .returning();

  return NextResponse.json(task, { status: 201 });
}
