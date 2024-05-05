import { Character } from '../types/Character';
import { useQueryClient } from 'react-query';
import { useClientMutation } from '@/common/useClientMutation';
import { propagateCharacter } from './useGetCharacterQuery';

export const useUpdateCharacterMutation = (characterId: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useClientMutation<Record<string, never>, { character: Character }>(
    'POST',
    `/character/${characterId}`,
    {
      onSuccess(_data, body) {
        propagateCharacter(queryClient, body.character);
      }
    }
  );

  return mutation;
};
