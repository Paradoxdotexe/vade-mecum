import { useClientQuery } from '@/common/useClientQuery';
import { Session } from '../types/Session';
import { UseQueryOptions, useQueryClient } from 'react-query';
import { propagateSession } from './useSessionQuery';

export const useSessionsQuery = (queryOptions?: UseQueryOptions<Session[]>) => {
  const queryClient = useQueryClient();

  const query = useClientQuery<Session[]>(['GET_SESSIONS'], `/sessions`, {
    ...queryOptions,
    onSuccess: sessions => {
      for (const session of sessions) {
        propagateSession(queryClient, session);
      }
    }
  });

  return query;
};
