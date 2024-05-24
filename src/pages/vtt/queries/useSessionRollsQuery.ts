import { useClientQuery } from '@/common/useClientQuery';
import { Roll } from '../types/Roll';

export const useSessionRollsQuery = (sessionId: string | undefined) => {
  const query = useClientQuery<Roll[]>(
    ['GET_SESSION_ROLLS', sessionId],
    `/session/${sessionId}/rolls`,
    { enabled: !!sessionId }
  );

  return query;
};
