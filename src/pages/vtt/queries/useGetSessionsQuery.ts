import { useClientQuery } from '@/common/useClientQuery';
import { Session } from '../types/Session';
import { useQueryClient } from 'react-query';
import { propagateSession } from './useGetSessionQuery';

export const useGetSessionsQuery = () => {
  const queryClient = useQueryClient();

  const query = useClientQuery<Session[]>(['GET_SESSIONS'], `/sessions`, {
    onSuccess: sessions => {
      for (const session of sessions) {
        propagateSession(queryClient, session);
      }
    }
  });

  return query;
};
