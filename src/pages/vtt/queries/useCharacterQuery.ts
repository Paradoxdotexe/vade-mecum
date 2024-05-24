import { useClientQuery } from '@/common/useClientQuery';
import { Character } from '../types/Character';
import { QueryClient, useQueryClient } from 'react-query';
import { isEqual } from 'lodash-es';

export const propagateCharacter = (queryClient: QueryClient, propagatedCharacter: Character) => {
  // propagate into GET_CHARACTER query
  const character: Character | undefined = queryClient.getQueryData([
    'GET_CHARACTER',
    propagatedCharacter.id
  ]);
  if (!isEqual(character, propagatedCharacter)) {
    queryClient.setQueryData(['GET_CHARACTER', propagatedCharacter.id], propagatedCharacter);
  }

  // propagate into GET_CHARACTERS query
  const characters: Character[] | undefined = queryClient.getQueryData(['GET_CHARACTERS']);
  if (characters) {
    const index = characters.findIndex(({ id }) => id === propagatedCharacter.id);
    if (index > -1) {
      // replace existing character
      if (!isEqual(characters[index], propagatedCharacter)) {
        characters[index] = propagatedCharacter;
        queryClient.setQueryData(['GET_CHARACTERS'], characters);
      }
    } else {
      // add new character
      queryClient.setQueryData(['GET_CHARACTERS'], [...characters, propagatedCharacter]);
    }
  }
};

export const useCharacterQuery = (characterId: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useClientQuery<Character>(
    ['GET_CHARACTER', characterId],
    `/character/${characterId}`,
    {
      onSuccess: character => {
        propagateCharacter(queryClient, character);
      }
    }
  );

  return query;
};
