import { useClientMutation } from '@/common/useClientMutation';

export const useCreateCharacterMutation = () => {
  const mutation = useClientMutation<{ characterId: string }>('POST', '/character');

  return mutation;
};
