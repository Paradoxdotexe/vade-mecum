import { useQueryClient } from 'react-query';
import { useClientMutation } from '@/common/useClientMutation';
import { Character } from '../types/Character';

export const useDeleteCharacterMutation = (characterId: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useClientMutation<Record<string, never>>('DELETE', `/character/${characterId}`, {
    onSuccess() {
      // propagate into GET_CHARACTERS query
      const characters: Character[] | undefined = queryClient.getQueryData(['GET_CHARACTERS']);
      if (characters) {
        // remove character
        queryClient.setQueryData(
          ['GET_CHARACTERS'],
          characters.filter(({ id }) => id !== characterId)
        );
      }
    }
  });

  return mutation;
};
