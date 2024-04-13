import { useLocalStorage } from '@/utils/useLocalStorage';
import { useStateVersioner } from '@/utils/useStateVersioner';
import React, { ReactNode, useContext } from 'react';
import { useQuery } from 'react-query';

export type Session = {
  id: string;
  name: string;
  createdAt: string;
};

type SessionState = {
  version: string;
  sessionId: string;
};

const DEFAULT_SESSION_STATE: SessionState = {
  version: '1.0',
  sessionId: ''
};

interface SSC extends SessionState {
  update: (partialSessionState: Partial<SessionState>) => void;
}

const SessionStateContext = React.createContext<SSC>({
  ...structuredClone(DEFAULT_SESSION_STATE),
  update: () => {}
});

export const SessionStateProvider: React.FC<{ children?: ReactNode }> = props => {
  const [sessionState, setSessionState] = useLocalStorage(
    'vc:engine:session',
    structuredClone(DEFAULT_SESSION_STATE)
  );

  useStateVersioner(sessionState, setSessionState, DEFAULT_SESSION_STATE);

  const update = (partialSessionState: Partial<SessionState>) =>
    setSessionState({ ...sessionState, ...partialSessionState });

  const sessionStateContext: SSC = {
    ...sessionState,
    update
  };

  return (
    <SessionStateContext.Provider value={sessionStateContext}>
      {props.children}
    </SessionStateContext.Provider>
  );
};

export const useSession = () => {
  const sessionState = useContext(SessionStateContext);

  const { data: _sessions } = useQuery<Session[]>(
    ['GET_SESSIONS'],
    () => fetch('https://api.vademecum.thenjk.com/sessions').then(response => response.json()),
    {
      enabled: !!sessionState.sessionId
    }
  );

  const setSessionId = (sessionId: string) => {
    sessionState.update({ sessionId });
  };

  const session = _sessions?.find(session => session.id === sessionState.sessionId);

  return {
    sessionId: sessionState.sessionId,
    setSessionId,
    session
  };
};
