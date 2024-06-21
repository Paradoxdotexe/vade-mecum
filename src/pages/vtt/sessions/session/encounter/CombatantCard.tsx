import React from 'react';
import { VCard } from '@/components/VCard';
import { VNumberInput } from '@/components/VNumberInput';
import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';
import { Combatant } from '@/pages/vtt/types/Combatant';
import { VTag } from '@/components/VTag';

type CombatantCardProps = {
  combatant: Combatant;
  onClick?: () => void;
};

export const CombatantCard: React.FC<CombatantCardProps> = props => {
  const theme = useVTheme();

  const combatRating = 2 + Math.floor(props.combatant.level / 4);

  const maxHealthPoints = (props.combatant.level + combatRating) * 6;

  return (
    <VCard onClick={props.onClick} style={{ flex: 1 }}>
      <VFlex justify="space-between" align="center">
        <VFlex vertical gap={theme.variable.gap.md}>
          <div style={{ fontWeight: 600 }}>{props.combatant.name}</div>
          <VFlex gap={theme.variable.gap.md}>
            <VTag>
              <strong>CR</strong> {combatRating}
            </VTag>
            <VTag>
              <strong>SPEED</strong> {props.combatant.speed * 5}ft
            </VTag>
            <VTag>
              <strong>HP</strong> {maxHealthPoints}
            </VTag>
          </VFlex>
        </VFlex>

        <VNumberInput value={props.combatant.level} size={40} disabled />
      </VFlex>
    </VCard>
  );
};
