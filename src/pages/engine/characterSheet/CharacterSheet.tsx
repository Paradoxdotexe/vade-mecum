import React, { useState } from 'react';
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
import { capitalize } from '@/utils/capitalize';
import { WORLD_KITS } from '../WorldKit';
import { ClassItemCard } from './ClassItemCard';
import { PerksCard } from './PerksCard';
import { ReactComponent as EditIcon } from '@/icons/Edit.svg';
import { EditPerksDrawer } from './EditPerksDrawer';
import { InventoryCard } from './InventoryCard';
import { EditItemsDrawer } from './EditItemsDrawer';

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

    .right__bottom {
      display: flex;
      flex-direction: column;
      gap: 24px;
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
      height: 18px;
      display: flex;
      justify-content: space-between;

      button {
        background: none;
        outline: none;
        border: none;
        color: #a0a0a0;
        display: flex;
        align-items: center;
        padding: 0;
        font-family: 'Noto Sans', sans-serif;
        gap: 3px;
        transition: color 150ms ease;
        font-size: 14px;

        &:hover {
          cursor: pointer;
          color: #fff;
        }

        svg {
          font-size: 16px;
        }
      }
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

  const [editingPerks, setEditingPerks] = useState(false);
  const [editingItems, setEditingItems] = useState(false);

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
                {capitalize(WORLD_KITS.vale_of_myths.classes[currentCharacter.classKey!].skillKey)}{' '}
                Points
              </div>
              <ClassPointsCard />
            </div>
          )}
        </div>

        <div className="right__bottom">
          {currentCharacter.class && (
            <div className="sheet__section">
              <div className="section__header">Class Item</div>
              <ClassItemCard />
            </div>
          )}
          <div className="sheet__section">
            <div className="section__header">
              Perks
              <button onClick={() => setEditingPerks(true)}>
                <EditIcon />
                Edit perks
              </button>
            </div>
            <PerksCard />
            <EditPerksDrawer open={editingPerks} onClose={() => setEditingPerks(false)} />
          </div>
          <div className="sheet__section">
            <div className="section__header">
              Inventory
              <button onClick={() => setEditingItems(true)}>
                <EditIcon />
                Edit items
              </button>
            </div>
            <InventoryCard />
            <EditItemsDrawer open={editingItems} onClose={() => setEditingItems(false)} />
          </div>
        </div>
      </div>
    </Sheet>
  );
};
