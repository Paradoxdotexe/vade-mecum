import { VSelect } from '@/components/VSelect';
import React from 'react';
import { VCard } from '@/components/VCard';
import { CharacterClient } from '../useCharacterClient';
import { WORLD_KIT } from '../../../types/WorldKit';

type RaceCardProps = {
  characterClient: CharacterClient;
  style?: React.CSSProperties;
};

export const RaceCard: React.FC<RaceCardProps> = props => {
  return (
    <VCard style={{ padding: 0, ...props.style }}>
      <VSelect
        placeholder="Race"
        options={WORLD_KIT.races.map(race => ({
          value: race.key,
          label: race.name
        }))}
        value={props.characterClient.race?.key}
        onChange={props.characterClient.setRace}
      />
    </VCard>
  );
};
