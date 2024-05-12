import { useClientQuery } from '@/common/useClientQuery';
import { Character } from '../types/Character';
//import { UseQueryOptions, useQueryClient } from 'react-query';
//import { propagateCharacter } from './useGetCharacterQuery';

export const useSessionCharacters = (sessionId: string | undefined) => {
  //const queryClient = useQueryClient();

  const query = useClientQuery<Character[]>(
    ['GET_SESSION_CHARACTERS'],
    `/session/${sessionId}/characters`,
    {
      onSuccess: characters => {
        // for (const character of characters) {
        //   propagateCharacter(queryClient, character);
        // }
      }
    }
  );

  return query;
};
