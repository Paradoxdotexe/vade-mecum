import React, { ReactNode, useContext } from 'react';
import { useLocalStorage } from '@/utils/useLocalStorage';

export type VTTUser = {
  id: string;
  email: string;
};

type AuthenticatedVTTUserContext = VTTUser & {
  authenticated: true;
  update: (user?: VTTUser) => void;
};

type UnauthenticatedVTTUserContext = {
  authenticated: false;
  update: (user?: VTTUser) => void;
};

type _VTTUserContext = AuthenticatedVTTUserContext | UnauthenticatedVTTUserContext;

const VTTUserContext = React.createContext<_VTTUserContext>({
  authenticated: false,
  update: () => {}
});

export const VTTUserProvider: React.FC<{ children?: ReactNode }> = props => {
  const [user, setUser] = useLocalStorage<VTTUser | undefined>('vm-vtt-user', undefined);

  const vttUserContext = {
    ...user,
    authenticated: !!user,
    update: setUser
  } as _VTTUserContext;

  return <VTTUserContext.Provider value={vttUserContext}>{props.children}</VTTUserContext.Provider>;
};

export const useVTTUser = () => {
  return useContext(VTTUserContext);
};
