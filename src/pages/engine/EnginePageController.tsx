import React from 'react';
import { EnginePage } from './EnginePage';
import { CharactersStateProvider } from './useCharacters';
import { RollsStateProvider } from './useRolls';

export const EnginePageController: React.FC = () => {
  return (
    <RollsStateProvider>
      <CharactersStateProvider>
        <EnginePage />
      </CharactersStateProvider>
    </RollsStateProvider>
  );
};
