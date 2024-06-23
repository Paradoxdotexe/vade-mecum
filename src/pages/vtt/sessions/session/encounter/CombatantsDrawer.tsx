import { VCard } from '@/components/VCard';
import { VDrawer, VDrawerProps } from '@/components/VDrawer';
import { VInput } from '@/components/VInput';
import React, { useState } from 'react';
import styled from 'styled-components';
import { VHeader } from '@/components/VHeader';
import { searchObjects } from '@/utils/searchObjects';
import { WORLD_KIT } from '@/pages/vtt/types/WorldKit';
import { CombatantCard } from '@/pages/vtt/sessions/session/encounter/CombatantCard';
import { VFlex } from '@/components/VFlex';
import { useVTheme } from '@/common/VTheme';
import { VButton } from '@/components/VButton';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import { Combatant } from '@/pages/vtt/types/Combatant';

const StyledCombatantsDrawer = styled(VDrawer)`
  .drawer__content {
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.variable.gap.lg};
    padding: ${props => props.theme.variable.gap.xl};
    overflow: auto;
    scrollbar-gutter: stable;

    .content__section {
      display: flex;
      flex-direction: column;
      gap: ${props => props.theme.variable.gap.md};
    }
  }
`;

type CombatantsDrawerProps = Pick<VDrawerProps, 'open' | 'onClose'> & {
  onAddCombatant: (combatant: Combatant) => void;
};

export const CombatantsDrawer: React.FC<CombatantsDrawerProps> = props => {
  const theme = useVTheme();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredCombatants = searchObjects(
    WORLD_KIT.combatants,
    ['name', 'affiliation'],
    searchQuery
  );

  return (
    <StyledCombatantsDrawer
      {...props}
      onClose={() => {
        setSearchQuery('');
        props.onClose?.();
      }}
      width={500}
      header="Combatants"
    >
      <div className="drawer__content">
        <VCard style={{ padding: 0 }}>
          <VInput
            placeholder="Search combatants..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </VCard>

        <div className="content__section">
          <VHeader>Combatants</VHeader>
          <VFlex vertical gap={theme.variable.gap.lg}>
            {filteredCombatants.map(combatant => (
              <VFlex key={combatant.key} gap={theme.variable.gap.md}>
                <CombatantCard combatant={combatant} />
                <VButton size="small" onClick={() => props.onAddCombatant(combatant)}>
                  <PlusIcon />
                </VButton>
              </VFlex>
            ))}
          </VFlex>
        </div>
      </div>
    </StyledCombatantsDrawer>
  );
};
