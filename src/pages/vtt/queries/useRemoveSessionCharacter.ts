//import { useQueryClient } from 'react-query';
import { useClientMutation } from '@/common/useClientMutation';

export const useRemoveSessionCharacter = (
  sessionId: string | undefined,
  characterId: string | undefined
) => {
  //const queryClient = useQueryClient();

  const mutation = useClientMutation('DELETE', `/session/${sessionId}/character/${characterId}`, {
    onSuccess() {
      //propagateCharacter(queryClient, body.character);
    }
  });

  return mutation;
};
