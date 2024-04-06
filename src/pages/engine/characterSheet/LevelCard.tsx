import React from 'react';
import { VCard } from '@/components/VCard';
import { VNumberInput } from '@/components/VNumberInput';
import styled from 'styled-components';
import { useCharacters } from '../useCharacters';
import { VButton } from '@/components/VButton';
import { pulsingBackground } from '@/styles/pulsingBackground';

const StyledLevelCard = styled(VCard)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-block: 9px;

  .card__levelPoints {
    display: flex;
    gap: 3px;

    .levelPoints__point {
      height: 10px;
      width: 10px;
      border-radius: 6px;
      background-color: #585858;
      cursor: pointer;

      &.point--gained {
        ${pulsingBackground}
      }
    }
  }

  button {
    ${pulsingBackground}
  }
`;

export const LevelCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  const showLevelUp = currentCharacter.levelPoints === 6;

  const levelUp = () => {
    const levelUpSound = new Audio('/sounds/level-up.mp3');
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
        <div className="card__levelPoints">
          {[...new Array(6)].map((_, i) => (
            <div
              key={i}
              className={`levelPoints__point ${currentCharacter.levelPoints > i ? 'point--gained' : ''}`}
              onClick={() => {
                if (i + 1 === currentCharacter.levelPoints) {
                  currentCharacter.setLevelPoints(0);
                } else {
                  currentCharacter.setLevelPoints(i + 1);
                }
              }}
            />
          ))}
        </div>
      )}

      <VButton
        type="primary"
        style={{ display: !showLevelUp ? 'none' : undefined }}
        onClick={levelUp}
      >
        LEVEL UP
      </VButton>
    </StyledLevelCard>
  );
};
