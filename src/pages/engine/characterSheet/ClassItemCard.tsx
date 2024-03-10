import React from 'react';
import { VTextArea } from '@/components/VTextArea';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';
import styled from 'styled-components';
import { capitalize } from '@/utils/capitalize';

const StyledClassItemCard = styled(VCard)`
  padding: 0;
  display: flex;
  flex-direction: column;

  .card__item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 12px 3px;

    .item__label {
      font-weight: 700;
    }

    .item__bonus {
      font-size: 14px;
    }
  }
`;

export const ClassItemCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  const characterClass = currentCharacter.class;

  return (
    <StyledClassItemCard style={{ padding: 0, flex: 1 }}>
      {characterClass && (
        <div className="card__item">
          <div className="item__label">{characterClass.classItemLabel}</div>
          <div className="item__bonus">
            (+{characterClass.classItemBonus} {capitalize(characterClass.skillKey)})
          </div>
        </div>
      )}
      <VTextArea
        placeholder="Item description"
        value={currentCharacter.classItemDescription}
        onChange={currentCharacter.setClassItemDescription}
      />
    </StyledClassItemCard>
  );
};
