import { useVTheme } from '@/common/VTheme';
import React, { useEffect, useState } from 'react';
import { Combatant } from '@/pages/vtt/types/Combatant';
import { useCombatantClient } from '@/pages/vtt/sessions/session/encounter/useCombatantClient';
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

type CombatantDrawerProps = Pick<VDrawerProps, 'open' | 'onClose'> & {
  combatant: Combatant;
  healthPoints: number;
};

export const CombatantDrawer: React.FC<CombatantDrawerProps> = props => {
  const theme = useVTheme();

  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    if (open !== props.open) {
      setOpen(props.open);
    }
  }, [props.open]);

  const combatantClient = useCombatantClient(props.combatant);

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
                    render: ability =>
                      reactStringReplace(ability.description, /`(.*?)`/g, (match, i) => (
                        <VTag key={i} style={{ display: 'inline-block' }}>
                          {match}
                        </VTag>
                      )),
                    width: '100%'
                  }
                ]}
                rows={combatantClient.abilities}
                emptyMessage="You have no abilities. Better find an improvised weapon!"
              />
            </VCard>
          </VFlex>
        </VFlex>
      </VFlex>
    </VDrawer>
  );
};
