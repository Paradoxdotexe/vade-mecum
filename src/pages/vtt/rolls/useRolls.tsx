import React, { ReactNode, useContext, useState } from 'react';
import { Roll } from '../types/Roll';
import { playSound } from '@/utils/playSound';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { useSessionRollsQuery } from '../queries/useSessionRollsQuery';

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
  const [localRolls, setLocalRolls] = useLocalStorage<Roll[]>('vm-vtt-rolls', []);
  const [sessionId, setSessionId] = useState<string>();

  const { data: sessionRolls } = useSessionRollsQuery(sessionId);

  const rolls = sessionId ? sessionRolls : [...localRolls].reverse();

  const addRoll = (roll: Roll) => {
    playSound('/sounds/DiceRoll.mp3').then(() => {
      setLocalRolls([...localRolls, roll]);
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
