import React from 'react';
import { VCard } from '@/components/VCard';
import { Points } from './Points';
import { VButton } from '@/components/VButton';
import { CharacterClient } from '../useCharacterClient';
import { VFlex } from '@/components/VFlex';
import { useVTheme } from '@/common/VTheme';

type SatiationExhaustionCardProps = {
  characterClient: CharacterClient;
};

export const SatiationExhaustionCard: React.FC<SatiationExhaustionCardProps> = props => {
  const theme = useVTheme();

  return (
    <>
      <VCard style={{ padding: theme.variable.gap.md }}>
        <VFlex vertical gap={theme.variable.gap.md}>
          <VFlex justify="space-between" style={{ fontSize: theme.variable.fontSize.xs }}>
            <VFlex align="center" gap={theme.variable.gap.sm}>
              Satiation
              <Points
                max={4}
                value={props.characterClient.satiation}
                onChange={props.characterClient.setSatiation}
              />
            </VFlex>
            <VFlex align="center" gap={theme.variable.gap.sm}>
              Exhaustion
              <Points
                max={3}
                value={props.characterClient.exhaustion}
                onChange={props.characterClient.setExhaustion}
                type="FAILURE"
              />
            </VFlex>
          </VFlex>

          <VButton size="small" disabled={!props.characterClient.satiation}>
            Rest
          </VButton>
        </VFlex>
      </VCard>
    </>
  );
};
