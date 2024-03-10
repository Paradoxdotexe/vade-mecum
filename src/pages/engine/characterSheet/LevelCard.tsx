import React from 'react';
import { VCard } from '@/components/VCard';
import { VNumberInput } from '@/components/VNumberInput';
import styled from 'styled-components';
import { useCharacters } from '../useCharacters';

const StyledLevelCard = styled(VCard)`
  flex: 1;
  display: flex;
  align-items: center;
`;

export const LevelCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  return (
    <StyledLevelCard>
      <VNumberInput
        size={48}
        min={1}
        max={24}
        value={currentCharacter.level}
        onChange={currentCharacter.setLevel}
      />
    </StyledLevelCard>
  );
};
