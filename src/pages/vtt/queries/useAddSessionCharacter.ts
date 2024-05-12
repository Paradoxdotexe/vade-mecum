//import { useQueryClient } from 'react-query';
import { useClientMutation } from '@/common/useClientMutation';

export const useAddSessionCharacter = (
  sessionId: string | undefined,
  characterId: string | undefined
) => {
  //const queryClient = useQueryClient();

  const mutation = useClientMutation<Record<string, never>>(
    'POST',
    `/session/${sessionId}/character/${characterId}`,
    {
      onSuccess() {
        //propagateCharacter(queryClient, body.character);
      }
    }
  );

  return mutation;
};
