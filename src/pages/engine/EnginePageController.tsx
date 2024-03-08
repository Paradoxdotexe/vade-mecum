import React from 'react';
import { EngineStateProvider } from './EngineStateContext';
import { EnginePage } from './EnginePage';

export const EnginePageController: React.FC = () => {
  return (
    <EngineStateProvider>
      <EnginePage />
    </EngineStateProvider>
  );
};
