import { useVTheme } from '@/common/VTheme';
import React, { ReactNode, useEffect, useState } from 'react';
import { Combatant, CombatantAbility } from '@/pages/vtt/types/Combatant';
import {
  CombatantClient,
  useCombatantClient
} from '@/pages/vtt/sessions/session/encounter/useCombatantClient';
import { CombatantAttributeCard } from '@/pages/vtt/sessions/session/encounter/CombatantAttributeCard';
import { AttributeKey } from '@/pages/vtt/types/Character';
import { VHeader } from '@/components/VHeader';
import { VFlex } from '@/components/VFlex';
import { VDrawer, VDrawerProps } from '@/components/VDrawer';
import { VCard } from '@/components/VCard';
import { VInput } from '@/components/VInput';
import { NumberInputOverMax } from '@/pages/vtt/characters/character/cards/NumberInputOverMax';
import { VNumberInput } from '@/components/VNumberInput';
import { VTable } from '@/components/VTable';
import { startCase } from 'lodash-es';
import { VTag } from '@/components/VTag';
import reactStringReplace from 'react-string-replace';
import { ItemDescription } from '@/pages/vtt/characters/character/cards/InventoryCard';
import { WORLD_KIT } from '@/pages/vtt/types/WorldKit';
import { RollableSkill } from '@/pages/vtt/characters/character/cards/RollableSkill';
import { useRollModal } from '@/pages/vtt/rolls/RollModal';
import { DiceFactor, RollEvaluation } from '@/pages/vtt/types/Roll';

type CombatantDrawerProps = Pick<VDrawerProps, 'open' | 'onClose'> & {
  combatant: Combatant;
  healthPoints: number;
};

