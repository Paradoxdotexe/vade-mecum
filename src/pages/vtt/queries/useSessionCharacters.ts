import { useClientQuery } from '@/common/useClientQuery';
import { Character } from '../types/Character';
import { useQueryClient } from 'react-query';
import { propagateSessionCharacter } from './useSessionCharacter';

export const useSessionCharacters = (sessionId: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useClientQuery<Character[]>(
    ['GET_SESSION_CHARACTERS', sessionId],
    `/session/${sessionId}/characters`,
    {
      onSuccess: characters => {
        for (const character of characters) {
          propagateSessionCharacter(queryClient, sessionId!, character);
        }
      }
    }
  );

  return query;
};
