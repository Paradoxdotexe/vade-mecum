import React from 'react';
import { VCard } from '@/components/VCard';
import { VNumberInput } from '@/components/VNumberInput';
import styled from 'styled-components';
import { useCharacters } from '../useCharacters';
import { VButton } from '@/components/VButton';
import { pulsingSuccess } from '@/styles/pulsingBackground';
import { Points } from './Points';

const StyledLevelCard = styled(VCard)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-block: 9px;

  button {
    ${pulsingSuccess}
  }
`;

export const LevelCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  if (!currentCharacter) {
    return null;
  }

  const showLevelUp = currentCharacter.levelPoints === 6;

  const levelUp = () => {
    const levelUpSound = new Audio('/sounds/LevelUp.mp3');
    levelUpSound.addEventListener(
      'canplaythrough',
      () => {
        levelUpSound.play();
        currentCharacter.addLevel();
      },
      false
    );
  };

  return (
    <StyledLevelCard
      style={showLevelUp ? { borderColor: '#34a9fe', background: '#34a9fe22' } : undefined}
    >
      <VNumberInput size={48} min={1} max={24} value={currentCharacter.level} disabled />

      {currentCharacter.level < 24 && (
        <Points
          max={6}
          value={currentCharacter.levelPoints}
          onChange={currentCharacter.setLevelPoints}
        />
      )}

      <VButton
        type="primary"
        size="small"
        style={{ display: !showLevelUp ? 'none' : undefined }}
        onClick={levelUp}
      >
        LEVEL UP
      </VButton>
    </StyledLevelCard>
  );
};
