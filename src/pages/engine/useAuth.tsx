import React, { ReactNode, useContext } from 'react';
import { useLocalStorage } from '@/utils/useLocalStorage';

export type User = {
  id: string;
  email: string;
};

type AuthState = {
  user?: User;
};

interface ASC extends AuthState {
  setUser: (user?: User) => void;
}

const AuthStateContext = React.createContext<ASC>({
  setUser: () => {}
});

export const AuthStateProvider: React.FC<{ children?: ReactNode }> = props => {
  const [authState, setAuthState] = useLocalStorage('vc:engine:auth', {} as AuthState);

  const setUser = (user?: User) => {
    setAuthState({ user });
  };

  const authStateContext: ASC = {
    ...authState,
    setUser
  };

  return (
    <AuthStateContext.Provider value={authStateContext}>{props.children}</AuthStateContext.Provider>
  );
};

export const useAuth = () => {
  const authState = useContext(AuthStateContext);

  return authState;
};
