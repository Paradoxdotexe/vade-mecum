import { useQueryClient } from 'react-query';
import { useClientMutation } from '@/common/useClientMutation';
import { Session } from '../types/Session';

export const useDeleteSessionMutation = (sessionId: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useClientMutation<Record<string, never>>('DELETE', `/session/${sessionId}`, {
    onSuccess() {
      // propagate into GET_SESSIONS query
      const sessions: Session[] | undefined = queryClient.getQueryData(['GET_SESSIONS']);
      if (sessions) {
        // remove session
        queryClient.setQueryData(
          ['GET_SESSIONS'],
          sessions.filter(({ id }) => id !== sessionId)
        );
      }
    }
  });

  return mutation;
};
