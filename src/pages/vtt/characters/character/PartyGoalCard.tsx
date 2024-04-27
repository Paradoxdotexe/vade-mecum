import React from 'react';
import { VInput } from '@/components/VInput';
import { VCard } from '@/components/VCard';
import { CharacterClient } from './useCharacterClient';

type PartyGoalCardProps = {
  characterClient: CharacterClient;
};

export const PartyGoalCard: React.FC<PartyGoalCardProps> = props => {
  return (
    <VCard style={{ padding: 0 }}>
      <VInput
        placeholder="Party goal"
        value={props.characterClient.partyGoal}
        onChange={props.characterClient.setPartyGoal}
      />
    </VCard>
  );
};
