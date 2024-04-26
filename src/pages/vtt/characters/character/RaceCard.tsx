import { VSelect } from '@/components/VSelect';
import React from 'react';
import { VCard } from '@/components/VCard';
import { CharacterClient } from './useCharacterClient';
import { WORLD_KITS } from '@/pages/engine/WorldKit';

type RaceCardProps = {
  characterClient: CharacterClient;
  style?: React.CSSProperties;
};

export const RaceCard: React.FC<RaceCardProps> = props => {
  return (
    <VCard style={{ padding: 0, ...props.style }}>
      <VSelect
        placeholder="Race"
        options={Object.entries(WORLD_KITS.vale_of_myths.races).map(([key, race]) => ({
          value: key,
          label: race.name
        }))}
        value={props.characterClient.raceKey}
        onChange={props.characterClient.setRace}
      />
    </VCard>
  );
};
