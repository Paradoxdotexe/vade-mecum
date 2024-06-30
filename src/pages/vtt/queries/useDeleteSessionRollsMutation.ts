import { useClientMutation } from '@/common/useClientMutation';
import { useQueryClient } from 'react-query';

export const useDeleteSessionRollsMutation = (sessionId: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useClientMutation('DELETE', `/session/${sessionId}/rolls`, {
    onSuccess() {
      // propagate into GET_SESSION_ROLLS query
      queryClient.setQueryData(['GET_SESSION_ROLLS', sessionId], []);
    }
  });

  return mutation;
};
