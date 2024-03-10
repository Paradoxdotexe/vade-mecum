import { VSelect } from '@/components/VSelect';
import React from 'react';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';

const RACES = ['Human', 'Dwarf', 'Elf', 'Fay', 'Halfling'];

export const RaceCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  return (
    <VCard style={{ padding: 0 }}>
      <VSelect
        placeholder="Race"
        options={RACES.map(race => ({
          value: race,
          label: race
        }))}
        value={currentCharacter.race}
        onChange={currentCharacter.setRace}
      />
    </VCard>
  );
};
