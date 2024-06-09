import { useClientMutation } from '@/common/useClientMutation';

export const useCreateSessionEncounterMutation = (sessionId: string | undefined) => {
  const mutation = useClientMutation('POST', `/session/${sessionId}/encounter`);

  return mutation;
};
