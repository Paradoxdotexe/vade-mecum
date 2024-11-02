import React, { ReactNode } from 'react';
import { VCard } from '@/components/VCard';
import { VTable, VTableColumn } from '@/components/VTable';
import { CharacterClient } from '../useCharacterClient';
import { ClassAbility } from '@/pages/vtt/types/Class';
import { capitalize, startCase } from 'lodash-es';
import reactStringReplace from 'react-string-replace';
import { RollableSkill } from '@/pages/vtt/characters/character/cards/RollableSkill';
import { useVTheme } from '@/common/VTheme';
import { useRollModal } from '@/pages/vtt/rolls/RollModal';
import { DiceFactor, RollEvaluation } from '@/pages/vtt/types/Roll';
import { VTag } from '@/components/VTag';

type ClassAbilitiesCardProps = {
  characterClient: CharacterClient;
};

export const ClassAbilitiesCard: React.FC<ClassAbilitiesCardProps> = props => {
  const columns: VTableColumn<ClassAbility>[] = [
    { key: 'name', dataKey: 'name' },
    { key: 'type', render: ability => startCase(ability.type.toLowerCase()) },
    {
      key: 'description',
      render: classAbility => (
        <ClassAbilityDescription
          characterClient={props.characterClient}
          classAbility={classAbility}
        />
      ),
      width: '100%'
    }
  ];

  return (
    <VCard style={{ padding: 0 }}>
      <VTable
        columns={columns}
        rows={props.characterClient.classAbilities}
        emptyMessage="You have no class abilities."
      />
    </VCard>
  );
};

type ClassAbilityDescriptionProps = {
  characterClient?: CharacterClient;
  classAbility: ClassAbility;
  style?: React.CSSProperties;
};

export const ClassAbilityDescription: React.FC<ClassAbilityDescriptionProps> = props => {
  const theme = useVTheme();
  const rollModal = useRollModal();

  const attributes = Object.values(props.characterClient?.attributes ?? {});

  const onRollSkill = (skillKey: string) => {
    if (!props.characterClient) return;

    for (const attribute of attributes) {
      let skill = attribute.skills[skillKey];

      // check for class skill
      if (
        props.characterClient.class.attributeKey === attribute.label.toLowerCase() &&
        props.characterClient.class.skillKey === skillKey
      ) {
        skill = {
          label: capitalize(props.characterClient.class.skillKey),
          value: props.characterClient.class.classItemBonus
        };
      }

      if (skill) {
        const diceFactors: DiceFactor[] = [
          {
            label: attribute.label,
            value: attribute.value
          },
          {
            label: skill.label,
            value: skill.value
          }
        ];

        if (props.characterClient.exhaustion) {
          diceFactors.push({
            label: 'Exhaustion',
            value: -props.characterClient.exhaustion
          });
        }

        rollModal.open({
          characterId: props.characterClient.id,
          characterName: props.characterClient.name,
          label: skill.label,
          diceFactors,
          evaluation: RollEvaluation.CHECK
        });

        break;
      }
    }
  };

  const onRollDamage = (label: string, damage: number) => {
    if (!props.characterClient) return;

    rollModal.open({
      characterId: props.characterClient.id,
      characterName: props.characterClient.name,
      label: label,
      diceFactors: [{ label: 'Damage', value: damage }],
      evaluation: RollEvaluation.SUM
    });
  };

  let description: ReactNode[] = [props.classAbility.description];

  // make checks rollable
  description = reactStringReplace(description, /([A-Z][a-z]+) check/g, (match, i) => {
    return (
      <RollableSkill
        key={`check#${i}`}
        value={0}
        label={`${match} check`}
        style={{ fontSize: 'inherit', display: 'inline-flex' }}
        onClick={() => onRollSkill(match.toLowerCase())}
        hideZero
      />
    );
  });

  // make damage rollable
  description = reactStringReplace(description, /`(\d+)D6` damage/g, (match, i) => {
    const damage = parseInt(match);

    return (
      <RollableSkill
        key={`damage#${i}`}
        value={damage}
        valueLabel={`${damage}D6`}
        label="damage"
        style={{ gap: theme.variable.gap.sm, fontSize: 'inherit', display: 'inline-flex' }}
        onClick={() => onRollDamage(props.classAbility.name, damage)}
      />
    );
  });

  // replace any random blocks
  description = reactStringReplace(description, /`(.*?)`/g, (match, i) => {
    return (
      <VTag key={`block#${i}`} style={{ display: 'inline-block' }}>
        {match}
      </VTag>
    );
  });

  return <div style={props.style}>{description}</div>;
};
