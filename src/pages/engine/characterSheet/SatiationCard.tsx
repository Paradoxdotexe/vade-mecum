import React from 'react';
import { VCard } from '@/components/VCard';
import { VNumberInput } from '@/components/VNumberInput';
import styled from 'styled-components';
import { useCharacters } from '../useCharacters';

const StyledSatiationCard = styled(VCard)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SatiationCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  return (
    <StyledSatiationCard>
      <VNumberInput
        size={48}
        max={4}
        value={currentCharacter.satiation}
        onChange={currentCharacter.setSatiation}
      />
    </StyledSatiationCard>
  );
};
