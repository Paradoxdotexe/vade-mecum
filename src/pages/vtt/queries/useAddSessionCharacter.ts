import { useQueryClient } from 'react-query';
import { useClientMutation } from '@/common/useClientMutation';
import { propagateSession } from './useGetSessionQuery';
import { Session } from '../types/Session';

export const useAddSessionCharacter = (
  sessionId: string | undefined,
  characterId: string | undefined
) => {
  const queryClient = useQueryClient();

  const mutation = useClientMutation<Record<string, never>>(
    'POST',
    `/session/${sessionId}/character/${characterId}`,
    {
      onSuccess() {
        queryClient.removeQueries('GET_SESSION_CHARACTERS');

        const session: Session | undefined = queryClient.getQueryData(['GET_SESSION', sessionId]);
        if (session) {
          propagateSession(queryClient, {
            ...session,
            characterIds: [...session.characterIds, characterId!]
          });
        }
      }
    }
  );

  return mutation;
};
