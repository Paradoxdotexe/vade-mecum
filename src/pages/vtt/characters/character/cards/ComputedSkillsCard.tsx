import React from 'react';
import { VCard } from '@/components/VCard';
import { CharacterClient } from '../useCharacterClient';
import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';
import { RollableSkill } from './RollableSkill';

type ComputedSkillsCardProps = {
  characterClient: CharacterClient;
};

export const ComputedSkillsCard: React.FC<ComputedSkillsCardProps> = props => {
  const theme = useVTheme();

  return (
    <VCard style={{ padding: theme.variable.gap.md }}>
      <VFlex justify="center">
        <RollableSkill value={props.characterClient.initiative} label="Initiative" disabled />
      </VFlex>
    </VCard>
  );
};
