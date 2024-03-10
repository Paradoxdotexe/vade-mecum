import React from 'react';
import { useEngineState } from '../EngineStateContext';
import { VCard } from '@/components/VCard';
import styled from 'styled-components';

const StyledSpeedCard = styled(VCard)`
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 36px;
  font-weight: 600;
`;

export const SpeedCard: React.FC = () => {
  const { character } = useEngineState();

  const dexterityAttribute = character.attributes.find(
    attribute => attribute.label === 'Dexterity'
  );
  const agilitySkill = dexterityAttribute?.skills.find(skill => skill.label === 'Agility');

  const dexterity = dexterityAttribute?.value ?? 0;
  const agility = agilitySkill?.value ?? 0;

  const speed = (dexterity + agility + 3) * 5;

  return <StyledSpeedCard>{speed}ft</StyledSpeedCard>;
};
