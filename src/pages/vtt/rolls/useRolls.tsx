import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Roll } from '../types/Roll';
import { playSound } from '@/utils/playSound';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { useSessionRollsQuery } from '../queries/useSessionRollsQuery';
import {
  propagateSessionRoll,
  useCreateSessionRollMutation
} from '../queries/useCreateSessionRollMutation';
import { useQueryClient } from 'react-query';

type RollsState = {
  rolls?: Roll[];
};

type _RollsContext = RollsState & {
  addRoll: (roll: Roll) => void;
  sessionId?: string;
  setSessionId: (sessionId?: string) => void;
};

const RollsContext = React.createContext<_RollsContext>({
  addRoll: () => {},
  setSessionId: () => {}
});

export const RollsProvider: React.FC<{ children: ReactNode }> = props => {
  const queryClient = useQueryClient();

  const [localRolls, setLocalRolls] = useLocalStorage<Roll[]>('vm-vtt-rolls', []);
  const [sessionId, setSessionId] = useState<string>();
  const [webSocket, setWebSocket] = useState<WebSocket>();

  // open WebSocket connection for session
  useEffect(() => {
    if (sessionId && !webSocket) {
      console.log('Connecting...');
      const webSocket = new WebSocket(`wss://ws.vademecum.thenjk.com?sessionId=${sessionId}`);
      webSocket.onmessage = event => {
        const message = JSON.parse(event.data);
        console.log(message.event);
      };
      webSocket.onopen = () => {
        console.log(`Connected to session #${sessionId}.`);
        setWebSocket(webSocket);
      };
      webSocket.onclose = () => {
        console.log(`Disconnected from session #${sessionId}.`);
        setWebSocket(undefined);
      };
    } else if (!sessionId && webSocket) {
      webSocket.close();
    }
  }, [sessionId, webSocket]);

  const { data: sessionRolls } = useSessionRollsQuery(sessionId);

  const { mutate: createSessionRoll } = useCreateSessionRollMutation(sessionId);

  const rolls = sessionId ? sessionRolls : localRolls;

  const addRoll = (roll: Roll) => {
    playSound('/sounds/DiceRoll.mp3').then(() => {
      if (sessionId) {
        createSessionRoll({ roll });
        propagateSessionRoll(queryClient, sessionId, roll);
      } else {
        setLocalRolls([...localRolls, roll]);
      }
    });
  };

  const context: _RollsContext = {
    rolls,
    addRoll,
    sessionId,
    setSessionId
  };

  return <RollsContext.Provider value={context}>{props.children}</RollsContext.Provider>;
};

export const useRolls = () => useContext(RollsContext);
