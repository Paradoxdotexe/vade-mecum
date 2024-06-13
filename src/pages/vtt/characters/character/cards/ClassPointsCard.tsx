import React from 'react';
import { VCard } from '@/components/VCard';
import { CharacterClient } from '../useCharacterClient';
import { useVTheme } from '@/common/VTheme';
import { NumberInputOverMax } from '@/pages/vtt/characters/character/cards/NumberInputOverMax';

type ClassPointsCardProps = {
  characterClient: CharacterClient;
};

export const ClassPointsCard: React.FC<ClassPointsCardProps> = props => {
  const theme = useVTheme();

  return (
    <VCard
      style={{ paddingBlock: 0, paddingInline: theme.variable.gap.md, flex: 1, display: 'flex' }}
    >
      <NumberInputOverMax
        size={48}
        value={props.characterClient.classPoints}
        onChange={props.characterClient.setClassPoints}
        max={props.characterClient.maxClassPoints}
      />
    </VCard>
  );
};
