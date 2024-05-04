import React from 'react';
import { VInput } from '@/components/VInput';
import { VCard } from '@/components/VCard';
import { CharacterClient } from '../useCharacterClient';

type PersonalGoalCardProps = {
  characterClient: CharacterClient;
};

export const PersonalGoalCard: React.FC<PersonalGoalCardProps> = props => {
  return (
    <VCard style={{ padding: 0 }}>
      <VInput
        placeholder="Personal goal"
        value={props.characterClient.personalGoal}
        onChange={props.characterClient.setPersonalGoal}
      />
    </VCard>
  );
};
