import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';

export function useRewards() {
  return useQuery({
    queryKey: ['rewards'],
    queryFn: api.getRewards,
  });
}

export function useCreateReward() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createReward,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rewards'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useRedeemReward() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.redeemReward,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rewards'] }),
  });
}
