import React from 'react';
import { VCard } from '@/components/VCard';
import { VNumberInput } from '@/components/VNumberInput';
import styled from 'styled-components';
import { CharacterClient } from './useCharacterClient';

const StyledHealthPointsCard = styled(VCard)`
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 ${props => props.theme.variable.gap.lg};

  .card__slash {
    font-size: 36px;
    font-weight: 200;
    padding-inline: ${props => props.theme.variable.gap.md} ${props => props.theme.variable.gap.sm};
  }

  .card__max {
    font-size: 24px;
  }
`;

type HealthPointsCardProps = {
  characterClient: CharacterClient;
};

export const HealthPointsCard: React.FC<HealthPointsCardProps> = props => {
  return (
    <StyledHealthPointsCard>
      <VNumberInput
        size={48}
        max={props.characterClient.maxHealthPoints}
        value={props.characterClient.healthPoints}
        onChange={props.characterClient.setHealthPoints}
      />
      <div className="card__slash">/</div>
      <div className="card__max">{props.characterClient.maxHealthPoints}</div>
    </StyledHealthPointsCard>
  );
};
