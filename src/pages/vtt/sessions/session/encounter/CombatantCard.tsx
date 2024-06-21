import React from 'react';
import { VCard } from '@/components/VCard';
import { VNumberInput } from '@/components/VNumberInput';
import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';
import { Combatant } from '@/pages/vtt/types/Combatant';
import { VTag } from '@/components/VTag';
import { useCombatantClient } from '@/pages/vtt/sessions/session/encounter/useCombatantClient';

type CombatantCardProps = {
  combatant: Combatant;
  onClick?: () => void;
};

export const CombatantCard: React.FC<CombatantCardProps> = props => {
  const theme = useVTheme();

  const combatantClient = useCombatantClient(props.combatant);

  return (
    <VCard onClick={props.onClick} style={{ flex: 1 }}>
      <VFlex justify="space-between" align="center">
        <VFlex vertical gap={theme.variable.gap.md}>
          <div style={{ fontWeight: 600 }}>{combatantClient.name}</div>
          <VFlex gap={theme.variable.gap.md}>
            <VTag>
              <strong>CR</strong> {combatantClient.combatRating}
            </VTag>
            <VTag>
              <strong>SPEED</strong> {combatantClient.speed * 5}ft
            </VTag>
            <VTag>
              <strong>HP</strong> {combatantClient.maxHealthPoints}
            </VTag>
          </VFlex>
        </VFlex>

        <VNumberInput value={combatantClient.level} size={40} disabled />
      </VFlex>
    </VCard>
  );
};
