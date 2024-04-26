import React from 'react';
import { VCard } from '@/components/VCard';
import styled from 'styled-components';
import { CharacterClient } from './useCharacterClient';

const StyledSpeedCard = styled(VCard)`
  display: flex;
  align-items: center;
  flex: 1;
  font-size: 36px;
  font-weight: 600;
  padding: 0 ${props => props.theme.variable.gap.md};
`;

type SpeedCardProps = {
  characterClient: CharacterClient;
};

export const SpeedCard: React.FC<SpeedCardProps> = props => {
  return <StyledSpeedCard>{props.characterClient.speed * 5}ft</StyledSpeedCard>;
};
