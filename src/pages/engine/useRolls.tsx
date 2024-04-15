import React, { ReactNode, useContext, useEffect } from 'react';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { useStateVersioner } from '@/utils/useStateVersioner';
import { useSession } from './useSession';
import { useQueryClient } from 'react-query';
import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';

export enum RollEvaluation {
  CHECK = 'CHECK',
  SUM = 'SUM'
}

export type Roll = {
  id: string;
  characterId: string;
  label: string;
  dice: number[];
  timestamp: string;
  evaluation: RollEvaluation;
};

type RollsState = {
  version: string;
  rolls: Roll[];
};

const DEFAULT_ROLLS_STATE: RollsState = {
  version: '3.0',
  rolls: []
};

interface RSC extends RollsState {
  update: (partialRollsState: Partial<RollsState>) => void;
}

const RollsStateContext = React.createContext<RSC>({
  ...structuredClone(DEFAULT_ROLLS_STATE),
  update: () => {}
});

export const RollsStateProvider: React.FC<{ children?: ReactNode }> = props => {
  const [rollsState, setRollsState] = useLocalStorage(
    'vc:engine:rolls',
    structuredClone(DEFAULT_ROLLS_STATE)
  );

  useStateVersioner(rollsState, setRollsState, DEFAULT_ROLLS_STATE);

  const update = (partialRollsState: Partial<RollsState>) =>
    setRollsState({ ...rollsState, ...partialRollsState });

  const rollsContext: RSC = {
    ...rollsState,
    update
  };

  const { webSocket } = useSession();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (webSocket) {
      webSocket.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        if (message.event === 'NEW_ROLL') {
          const rollSound = new Audio('/sounds/roll.mp3');
          rollSound.addEventListener(
            'canplaythrough',
            () => {
              rollSound.play();

              // update GET_SESSION_ROLLS cache with new roll
              queryClient.setQueryData('GET_SESSION_ROLLS', (sessionRolls: Roll[] | undefined) => [
                ...(sessionRolls ?? []),
                message.data.roll
              ]);
            },
            false
          );
        }
      });
    }
  }, [webSocket]);

  return (
    <RollsStateContext.Provider value={rollsContext}>{props.children}</RollsStateContext.Provider>
  );
};

const MAX_ROLLS = 100;

export const useRolls = () => {
  const rollsState = useContext(RollsStateContext);
  const { sessionId, userId, webSocket, sessionRolls } = useSession();

  const queryClient = useQueryClient();

  const addRoll = async (roll: Omit<Roll, 'id'>) => {
    const newRoll = { id: uuid(), ...roll };
    if (webSocket) {
      webSocket.send(JSON.stringify({ action: 'addRoll', sessionId, userId, roll: newRoll }));
      // update GET_SESSION_ROLLS cache with new roll
      queryClient.setQueryData('GET_SESSION_ROLLS', (sessionRolls: Roll[] | undefined) => [
        ...(sessionRolls ?? []),
        newRoll
      ]);
    } else {
      rollsState.update({
        rolls: [...rollsState.rolls, newRoll].slice(0, MAX_ROLLS)
      });
    }
  };

  const rolls = sessionId ? sessionRolls ?? [] : rollsState.rolls;
  rolls.sort((a, b) => (DateTime.fromISO(b.timestamp) > DateTime.fromISO(a.timestamp) ? 1 : -1));

  return {
    rolls: sessionId ? sessionRolls ?? [] : rollsState.rolls,
    addRoll
  };
};
