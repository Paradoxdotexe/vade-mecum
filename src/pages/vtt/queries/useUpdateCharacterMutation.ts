import { Character } from '../types/Character';
import { useQueryClient } from 'react-query';
import { usePostMutation } from '@/common/usePostMutation';
import { propagateCharacter } from './useGetCharacterQuery';

export const useUpdateCharacterMutation = (characterId: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = usePostMutation<Record<string, never>, { character: Character }>(
    `/character/${characterId}`,
    {
      onSuccess(_data, body, _context) {
        propagateCharacter(queryClient, body.character);
      }
    }
  );

  return mutation;
};
