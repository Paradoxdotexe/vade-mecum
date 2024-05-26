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
import { RollableSkill } from './RollableSkill';
import { useRollModal } from '@/pages/vtt/rolls/RollModal';
import { RollEvaluation } from '@/pages/vtt/types/Roll';

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
              render: item => (
                <ItemDescription characterClient={props.characterClient} item={item} />
              ),
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

type ItemDescriptionProps = {
  characterClient: CharacterClient;
  item: Item;
  style?: React.CSSProperties;
};

export const ItemDescription: React.FC<ItemDescriptionProps> = props => {
  const theme = useVTheme();

  const rollModal = useRollModal();

  const { attributes } = props.characterClient;

  const onRollSkill = () => {
    const attribute = attributes[props.item.bonus!.attributeKey];
    const skill = attribute.skills[props.item.bonus!.skillKey];

    rollModal.open({
      characterId: props.characterClient.id,
      characterName: props.characterClient.name,
      label: props.item.name,
      diceFactors: [
        ...[attribute, skill].map(df => ({ label: df.label, value: df.value })),
        { label: props.item.name, value: props.item.bonus!.skillBonus }
      ],
      evaluation: RollEvaluation.CHECK
    });
  };

  const onRollDamage = () => {
    rollModal.open({
      characterId: props.characterClient.id,
      characterName: props.characterClient.name,
      label: props.item.name,
      diceFactors: [{ label: 'Damage', value: props.item.damage! }],
      evaluation: RollEvaluation.SUM
    });
  };

  return (
    <VFlex gap={theme.variable.gap.sm} align="center" style={{ lineHeight: 1, ...props.style }}>
      {props.item.bonus && (
        <RollableSkill
          value={props.item.bonus.skillBonus}
          valueLabel={`+${props.item.bonus.skillBonus}`}
          label={`${capitalize(props.item.bonus.skillKey)}${props.item.damage || props.item.notes ? ',' : ''}`}
          disabled
          style={{ gap: theme.variable.gap.sm, fontSize: 'inherit' }}
          onClick={onRollSkill}
        />
      )}
      {props.item.damage && (
        <RollableSkill
          value={props.item.damage}
          valueLabel={`${props.item.damage}D6`}
          label={`damage${props.item.notes ? ',' : ''}`}
          disabled
          style={{ gap: theme.variable.gap.sm, fontSize: 'inherit' }}
          onClick={onRollDamage}
        />
      )}
      <div style={{ lineHeight: theme.variable.lineHeight }}>{props.item.notes}</div>
    </VFlex>
  );
};
