import { VSelect } from '@/components/VSelect';
import React from 'react';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';
import { CLASSES } from '@/types/Character';
import { capitalize } from '@/utils/capitalize';

export const ClassCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  return (
    <VCard style={{ padding: 0 }}>
      <VSelect
        placeholder="Class"
        options={Object.keys(CLASSES).map(classKey => ({
          value: classKey,
          label: capitalize(classKey)
        }))}
        value={currentCharacter.classKey}
        onChange={currentCharacter.setClass}
      />
    </VCard>
  );
};
