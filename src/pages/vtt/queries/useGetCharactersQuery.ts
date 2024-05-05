import { useClientQuery } from '@/common/useClientQuery';
import { Character } from '../types/Character';
import { useQueryClient } from 'react-query';
import { propagateCharacter } from './useGetCharacterQuery';

export const useGetCharactersQuery = () => {
  const queryClient = useQueryClient();

  const query = useClientQuery<Character[]>(['GET_CHARACTERS'], `/characters`, {
    onSuccess: characters => {
      for (const character of characters) {
        propagateCharacter(queryClient, character);
      }
    }
  });

  return query;
};
