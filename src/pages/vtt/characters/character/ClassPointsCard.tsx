import React from 'react';
import { VCard } from '@/components/VCard';
import { VNumberInput } from '@/components/VNumberInput';
import styled from 'styled-components';
import { CharacterClient } from './useCharacterClient';

const StyledClassPointsCard = styled(VCard)`
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 ${props => props.theme.variable.gap.md};

  .card__slash {
    font-size: 36px;
    font-weight: 200;
    padding-inline: ${props => props.theme.variable.gap.sm} ${props => props.theme.variable.gap.xs};
  }

  .card__max {
    font-size: 24px;
  }
`;

type ClassPointsCardProps = {
  characterClient: CharacterClient;
};

export const ClassPointsCard: React.FC<ClassPointsCardProps> = props => {
  return (
    <StyledClassPointsCard>
      <VNumberInput
        size={48}
        max={props.characterClient.maxClassPoints}
        value={props.characterClient.classPoints}
        onChange={props.characterClient.setClassPoints}
      />
      <div className="card__slash">/</div>
      <div className="card__max">{props.characterClient.maxClassPoints}</div>
    </StyledClassPointsCard>
  );
};
