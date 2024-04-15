import { VSelect } from '@/components/VSelect';
import React from 'react';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';
import { WORLD_KITS } from '../WorldKit';

export const RaceCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  if (!currentCharacter) {
    return null;
  }

  return (
    <VCard style={{ padding: 0 }}>
      <VSelect
        placeholder="Race"
        options={Object.entries(WORLD_KITS.vale_of_myths.races).map(([key, race]) => ({
          value: key,
          label: race.name
        }))}
        value={currentCharacter.raceKey}
        onChange={currentCharacter.setRace}
      />
    </VCard>
  );
};
