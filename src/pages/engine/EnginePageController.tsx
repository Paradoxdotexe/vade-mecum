import React from 'react';
import { EnginePage } from './EnginePage';
import { CharactersStateProvider } from './useCharacters';
import { RollsStateProvider } from './useRolls';
import { SessionStateProvider } from './useSession';

export const EnginePageController: React.FC = () => {
  return (
    <SessionStateProvider>
      <RollsStateProvider>
        <CharactersStateProvider>
          <EnginePage />
        </CharactersStateProvider>
      </RollsStateProvider>
    </SessionStateProvider>
  );
};
