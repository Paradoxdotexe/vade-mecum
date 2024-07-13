import { QueryClient, useQueryClient } from 'react-query';
import { useClientMutation } from '@/common/useClientMutation';
import { Roll } from '../types/Roll';

export const propagateSessionRoll = (
  queryClient: QueryClient,
  sessionId: string,
  propagatedSessionRoll: Roll
) => {
  // propagate into GET_SESSION_ROLLS query
  const sessionRolls: Roll[] | undefined = queryClient.getQueryData([
    'GET_SESSION_ROLLS',
    sessionId
  ]);
  if (sessionRolls && !sessionRolls.find(roll => roll.id === propagatedSessionRoll.id)) {
    // append new roll
    queryClient.setQueryData(
      ['GET_SESSION_ROLLS', sessionId],
      [...sessionRolls, propagatedSessionRoll]
    );
  }
};

export const useCreateSessionRollMutation = (sessionId: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useClientMutation<Record<string, never>, { roll: Roll }>(
    'POST',
    `/session/${sessionId}/roll`,
    {
      onSuccess: (_data, body) => {
        propagateSessionRoll(queryClient, sessionId!, body.roll);
      }
    }
  );

  return mutation;
};
