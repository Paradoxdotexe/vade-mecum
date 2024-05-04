import React from 'react';
import { VCard } from '@/components/VCard';
import { VTable } from '@/components/VTable';
import { ReactComponent as WeightIcon } from '@/icons/Weight.svg';
import { VNumberInput } from '@/components/VNumberInput';
import { CharacterClient } from '../useCharacterClient';
import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';
import { Item } from '@/pages/vtt/types/Item';
import { capitalize } from 'lodash-es';

export const getItemDescription = (item: Item) => {
  const descriptionParts = [];

  if (item.bonus) {
    descriptionParts.push(`+${item.bonus.skillBonus} to ${capitalize(item.bonus.skillKey)}`);
  }
  if (item.damage) {
    descriptionParts.push(`${item.damage}D6 damage`);
  }
  if (item.notes) {
    descriptionParts.push(item.notes);
  }

  return descriptionParts.join(', ');
};

type InventoryCardProps = {
  characterClient: CharacterClient;
};

export const InventoryCard: React.FC<InventoryCardProps> = props => {
  const theme = useVTheme();

  return (
    <>
      <VCard style={{ padding: 0 }}>
        <VTable
          columns={[
            {
              key: 'name',
              render: item => (
                <VFlex gap={theme.variable.gap.md} align="center">
                  {item.name}
                  <VNumberInput
                    value={item.quantity}
                    onChange={value => props.characterClient.setItemQuantity(item.key, value)}
                  />
                </VFlex>
              )
            },
            {
              key: 'description',
              render: item => getItemDescription(item),
              width: '100%'
            },
            {
              key: 'weight',
              render: item =>
                item.weight && (
                  <VFlex gap={theme.variable.gap.sm} align="center" justify="end">
                    {(item.quantity * item.weight).toFixed(2)}
                    <WeightIcon fontSize={20} />
                  </VFlex>
                )
            }
          ]}
          rows={props.characterClient.items}
          emptyMessage="You have no inventory items."
        />
      </VCard>
    </>
  );
};
