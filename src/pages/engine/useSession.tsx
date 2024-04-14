import { useLocalStorage } from '@/utils/useLocalStorage';
import { useStateVersioner } from '@/utils/useStateVersioner';
import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { v4 as uuid } from 'uuid';

export type Session = {
  id: string;
  name: string;
  createdAt: string;
};

type SessionState = {
  version: string;
  sessionId: string;
  userId: string;
};

const DEFAULT_SESSION_STATE: SessionState = {
  version: '2.0',
  sessionId: '',
  userId: uuid()
};

interface SSC extends SessionState {
  update: (partialSessionState: Partial<SessionState>) => void;
  webSocket: WebSocket | undefined;
}

const SessionStateContext = React.createContext<SSC>({
  ...structuredClone(DEFAULT_SESSION_STATE),
  update: () => {},
  webSocket: undefined
});

export const SessionStateProvider: React.FC<{ children?: ReactNode }> = props => {
  const [sessionState, setSessionState] = useLocalStorage(
    'vc:engine:session',
    structuredClone(DEFAULT_SESSION_STATE)
  );

  useStateVersioner(sessionState, setSessionState, DEFAULT_SESSION_STATE);

  const update = (partialSessionState: Partial<SessionState>) =>
    setSessionState({ ...sessionState, ...partialSessionState });

  const [webSocket, setWebSocket] = useState<WebSocket>();

  // open WebSocket connection for session
  useEffect(() => {
    if (sessionState.sessionId && !webSocket) {
      const webSocket = new WebSocket(
        `wss://ws.vademecum.thenjk.com?sessionId=${sessionState.sessionId}&userId=${sessionState.userId}`
      );
      webSocket.onmessage = event => {
        const message = JSON.parse(event.data);
        console.log(message.event);
      };
      webSocket.onopen = () => {
        console.log(`Connected to session #${sessionState.sessionId}.`);
        setWebSocket(webSocket);
      };
      webSocket.onclose = () => {
        console.log(`Disconnected from session #${sessionState.sessionId}.`);
        setWebSocket(undefined);
      };
    } else if (!sessionState.sessionId && webSocket) {
      webSocket.close();
    }
  }, [sessionState.sessionId]);

  const sessionStateContext: SSC = {
    ...sessionState,
    update,
    webSocket
  };

  return (
    <SessionStateContext.Provider value={sessionStateContext}>
      {props.children}
    </SessionStateContext.Provider>
  );
};

export const useSession = () => {
  const sessionState = useContext(SessionStateContext);

  const { data: sessions } = useQuery<Session[]>(
    ['GET_SESSIONS'],
    () => fetch('https://api.vademecum.thenjk.com/sessions').then(response => response.json()),
    {
      enabled: !!sessionState.sessionId
    }
  );

  const setSessionId = (sessionId: string) => {
    sessionState.update({ sessionId });
  };

  const session = useMemo(
    () => sessions?.find(session => session.id === sessionState.sessionId),
    [sessions, sessionState.sessionId]
  );

  return {
    sessionId: sessionState.sessionId,
    setSessionId,
    session,
    webSocket: sessionState.webSocket,
    userId: sessionState.userId
  };
};
