import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import RewardsList from '@/components/RewardsList';

export default async function RewardsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return <RewardsList />;
}
