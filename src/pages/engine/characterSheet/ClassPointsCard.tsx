import React from 'react';
import { VCard } from '@/components/VCard';
import { VNumberInput } from '@/components/VNumberInput';
import styled from 'styled-components';
import { useCharacters } from '../useCharacters';

const StyledClassPointsCard = styled(VCard)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  .card__slash {
    font-size: 36px;
    font-weight: 200;
    padding-inline: 6px 3px;
  }

  .card__max {
    font-size: 24px;
  }
`;

export const ClassPointsCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  if (!currentCharacter) {
    return null;
  }

  return (
    <StyledClassPointsCard>
      <VNumberInput
        size={48}
        max={currentCharacter.maxClassPoints}
        value={currentCharacter.classPoints}
        onChange={currentCharacter.setClassPoints}
      />
      <div className="card__slash">/</div>
      <div className="card__max">{currentCharacter.maxClassPoints}</div>
    </StyledClassPointsCard>
  );
};
