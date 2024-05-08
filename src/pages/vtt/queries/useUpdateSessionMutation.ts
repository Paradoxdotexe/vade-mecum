import { useQueryClient } from 'react-query';
import { useClientMutation } from '@/common/useClientMutation';
import { Session } from '../types/Session';
import { propagateSession } from './useGetSessionQuery';

export const useUpdateSessionMutation = (sessionId: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useClientMutation<Record<string, never>, { session: Session }>(
    'POST',
    `/session/${sessionId}`,
    {
      onSuccess(_data, body) {
        propagateSession(queryClient, body.session);
      }
    }
  );

  return mutation;
};
