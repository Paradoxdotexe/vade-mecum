import { useClientQuery } from '@/common/useClientQuery';
import { QueryClient, useQueryClient } from 'react-query';
import { isEqual } from 'lodash-es';
import { Encounter } from '../types/Encounter';

export const propagateSessionEncounter = (
  queryClient: QueryClient,
  sessionId: string,
  propagatedSessionEncounter: Encounter
) => {
  // propagate into GET_SESSION_ENCOUNTER query
  const sessionEncounter: Encounter | undefined = queryClient.getQueryData([
    'GET_SESSION_ENCOUNTER',
    sessionId,
    propagatedSessionEncounter.id
  ]);
  if (!isEqual(sessionEncounter, propagatedSessionEncounter)) {
    queryClient.setQueryData(
      ['GET_SESSION_ENCOUNTER', sessionId, propagatedSessionEncounter.id],
      propagatedSessionEncounter
    );
  }

  // propagate into GET_SESSION_ENCOUNTERS query
  const sessionEncounters: Encounter[] | undefined = queryClient.getQueryData([
    'GET_SESSION_ENCOUNTERS',
    sessionId
  ]);
  if (sessionEncounters) {
    const index = sessionEncounters.findIndex(({ id }) => id === propagatedSessionEncounter.id);
    if (index > -1) {
      // replace existing session encounter
      if (!isEqual(sessionEncounters[index], propagatedSessionEncounter)) {
        sessionEncounters[index] = propagatedSessionEncounter;
        queryClient.setQueryData(['GET_SESSION_ENCOUNTERS', sessionId], sessionEncounters);
      }
    } else {
      // add new session encounter
      queryClient.setQueryData(
        ['GET_SESSION_ENCOUNTERS', sessionId],
        [...sessionEncounters, propagatedSessionEncounter]
      );
    }
  }
};

export const useSessionEncounterQuery = (
  sessionId: string | undefined,
  encounterId: string | undefined
) => {
  const queryClient = useQueryClient();

  const query = useClientQuery<Encounter>(
    ['GET_SESSION_ENCOUNTER', sessionId, encounterId],
    `/session/${sessionId}/encounter/${encounterId}`,
    {
      onSuccess: encounter => {
        propagateSessionEncounter(queryClient, sessionId!, encounter);
      },
      enabled: !!sessionId && !!encounterId
    }
  );

  return query;
};
