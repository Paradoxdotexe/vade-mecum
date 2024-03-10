import React from 'react';
import { VTextArea } from '@/components/VTextArea';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';

export const DescriptionCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  return (
    <VCard style={{ padding: 0, flex: 1 }}>
      <VTextArea
        placeholder="Description"
        value={currentCharacter.description}
        onChange={currentCharacter.setDescription}
        style={{ height: '100%' }}
      />
    </VCard>
  );
};
