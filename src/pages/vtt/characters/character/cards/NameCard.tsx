import React from 'react';
import { VInput } from '@/components/VInput';
import { VCard } from '@/components/VCard';
import { CharacterClient } from '../useCharacterClient';

type NameCardProps = {
  characterClient: CharacterClient;
};

export const NameCard: React.FC<NameCardProps> = props => {
  return (
    <VCard style={{ padding: 0 }}>
      <VInput
        placeholder="Name"
        value={props.characterClient.name}
        onChange={props.characterClient.setName}
      />
    </VCard>
  );
};
