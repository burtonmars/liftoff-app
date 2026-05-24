import { useQuery } from '@tanstack/react-query';
import * as api from '@/lib/api';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
  });
}
