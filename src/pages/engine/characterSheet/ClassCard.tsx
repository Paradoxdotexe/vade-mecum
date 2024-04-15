import { VSelect } from '@/components/VSelect';
import React from 'react';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';
import { WORLD_KITS } from '../WorldKit';

export const ClassCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  if (!currentCharacter) {
    return null;
  }

  return (
    <VCard style={{ padding: 0 }}>
      <VSelect
        placeholder="Class"
        options={Object.entries(WORLD_KITS.vale_of_myths.classes).map(
          ([classKey, characterClass]) => ({
            value: classKey,
            label: characterClass.label
          })
        )}
        value={currentCharacter.classKey}
        onChange={currentCharacter.setClass}
      />
    </VCard>
  );
};
