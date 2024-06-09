import { useClientQuery } from '@/common/useClientQuery';
import { Encounter } from '../types/Encounter';
import { propagateSessionEncounter } from './useSessionEncounterQuery';
import { useQueryClient } from 'react-query';

export const useSessionEncountersQuery = (sessionId: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useClientQuery<Encounter[]>(
    ['GET_SESSION_ENCOUNTERS', sessionId],
    `/session/${sessionId}/encounters`,
    {
      enabled: !!sessionId,
      onSuccess: encounters => {
        for (const encounter of encounters) {
          propagateSessionEncounter(queryClient, sessionId!, encounter);
        }
      }
    }
  );

  return query;
};
