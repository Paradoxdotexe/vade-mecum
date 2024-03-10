import React from 'react';
import { VCard } from '@/components/VCard';
import styled from 'styled-components';
import { useCharacters } from '../useCharacters';

const StyledSpeedCard = styled(VCard)`
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 36px;
  font-weight: 600;
`;

export const SpeedCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  return <StyledSpeedCard>{currentCharacter.speed * 5}ft</StyledSpeedCard>;
};
