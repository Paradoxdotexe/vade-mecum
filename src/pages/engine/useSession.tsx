import { useLocalStorage } from '@/utils/useLocalStorage';
import { useStateVersioner } from '@/utils/useStateVersioner';
import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { v4 as uuid } from 'uuid';
import type { Roll } from './useRolls';
import type { Character } from './Character';

type SessionUser = {
  id: string;
  online: boolean;
};

export type Session = {
  id: string;
  name: string;
  createdAt: string;
  users: SessionUser[];
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

  const queryClient = useQueryClient();

  useEffect(() => {
    if (webSocket) {
      webSocket.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        if (message.event === 'USER_ONLINE' || message.event === 'USER_OFFLINE') {
          const online = message.event === 'USER_ONLINE';
          // update GET_SESSIONS cache with user's new online status
          queryClient.setQueryData('GET_SESSIONS', (sessions: Session[] | undefined) => {
            const user = sessions
              ?.find(session => session.id === sessionState.sessionId)
              ?.users.find(user => user.id === message.data.userId);
            console.log(user);
            if (user) {
              user.online = online;
            }
            return sessions ? [...sessions] : [];
          });
        }
      });
    }
  }, [webSocket]);

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

  const { data: sessionRolls } = useQuery<Roll[]>(
    ['GET_SESSION_ROLLS'],
    () =>
      fetch(`https://api.vademecum.thenjk.com/sessions/${sessionState.sessionId}/rolls`).then(
        response => response.json()
      ),
    {
      enabled: !!sessionState.sessionId
    }
  );

  const { data: sessionCharacters } = useQuery<Character[]>(
    ['GET_SESSION_CHARACTERS'],
    () =>
      fetch(`https://api.vademecum.thenjk.com/sessions/${sessionState.sessionId}/characters`).then(
        response => response.json()
      ),
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
    userId: sessionState.userId,
    sessionRolls,
    sessionCharacters
  };
};
