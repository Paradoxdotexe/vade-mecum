import React from 'react';
import styled from 'styled-components';
import { AttributeCards } from './AttributeCards';
import { ClassCard } from './ClassCard';
import { NameCard } from './NameCard';
import { RaceCard } from './RaceCard';
import { DescriptionCard } from './DescriptionCard';
import { LevelCard } from './LevelCard';
import { HitPointsCard } from './HitPointsCard';
import { SpeedCard } from './SpeedCard';
import { ClassPointsCard } from './ClassPointsCard';
import { useCharacters } from '../useCharacters';
import { CLASSES } from '@/types/Character';
import { capitalize } from '@/utils/capitalize';

const Sheet = styled.div`
  display: flex;
  gap: 24px;

  .sheet__left {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .sheet__right {
    display: flex;
    flex-direction: column;
    gap: 24px;
    flex: 1;

    .right__top {
      display: flex;
      gap: 24px;
      height: 112px;
    }
  }

  .sheet__section {
    display: flex;
    flex-direction: column;
    gap: 12px;

    &.section--flex {
      flex: 1;
    }

    .section__header {
      font-family: 'Noto Sans Display', sans-serif;
      font-size: 18px;
    }

    .section__row {
      display: flex;
      gap: 12px;

      > * {
        flex: 1;
      }
    }
  }
`;

export const CharacterSheet: React.FC = () => {
  const { currentCharacter } = useCharacters();

  return (
    <Sheet>
      <div className="sheet__left">
        <div className="sheet__section">
          <div className="section__header">Name / Race / Class</div>
          <NameCard />
          <div className="section__row">
            <RaceCard />
            <ClassCard />
          </div>
        </div>

        <div className="sheet__section">
          <div className="section__header">Attributes / Skills</div>
          <AttributeCards />
        </div>
      </div>

      <div className="sheet__right">
        <div className="right__top">
          <div className="sheet__section section--flex">
            <div className="section__header">Description</div>
            <DescriptionCard />
          </div>
          <div className="sheet__section">
            <div className="section__header">Level</div>
            <LevelCard />
          </div>
          <div className="sheet__section">
            <div className="section__header">Hit Points</div>
            <HitPointsCard />
          </div>
          <div className="sheet__section">
            <div className="section__header">Speed</div>
            <SpeedCard />
          </div>
          {currentCharacter.maxClassPoints > 0 && (
            <div className="sheet__section">
              <div className="section__header">
                {capitalize(CLASSES[currentCharacter.classKey!].skillKey)} Points
              </div>
              <ClassPointsCard />
            </div>
          )}
        </div>
      </div>
    </Sheet>
  );
};
