import React from 'react';
import { EnginePage } from './EnginePage';
import { CharactersStateProvider } from './useCharacters';
import { RollsStateProvider } from './useRolls';
import { SessionStateProvider } from './useSession';
import { LoginPage } from './LoginPage';
import { useAuth } from './useAuth';

export const EnginePageController: React.FC = () => {
  const auth = useAuth();

  return auth.user ? (
    <SessionStateProvider>
      <RollsStateProvider>
        <CharactersStateProvider>
          <EnginePage />
        </CharactersStateProvider>
      </RollsStateProvider>
    </SessionStateProvider>
  ) : (
    <LoginPage />
  );
};
