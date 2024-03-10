import { VSelect } from '@/components/VSelect';
import React from 'react';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';
import { WORLD_KITS } from '../WorldKit';

export const RaceCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  return (
    <VCard style={{ padding: 0 }}>
      <VSelect
        placeholder="Race"
        options={WORLD_KITS.vale_of_myths.races.map(race => ({
          value: race,
          label: race
        }))}
        value={currentCharacter.race}
        onChange={currentCharacter.setRace}
      />
    </VCard>
  );
};
