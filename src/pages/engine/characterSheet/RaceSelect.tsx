import { VSelect } from '@/components/VSelect';
import React from 'react';
import { RACES, useEngineState } from '../EngineStateContext';
import { VCard } from '@/components/VCard';

export const RaceSelect: React.FC = () => {
  const { character, updateCharacter } = useEngineState();

  const races = RACES.vale_of_myths;

  return (
    <VCard style={{ padding: 0 }}>
      <VSelect
        placeholder="Race"
        options={races.map(race => ({
          value: race,
          label: race
        }))}
        value={character.race}
        onChange={race => updateCharacter({ race })}
      />
    </VCard>
  );
};