export const CombatantDrawer: React.FC<CombatantDrawerProps> = props => {
  const theme = useVTheme();
  const rollModal = useRollModal();

  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    if (open !== props.open) {
      setOpen(props.open);
    }
  }, [props.open]);

  const combatantClient = useCombatantClient(props.combatant);

  const onRollLooting = () => {
    rollModal.open({
      characterId: '',
      characterName: combatantClient.name,
      label: 'Looting',
      diceFactors: [{ label: 'Combatant Level', value: combatantClient.level }],
      evaluation: RollEvaluation.SUM
    });
  };

  return (
    <VDrawer
      {...props}
      open={open}
      onClose={() => {
        setOpen(false);
        props.onClose?.();
      }}
      width={1050}
      header={combatantClient.name}
    >
      <VFlex style={{ padding: theme.variable.gap.xl }} gap={theme.variable.gap.lg}>
        <VFlex vertical gap={theme.variable.gap.lg}>
          <VFlex vertical gap={theme.variable.gap.md} style={{ pointerEvents: 'none' }}>
            <VHeader>Name / Affiliation</VHeader>
            <VCard style={{ padding: 0 }}>
              <VInput value={combatantClient.name} />
            </VCard>
            <VCard style={{ padding: 0 }}>
              <VInput placeholder="None" value={combatantClient.affiliation} />
            </VCard>
          </VFlex>

          <VFlex vertical gap={theme.variable.gap.md}>
            <VHeader>Attributes / Skills</VHeader>

            {Object.keys(props.combatant.attributes).map(key => (
              <CombatantAttributeCard
                key={key}
                combatantClient={combatantClient}
                attributeKey={key as AttributeKey}
                onRoll={() => setOpen(false)}
              />
            ))}

            <VCard style={{ padding: theme.variable.gap.md }}>
              <VFlex justify="center" gap={theme.variable.gap.lg}>
                <RollableSkill
                  label="Looting"
                  value={combatantClient.level}
                  onClick={onRollLooting}
                  disabled
                />
              </VFlex>
            </VCard>
          </VFlex>
        </VFlex>

        <VFlex vertical style={{ flex: 1 }} gap={theme.variable.gap.lg}>
          <VFlex align="stretch" gap={theme.variable.gap.lg} style={{ height: 102 }}>
            <VFlex vertical gap={theme.variable.gap.md} style={{ flex: 1 }}>
              <VHeader>Description</VHeader>
              <VCard style={{ padding: theme.variable.gap.md, flex: 1 }}>
                <div
                  style={{
                    lineHeight: 1.28, // perfect lineHeight to get three rows to reach 102px height
                    fontSize: theme.variable.fontSize.sm,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {combatantClient.description}
                </div>
              </VCard>
            </VFlex>

            <VFlex vertical gap={theme.variable.gap.md}>
              <VHeader>Level</VHeader>
              <VCard style={{ paddingBlock: 0, paddingInline: theme.variable.gap.md, flex: 1 }}>
                <VFlex align="center" justify="center" style={{ height: '100%' }}>
                  <VNumberInput value={combatantClient.level} size={48} disabled />
                </VFlex>
              </VCard>
            </VFlex>

            <VFlex vertical gap={theme.variable.gap.md}>
              <VHeader>Health Points</VHeader>
              <VCard style={{ paddingBlock: 0, paddingInline: theme.variable.gap.md, flex: 1 }}>
                <VFlex align="center" style={{ height: '100%' }}>
                  <NumberInputOverMax
                    size={48}
                    value={props.healthPoints}
                    max={combatantClient.maxHealthPoints}
                    disabled
                  />
                </VFlex>
              </VCard>
            </VFlex>

            <VFlex vertical gap={theme.variable.gap.md}>
              <VHeader>Speed</VHeader>
              <VCard
                style={{
                  fontSize: 36,
                  fontWeight: 600,
                  paddingInline: theme.variable.gap.md,
                  flex: 1
                }}
              >
                <VFlex align="center" style={{ height: '100%' }}>
                  {combatantClient.speed * 5}ft
                </VFlex>
              </VCard>
            </VFlex>
          </VFlex>

          <VFlex vertical gap={theme.variable.gap.md}>
            <VHeader>Abilities</VHeader>
            <VCard style={{ padding: 0 }}>
              <VTable
                columns={[
                  { key: 'name', dataKey: 'name' },
                  { key: 'type', render: ability => startCase(ability.type.toLowerCase()) },
                  {
                    key: 'description',
                    render: ability => (
                      <CombatantAbilityDescription
                        combatantAbility={ability}
                        combatantClient={combatantClient}
                      />
                    ),
                    width: '100%'
                  }
                ]}
                rows={combatantClient.abilities}
                emptyMessage="You have no abilities. Better find an improvised weapon!"
              />
            </VCard>
          </VFlex>

          <VFlex vertical gap={theme.variable.gap.md}>
            <VHeader>Inventory</VHeader>
            <VCard style={{ padding: 0 }}>
              <VTable
                columns={[
                  {
                    key: 'name',
                    dataKey: 'name'
                  },
                  {
                    key: 'description',
                    render: item => (
                      <ItemDescription characterClient={combatantClient} item={item} />
                    ),
                    width: '100%'
                  }
                ]}
                rows={WORLD_KIT.items.filter(item => item.key.startsWith('improvised_'))}
              />
            </VCard>
          </VFlex>
        </VFlex>
      </VFlex>
    </VDrawer>
  );
};

type CombatantAbilityDescriptionProps = {
  combatantClient?: CombatantClient;
  combatantAbility: CombatantAbility;
  style?: React.CSSProperties;
};

const CombatantAbilityDescription: React.FC<CombatantAbilityDescriptionProps> = props => {
  const theme = useVTheme();
  const rollModal = useRollModal();

  const attributes = Object.values(props.combatantClient?.attributes ?? {});

  const onRollSkill = (skillKey: string) => {
    if (!props.combatantClient) return;

    for (const attribute of attributes) {
      const skill = attribute.skills[skillKey];

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

        rollModal.open({
          characterId: '',
          characterName: props.combatantClient.name,
          label: skill.label,
          diceFactors,
          evaluation: RollEvaluation.CHECK
        });

        break;
      }
    }
  };

  const onRollDamage = (label: string, damage: number) => {
    if (!props.combatantClient) return;

    rollModal.open({
      characterId: '',
      characterName: props.combatantClient.name,
      label: label,
      diceFactors: [{ label: 'Damage', value: damage }],
      evaluation: RollEvaluation.SUM
    });
  };

  let description: ReactNode[] = [props.combatantAbility.description];

  // make checks rollable
  description = reactStringReplace(description, /([A-Z][a-z]+) check/g, (match, i) => {
    // check that this is a valid skill
    if (!attributes.some(attribute => attribute.skills[match.toLowerCase()])) {
      return `${match} check`;
    }

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
        onClick={() => onRollDamage(props.combatantAbility.name, damage)}
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
