import { useQueryClient } from 'react-query';
import { useClientMutation } from '@/common/useClientMutation';
import { Encounter } from '../types/Encounter';
import { propagateSessionEncounter } from './useSessionEncounterQuery';

export const useUpdateSessionEncounterMutation = (
  sessionId: string | undefined,
  encounterId: string | undefined
) => {
  const queryClient = useQueryClient();

  const mutation = useClientMutation<Record<string, never>, { encounter: Encounter }>(
    'POST',
    `/session/${sessionId}/encounter/${encounterId}`,
    {
      onSuccess(_data, body) {
        propagateSessionEncounter(queryClient, sessionId!, body.encounter);
      }
    }
  );

  return mutation;
};
