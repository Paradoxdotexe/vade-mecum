import React from 'react';
import { VCard } from '@/components/VCard';
import { CharacterClient } from '../useCharacterClient';
import { VFlex } from '@/components/VFlex';
import { useVTheme } from '@/common/VTheme';
import { useRollModal } from '@/pages/vtt/rolls/RollModal';
import { RollEvaluation } from '@/pages/vtt/types/Roll';
import { ReactComponent as D20Icon } from '@/icons/D20.svg';
import styled, { css } from 'styled-components';

const Die = styled.div<{ $check?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: ${props => props.theme.color.background.sunken};
  border-radius: ${props => props.theme.variable.borderRadius};
  font-family: ${props => props.theme.variable.fontFamily.display};
  border: 1px solid ${props => props.theme.color.border.bold};
  cursor: pointer;

  ${props =>
    props.$check
      ? css`
          position: relative;
          width: 32px;
          height: 32px;
          background: none !important;
          border: none;
          z-index: 1;

          svg {
            position: absolute;
            color: ${props => props.theme.color.background.sunken};
            z-index: -1;
          }
        `
      : ''};
`;

type SatiationExhaustionCardProps = {
  characterClient: CharacterClient;
};

export const RandomRollCard: React.FC<SatiationExhaustionCardProps> = props => {
  const theme = useVTheme();

  const rollModal = useRollModal();

  const onRoll = (evaluation: RollEvaluation) => {
    rollModal.open({
      characterId: props.characterClient.id,
      characterName: props.characterClient.name,
      label: 'Random',
      diceFactors: evaluation === RollEvaluation.SUM ? [{ label: 'Base', value: 1 }] : [],
      evaluation
    });
  };

  return (
    <>
      <VCard style={{ padding: theme.variable.gap.md }}>
        <VFlex justify="center" align="center" gap={theme.variable.gap.xl}>
          <Die onClick={() => onRoll(RollEvaluation.SUM)}>?</Die>
          <Die $check={true} onClick={() => onRoll(RollEvaluation.CHECK)}>
            ?
            <D20Icon />
          </Die>
        </VFlex>
      </VCard>
    </>
  );
};
