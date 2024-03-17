import React from 'react';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';
import styled from 'styled-components';
import { VTable } from '@/components/VTable';
import { ReactComponent as WeightIcon } from '@/icons/Weight.svg';
import { VNumberInput } from '@/components/VNumberInput';

const StyledInventoryCard = styled(VCard)`
  padding: 0;
  max-height: 300px;
  overflow: auto;

  .cell--name {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cell--weight {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 3px;

    svg {
      font-size: 20px;
    }
  }
`;

export const InventoryCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  return (
    <StyledInventoryCard>
      <VTable
        columns={[
          {
            key: 'name',
            render: item => (
              <div className="cell--name">
                {item.name}
                <VNumberInput
                  value={item.quantity}
                  onChange={value => currentCharacter.updateItemQuantity(item.key, value)}
                />
              </div>
            )
          },
          { key: 'description', dataKey: 'description', width: '100%' },
          {
            key: 'weight',
            render: item => (
              <div className="cell--weight">
                {(item.quantity * item.slots).toFixed(2)}
                <WeightIcon />
              </div>
            )
          }
        ]}
        rows={currentCharacter.items}
        emptyMessage="You have no inventory items."
      />
    </StyledInventoryCard>
  );
};
