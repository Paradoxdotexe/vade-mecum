import { useClientQuery } from '@/common/useClientQuery';
import { Character } from '../types/Character';
import { UseQueryOptions, useQueryClient } from 'react-query';
import { propagateCharacter } from './useGetCharacterQuery';

export const useGetCharactersQuery = (queryOptions?: UseQueryOptions<Character[]>) => {
  const queryClient = useQueryClient();

  const query = useClientQuery<Character[]>(['GET_CHARACTERS'], `/characters`, {
    ...queryOptions,
    onSuccess: characters => {
      for (const character of characters) {
        propagateCharacter(queryClient, character);
      }
    }
  });

  return query;
};
