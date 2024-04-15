import React from 'react';
import { VInput } from '@/components/VInput';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';

export const NameCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  if (!currentCharacter) {
    return null;
  }

  return (
    <VCard style={{ padding: 0 }}>
      <VInput
        placeholder="Name"
        value={currentCharacter.name}
        onChange={currentCharacter.setName}
      />
    </VCard>
  );
};
