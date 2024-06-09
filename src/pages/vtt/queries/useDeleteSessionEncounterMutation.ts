import { useQueryClient } from 'react-query';
import { useClientMutation } from '@/common/useClientMutation';
import { Encounter } from '../types/Encounter';

export const useDeleteSessionEncounterMutation = (
  sessionId: string | undefined,
  encounterId: string | undefined
) => {
  const queryClient = useQueryClient();

  const mutation = useClientMutation<Record<string, never>>(
    'DELETE',
    `/session/${sessionId}/encounter/${encounterId}`,
    {
      onSuccess() {
        // propagate into GET_SESSION_ENCOUNTERS query
        const sessionEncounters: Encounter[] | undefined = queryClient.getQueryData([
          'GET_SESSION_ENCOUNTERS',
          sessionId
        ]);
        if (sessionEncounters) {
          // remove session encounter
          queryClient.setQueryData(
            ['GET_SESSION_ENCOUNTERS', sessionId],
            sessionEncounters.filter(({ id }) => id !== encounterId)
          );
        }
      }
    }
  );

  return mutation;
};
