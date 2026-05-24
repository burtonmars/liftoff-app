import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import TaskList from '@/components/TaskList';

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return <TaskList />;
}
