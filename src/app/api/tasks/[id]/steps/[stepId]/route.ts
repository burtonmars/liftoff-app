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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; stepId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!(await verifyTaskOwner(params.id, session.user.id))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await request.json();
  const updates: { isCompleted?: boolean; title?: string; completedAt?: Date | null } = {};

  if (body.isCompleted !== undefined) {
    updates.isCompleted = body.isCompleted;
    updates.completedAt = body.isCompleted ? new Date() : null;
  }
  if (body.title !== undefined) updates.title = body.title;

  const [step] = await db
    .update(microSteps)
    .set(updates)
    .where(eq(microSteps.id, params.stepId))
    .returning();

  return NextResponse.json(step);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; stepId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!(await verifyTaskOwner(params.id, session.user.id))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await db.delete(microSteps).where(eq(microSteps.id, params.stepId));

  return NextResponse.json({ success: true });
}
