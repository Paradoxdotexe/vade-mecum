import { useQueryClient } from 'react-query';
import { useClientMutation } from '@/common/useClientMutation';
import { propagateSession } from './useSessionQuery';
import { Session } from '../types/Session';
import { Character } from '../types/Character';

export const useRemoveSessionCharacter = (
  sessionId: string | undefined,
  characterId: string | undefined
) => {
  const queryClient = useQueryClient();

  const mutation = useClientMutation<Record<string, never>>(
    'DELETE',
    `/session/${sessionId}/character/${characterId}`,
    {
      onSuccess() {
        const characters: Character[] | undefined = queryClient.getQueryData([
          'GET_SESSION_CHARACTERS',
          sessionId
        ]);
        if (characters) {
          queryClient.setQueryData(
            ['GET_SESSION_CHARACTERS', sessionId],
            characters.filter(character => character.id !== characterId)
          );
        }

        const session: Session | undefined = queryClient.getQueryData(['GET_SESSION', sessionId]);
        if (session) {
          propagateSession(queryClient, {
            ...session,
            characterIds: session.characterIds.filter(id => id !== characterId)
          });
        }
      }
    }
  );

  return mutation;
};
