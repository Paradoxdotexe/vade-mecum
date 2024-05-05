import React from 'react';
import { VCard } from '@/components/VCard';
import { VNumberInput } from '@/components/VNumberInput';
import styled from 'styled-components';
import { VButton } from '@/components/VButton';
import { pulsingBackground } from '@/styles/pulsingBackground';
import { CharacterClient } from '../useCharacterClient';
import { Points } from './Points';
import { playSound } from '@/utils/playSound';

const StyledLevelCard = styled(VCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: ${props => props.theme.variable.gap.md};
  padding: ${props => props.theme.variable.gap.md};

  &:has(button) {
    border-color: ${props => props.theme.color.status.success.border};
    background-color: ${props => props.theme.color.status.success.background};

    input {
      background-color: ${props => props.theme.color.status.success.background};
    }
  }

  button {
    width: 100%;
    ${props => pulsingBackground(props.theme.color.status.success.border)}
  }
`;

type LevelCardProps = {
  characterClient: CharacterClient;
};

export const LevelCard: React.FC<LevelCardProps> = props => {
  const levelUpAvailable = props.characterClient.levelPoints === 6;

  const levelUp = () => {
    playSound('/sounds/level-up.mp3').then(() => {
      props.characterClient.levelUp();
    });
  };

  return (
    <StyledLevelCard>
      <VNumberInput size={40} min={1} max={24} value={props.characterClient.level} disabled />

      {props.characterClient.level < 24 && (
        <Points
          max={6}
          value={props.characterClient.levelPoints}
          onChange={props.characterClient.setLevelPoints}
        />
      )}

      {levelUpAvailable && (
        <VButton type="primary" size="small" onClick={levelUp}>
          LEVEL UP
        </VButton>
      )}
    </StyledLevelCard>
  );
};
