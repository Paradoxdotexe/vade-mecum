import React, { ReactNode, useContext, useMemo } from 'react';
import { Roll } from '../types/Roll';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { useSessionRollsQuery } from '../queries/useSessionRollsQuery';
import {
  propagateSessionRoll,
  useCreateSessionRollMutation
} from '../queries/useCreateSessionRollMutation';
import { DateTime } from 'luxon';
import { useSessionConnection } from '@/pages/vtt/sessions/useSessionConnection';
import { useDeleteSessionRollsMutation } from '@/pages/vtt/queries/useDeleteSessionRollsMutation';
import { useQueryClient } from 'react-query';

type _RollsContext = {
  sessionId?: string;
  rolls?: Roll[];
  addRoll: (roll: Roll) => void;
  clearRolls: () => Promise<void>;
};

const RollsContext = React.createContext<_RollsContext>({
  addRoll: () => {},
  clearRolls: () => Promise.resolve()
});

export const RollsProvider: React.FC<{ children: ReactNode }> = props => {
  const queryClient = useQueryClient();
  const { sessionId } = useSessionConnection();
  const { data: sessionRolls } = useSessionRollsQuery(sessionId);
  const { mutate: createSessionRoll } = useCreateSessionRollMutation(sessionId);
  const { mutateAsync: deleteSessionRolls } = useDeleteSessionRollsMutation(sessionId);

  const [localRolls, setLocalRolls] = useLocalStorage<Roll[]>('vm-vtt-rolls', []);

  const rolls = useMemo(() => {
    const rolls = sessionId ? sessionRolls : localRolls;
    return (
      rolls &&
      [...rolls].sort((a, b) =>
        DateTime.fromISO(a.timestamp) < DateTime.fromISO(b.timestamp) ? 1 : -1
      )
    );
  }, [sessionId, sessionRolls, localRolls]);

  const addRoll = (roll: Roll) => {
    if (sessionId) {
      propagateSessionRoll(queryClient, sessionId, roll);
      createSessionRoll({ roll });
    } else {
      setLocalRolls([...localRolls, roll]);
    }
  };

  const clearRolls = () => {
    return new Promise<void>(resolve => {
      if (sessionId) {
        deleteSessionRolls().then(() => resolve());
      } else {
        setLocalRolls([]);
        resolve();
      }
    });
  };

  const context: _RollsContext = {
    sessionId,
    rolls,
    addRoll,
    clearRolls
  };

  return <RollsContext.Provider value={context}>{props.children}</RollsContext.Provider>;
};

export const useRolls = () => useContext(RollsContext);
