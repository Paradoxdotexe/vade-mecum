import React, { useState } from 'react';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';
import styled from 'styled-components';
import { VTable } from '@/components/VTable';
import { ReactComponent as WeightIcon } from '@/icons/Weight.svg';
import { VNumberInput } from '@/components/VNumberInput';
import { VPopup } from '@/components/VPopup';
import { DiceFactor, RollCard } from '../RollCard';
import { InventoryItem } from '../WorldKit';
import { RollEvaluation, useRolls } from '../useRolls';
import { DateTime } from 'luxon';
import { getInventoryItemDescription } from '@/utils/getInventoryItemDescription';

const StyledInventoryCard = styled(VCard)`
  padding: 0;
  max-height: 300px;
  overflow: auto;

  .cell--name {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cell--description {
    .part--clickable {
      &:hover {
        color: #43a6ec;
        cursor: pointer;
      }
    }
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
  const { addRoll } = useRolls();
  const { currentCharacter } = useCharacters();

  const [rolledItem, setRolledItem] = useState<InventoryItem>();
  const [rolledItemEvaluation, setRolledItemEvaluation] = useState<RollEvaluation>(
    RollEvaluation.CHECK
  );
  const [rolledItemActive, setRolledItemActive] = useState(false);

  const diceFactors: DiceFactor[] = [];

  if (rolledItem && rolledItemEvaluation) {
    // add attribute/skill if applicable
    if (rolledItemEvaluation === RollEvaluation.CHECK && rolledItem.bonus) {
      const attribute = currentCharacter.attributes[rolledItem.bonus.attributeKey];
      const skill = attribute.skills[rolledItem.bonus.skillKey];
      diceFactors.push(
        {
          type: 'A',
          label: attribute.label,
          value: attribute.value,
          disabled: true
        },
        {
          type: 'A',
          label: skill.label,
          value: skill.value,
          disabled: true
        },
        {
          type: 'A',
          label: rolledItem.name,
          value: rolledItem.bonus.skillBonus,
          disabled: true
        },
        { type: 'A', label: 'Advantage', value: 0 },
        { type: 'D', label: 'Disadvantage', value: 0 }
      );
    }

    // add damage if applicable
    if (rolledItemEvaluation === RollEvaluation.SUM && rolledItem.damage) {
      diceFactors.push(
        {
          type: 'A',
          label: rolledItem.name,
          value: rolledItem.damage,
          disabled: true
        },
        { type: 'A', label: 'Bonus', value: 0 }
      );
    }
  }

  return (
    <>
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
            {
              key: 'description',
              render: item => (
                <div className="cell--description">
                  {getInventoryItemDescription(item)
                    .split(',')
                    .map((part, i) => {
                      const action = part.includes(' to ');
                      const damage = part.includes('damage');
                      return (
                        <React.Fragment key={i}>
                          {i > 0 && ','}
                          <span
                            className={action || damage ? 'part--clickable' : ''}
                            onClick={() => {
                              setRolledItem(item);
                              setRolledItemActive(true);
                              setRolledItemEvaluation(
                                action ? RollEvaluation.CHECK : RollEvaluation.SUM
                              );
                            }}
                          >
                            {part}
                          </span>
                        </React.Fragment>
                      );
                    })}
                </div>
              ),
              width: '100%'
            },
            {
              key: 'weight',
              render: item => (
                <div className="cell--weight">
                  {(item.quantity * item.weight).toFixed(2)}
                  <WeightIcon />
                </div>
              )
            }
          ]}
          rows={currentCharacter.items}
          emptyMessage="You have no inventory items."
        />
      </StyledInventoryCard>
      <VPopup open={rolledItemActive} onClose={() => setRolledItemActive(false)}>
        <RollCard
          title={`${currentCharacter.name || 'Anonymous'} (${rolledItem?.name})`}
          diceFactors={diceFactors}
          evaluation={rolledItemEvaluation}
          onRoll={dice => {
            addRoll({
              characterKey: currentCharacter.key,
              label: rolledItem?.name ?? '',
              dice,
              timestamp: DateTime.now().toISO(),
              evaluation: rolledItemEvaluation
            });
            setTimeout(() => setRolledItemActive(false), 1500);
          }}
        />
      </VPopup>
    </>
  );
};
