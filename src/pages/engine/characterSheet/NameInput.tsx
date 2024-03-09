import React from 'react';
import { useEngineState } from '../EngineStateContext';
import { VInput } from '@/components/VInput';
import { VCard } from '@/components/VCard';

export const NameInput: React.FC = () => {
  const { character, updateCharacter } = useEngineState();

  return (
    <VCard style={{ padding: 0 }}>
      <VInput
        placeholder="Name"
        value={character.name}
        onChange={name => updateCharacter({ name })}
      />
    </VCard>
  );
};
