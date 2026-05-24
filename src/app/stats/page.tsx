import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import StatsView from '@/components/StatsView';

export default async function StatsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return <StatsView />;
}
