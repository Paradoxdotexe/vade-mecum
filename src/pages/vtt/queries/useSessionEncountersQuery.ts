import { useClientQuery } from '@/common/useClientQuery';
import { Encounter } from '../types/Encounter';

export const useSessionEncountersQuery = (sessionId: string | undefined) => {
  const query = useClientQuery<Encounter[]>(
    ['GET_SESSION_ENCOUNTERS', sessionId],
    `/session/${sessionId}/encounters`,
    { enabled: !!sessionId }
  );

  return query;
};
