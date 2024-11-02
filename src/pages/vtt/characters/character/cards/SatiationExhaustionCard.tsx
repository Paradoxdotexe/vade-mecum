import React from 'react';
import { VCard } from '@/components/VCard';
import { Points } from './Points';
import { VButton } from '@/components/VButton';
import { CharacterClient } from '../useCharacterClient';
import { VFlex } from '@/components/VFlex';
import { useVTheme } from '@/common/VTheme';
import { useRollModal } from '@/pages/vtt/rolls/RollModal';
import { RollEvaluation } from '@/pages/vtt/types/Roll';
import { sum } from 'lodash-es';

type SatiationExhaustionCardProps = {
  characterClient: CharacterClient;
};

export const SatiationExhaustionCard: React.FC<SatiationExhaustionCardProps> = props => {
  const theme = useVTheme();

  const rollModal = useRollModal();

  const { attributes } = props.characterClient;

  const onRest = () => {
    rollModal
      .open({
        characterId: props.characterClient.id,
        characterName: props.characterClient.name,
        label: 'Rest',
        diceFactors: [
          { label: 'Base', value: 3 },
          { label: 'Level', value: props.characterClient.level },
          ...[attributes.strength, attributes.strength.skills.fortitude].map(df => ({
            label: df.label,
            value: df.value
          }))
        ],
        evaluation: RollEvaluation.SUM
      })
      .then(roll => {
        props.characterClient.setSatiation(props.characterClient.satiation - 1);
        props.characterClient.setExhaustion(0);
        props.characterClient.setHealthPoints(props.characterClient.healthPoints + sum(roll.dice));
      });
  };

  return (
    <>
      <VCard style={{ padding: theme.variable.gap.md }}>
        <VFlex vertical gap={theme.variable.gap.md}>
          <VFlex justify="space-between" style={{ fontSize: theme.variable.fontSize.xs }}>
            <VFlex align="center" gap={theme.variable.gap.sm}>
              Satiation
              <Points
                max={4}
                value={props.characterClient.satiation}
                onChange={props.characterClient.setSatiation}
              />
            </VFlex>
            <VFlex align="center" gap={theme.variable.gap.sm}>
              Exhaustion
              <Points
                max={3}
                value={props.characterClient.exhaustion}
                onChange={props.characterClient.setExhaustion}
                type="failure"
              />
            </VFlex>
          </VFlex>

          <VButton size="small" disabled={!props.characterClient.satiation} onClick={onRest}>
            Rest
          </VButton>
        </VFlex>
      </VCard>
    </>
  );
};
