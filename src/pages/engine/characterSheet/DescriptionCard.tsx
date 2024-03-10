import React from 'react';
import { useEngineState } from '../EngineStateContext';
import { VTextArea } from '@/components/VTextArea';
import { VCard } from '@/components/VCard';

export const DescriptionCard: React.FC = () => {
  const { character, updateCharacter } = useEngineState();

  return (
    <VCard style={{ padding: 0, flex: 1 }}>
      <VTextArea
        placeholder="Description"
        value={character.description}
        onChange={description => updateCharacter({ description })}
        style={{ height: '100%' }}
      />
    </VCard>
  );
};
