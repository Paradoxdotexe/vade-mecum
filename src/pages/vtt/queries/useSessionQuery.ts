import { useClientQuery } from '@/common/useClientQuery';
import { QueryClient, useQueryClient } from 'react-query';
import { isEqual } from 'lodash-es';
import { Session } from '../types/Session';

export const propagateSession = (queryClient: QueryClient, propagatedSession: Session) => {
  // propagate into GET_SESSION query
  const session: Session | undefined = queryClient.getQueryData([
    'GET_SESSION',
    propagatedSession.id
  ]);
  if (!isEqual(session, propagatedSession)) {
    queryClient.setQueryData(['GET_SESSION', propagatedSession.id], propagatedSession);
  }

  // propagate into GET_SESSIONS query
  const sessions: Session[] | undefined = queryClient.getQueryData(['GET_SESSIONS']);
  if (sessions) {
    const index = sessions.findIndex(({ id }) => id === propagatedSession.id);
    if (index > -1) {
      // replace existing session
      if (!isEqual(sessions[index], propagatedSession)) {
        sessions[index] = propagatedSession;
        queryClient.setQueryData(['GET_SESSIONS'], sessions);
      }
    } else {
      // add new character
      queryClient.setQueryData(['GET_SESSIONS'], [...sessions, propagatedSession]);
    }
  }
};

export const useSessionQuery = (sessionId: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useClientQuery<Session>(['GET_SESSION', sessionId], `/session/${sessionId}`, {
    onSuccess: session => {
      propagateSession(queryClient, session);
    }
  });

  return query;
};
