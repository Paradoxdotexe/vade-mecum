import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Roll } from '../types/Roll';
import { playSound } from '@/utils/playSound';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { useSessionRollsQuery } from '../queries/useSessionRollsQuery';
import {
  propagateSessionRoll,
  useCreateSessionRollMutation
} from '../queries/useCreateSessionRollMutation';
import { useQueryClient } from 'react-query';
import { DateTime } from 'luxon';

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
    if (webSocket) {
      // we're either leaving a session or switching sessions
      webSocket.close();
    }

    if (sessionId) {
      const webSocket = new WebSocket(`wss://ws.vademecum.thenjk.com?sessionId=${sessionId}`);

      webSocket.onmessage = event => {
        const message: { event: string; data: object } = JSON.parse(event.data);

        if (message.event === 'ROLL_CREATED') {
          playSound('/sounds/DiceRoll.mp3').then(() => {
            propagateSessionRoll(queryClient, sessionId, message.data as Roll);
          });
        }
      };

      webSocket.onopen = () => {
        console.log(`Connected to session #${sessionId.split('-')[0]}.`);
        setWebSocket(webSocket);
      };

      webSocket.onclose = () => {
        console.log(`Disconnected from session #${sessionId.split('-')[0]}.`);
        setWebSocket(undefined);
      };
    }
  }, [sessionId]);

  const { data: sessionRolls } = useSessionRollsQuery(sessionId);

  const { mutate: createSessionRoll } = useCreateSessionRollMutation(sessionId);

  const rolls = useMemo(() => {
    const rolls = sessionId ? sessionRolls : localRolls;
    return (
      rolls &&
      [...rolls].sort((a, b) =>
        DateTime.fromISO(a.timestamp) < DateTime.fromISO(b.timestamp) ? 1 : -1
      )
    );
  }, [sessionRolls, localRolls]);

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

export const useRolls = (sessionId?: string) => {
  const rollsContext = useContext(RollsContext);

  useEffect(() => {
    rollsContext.setSessionId(sessionId);
  }, [sessionId]);

  return rollsContext;
};
