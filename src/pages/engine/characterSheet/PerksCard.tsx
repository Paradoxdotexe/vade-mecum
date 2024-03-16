import React from 'react';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';
import styled from 'styled-components';
import { capitalize } from '@/utils/capitalize';

const StyledPerksCard = styled(VCard)`
  display: flex;
  flex-direction: column;

  .card__row {
    padding: 12px 12px;
    display: flex;
    align-items: center;
    gap: 36px;

    &:not(:last-child) {
      border-bottom: 1px solid #585858;
    }

    > div {
      height: 100%;
      line-height: 1.5;

      &:first-child {
        font-weight: 700;
      }

      &:not(:last-child) {
        white-space: nowrap;
      }

      &:last-child {
        flex: 1;
      }
    }
  }
`;

export const PerksCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  return (
    <StyledPerksCard style={{ padding: 0 }}>
      {currentCharacter.perks.map(perk => (
        <div key={perk.key} className="card__row">
          <div>{perk.name}</div>
          <div>
            {capitalize(perk.skillKey)} {perk.skillRequirement}
          </div>
          <div>{perk.description}</div>
        </div>
      ))}
      {currentCharacter.perks.length === 0 && <div className="card__row" />}
    </StyledPerksCard>
  );
};
