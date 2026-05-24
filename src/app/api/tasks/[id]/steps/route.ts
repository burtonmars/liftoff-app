import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { tasks, microSteps } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

async function verifyTaskOwner(taskId: string, userId: string) {
  const [task] = await db
    .select({ id: tasks.id })
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  return !!task;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!(await verifyTaskOwner(params.id, session.user.id))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const steps = await db
    .select()
    .from(microSteps)
    .where(eq(microSteps.taskId, params.id));

  return NextResponse.json(steps);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!(await verifyTaskOwner(params.id, session.user.id))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await request.json();
  if (!body.title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

  const [step] = await db
    .insert(microSteps)
    .values({ taskId: params.id, title: body.title })
    .returning();

  return NextResponse.json(step, { status: 201 });
}
