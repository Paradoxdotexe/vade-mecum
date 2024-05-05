import { useGetQuery } from '@/common/useGetQuery';
import { Character } from '../types/Character';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { propagateCharacter } from './useGetCharacterQuery';

export const useGetCharactersQuery = () => {
  const queryClient = useQueryClient();

  const query = useGetQuery<Character[]>(['GET_CHARACTERS'], `/characters`, {
    onSuccess: characters => {
      for (const character of characters) {
        propagateCharacter(queryClient, character);
      }
    }
  });

  return query;
};
