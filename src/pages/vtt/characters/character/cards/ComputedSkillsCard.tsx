import React from 'react';
import { VCard } from '@/components/VCard';
import { CharacterClient } from '../useCharacterClient';
import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';
import { RollableSkill } from './RollableSkill';
import { useRollModal } from '@/pages/vtt/rolls/RollModal';
import { RollEvaluation } from '@/pages/vtt/types/Roll';

type ComputedSkillsCardProps = {
  characterClient: CharacterClient;
};

export const ComputedSkillsCard: React.FC<ComputedSkillsCardProps> = props => {
  const theme = useVTheme();
  const rollModal = useRollModal();

  const { attributes } = props.characterClient;

  const onRollInitiative = () => {
    const shownDiceFactors = [
      { label: 'Base', value: 3 },
      ...[
        attributes.dexterity,
        attributes.dexterity.skills.agility,
        attributes.perception,
        attributes.perception.skills.detection
      ].map(df => ({ label: df.label, value: df.value }))
    ];

    rollModal.open({
      characterId: props.characterClient.id,
      characterName: props.characterClient.name,
      label: 'Initiative',
      diceFactors: [
        ...shownDiceFactors,
        // bonus will come from things like King's Champion perk
        {
          label: 'Bonus',
          value:
            props.characterClient.initiative -
            shownDiceFactors.reduce((sum, df) => sum + df.value, 0)
        }
      ],
      evaluation: RollEvaluation.SUM
    });
  };

  return (
    <VCard style={{ padding: theme.variable.gap.md }}>
      <VFlex justify="center" gap={theme.variable.gap.lg}>
        <RollableSkill
          label="Initiative"
          value={props.characterClient.initiative}
          onClick={onRollInitiative}
          disabled
        />
      </VFlex>
    </VCard>
  );
};
