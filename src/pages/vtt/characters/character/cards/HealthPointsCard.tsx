import React from 'react';
import { VCard } from '@/components/VCard';
import { CharacterClient } from '../useCharacterClient';
import { NumberInputOverMax } from '@/pages/vtt/characters/character/cards/NumberInputOverMax';
import { useVTheme } from '@/common/VTheme';

type HealthPointsCardProps = {
  characterClient: CharacterClient;
};

export const HealthPointsCard: React.FC<HealthPointsCardProps> = props => {
  const theme = useVTheme();

  return (
    <VCard
      style={{ paddingBlock: 0, paddingInline: theme.variable.gap.md, flex: 1, display: 'flex' }}
    >
      <NumberInputOverMax
        size={48}
        value={props.characterClient.healthPoints}
        onChange={props.characterClient.setHealthPoints}
        max={props.characterClient.maxHealthPoints}
      />
    </VCard>
  );
};
