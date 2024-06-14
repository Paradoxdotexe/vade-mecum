import React, { ReactNode, useContext, useMemo } from 'react';
import { Roll } from '../types/Roll';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { useSessionRollsQuery } from '../queries/useSessionRollsQuery';
import {
  propagateSessionRoll,
  useCreateSessionRollMutation
} from '../queries/useCreateSessionRollMutation';
import { useQueryClient } from 'react-query';
import { DateTime } from 'luxon';
import { useSessionConnection } from '@/pages/vtt/sessions/useSessionConnection';

type _RollsContext = {
  sessionId?: string;
  rolls?: Roll[];
  addRoll: (roll: Roll) => void;
};

const RollsContext = React.createContext<_RollsContext>({
  addRoll: () => {}
});

export const RollsProvider: React.FC<{ children: ReactNode }> = props => {
  const queryClient = useQueryClient();

  const { sessionId } = useSessionConnection();
  const { data: sessionRolls } = useSessionRollsQuery(sessionId);
  const { mutate: createSessionRoll } = useCreateSessionRollMutation(sessionId);

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
      createSessionRoll({ roll });
      propagateSessionRoll(queryClient, sessionId, roll);
    } else {
      setLocalRolls([...localRolls, roll]);
    }
  };

  const context: _RollsContext = {
    sessionId,
    rolls,
    addRoll
  };

  return <RollsContext.Provider value={context}>{props.children}</RollsContext.Provider>;
};

export const useRolls = () => useContext(RollsContext);
