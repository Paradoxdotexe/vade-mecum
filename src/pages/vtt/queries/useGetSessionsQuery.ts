import { useClientQuery } from '@/common/useClientQuery';
import { Session } from '../types/Session';
// import { useQueryClient } from 'react-query';
//import { propagateCharacter } from './useGetCharacterQuery';

export const useGetSessionsQuery = () => {
  //const queryClient = useQueryClient();

  const query = useClientQuery<Session[]>(['GET_SESSIONS'], `/sessions`, {
    // onSuccess: sessions => {
    //   for (const session of sessions) {
    //     propagateCharacter(queryClient, session);
    //   }
    // }
  });

  return query;
};
