import { useClientQuery } from '@/common/useClientQuery';
import { Character } from '../types/Character';
import { QueryClient } from 'react-query';

export const propagateSessionCharacter = (
  queryClient: QueryClient,
  sessionId: string,
  propagatedSessionCharacter: Character
) => {
  // propagate into GET_SESSION_CHARACTER query
  queryClient.setQueryData(
    ['GET_SESSION_CHARACTER', sessionId, propagatedSessionCharacter.id],
    propagatedSessionCharacter
  );
};

export const useSessionCharacterQuery = (
  sessionId: string | undefined,
  characterId: string | undefined
) => {
  const query = useClientQuery<Character>(
    ['GET_SESSION_CHARACTER', sessionId, characterId],
    `/session/${sessionId}/character/${characterId}`,
    {
      enabled: !!sessionId && !!characterId
    }
  );

  return query;
};
