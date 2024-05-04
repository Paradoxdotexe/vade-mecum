import { VCard } from '@/components/VCard';
import { VDrawer, VDrawerProps } from '@/components/VDrawer';
import { VInput } from '@/components/VInput';
import { VTable } from '@/components/VTable';
import React, { useState } from 'react';
import styled from 'styled-components';
import { VCheckbox } from '@/components/VCheckbox';
import { VHeader } from '@/components/VHeader';
import { searchObjects } from '@/utils/searchObjects';
import { capitalize } from 'lodash-es';
import { CharacterClient } from '../useCharacterClient';
import { PERKS, Perk } from '@/pages/vtt/types/Perk';

const StyledPerksDrawer = styled(VDrawer)`
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

type PerksDrawerProps = Pick<VDrawerProps, 'open' | 'onClose'> & {
  characterClient: CharacterClient;
};

export const PerksDrawer: React.FC<PerksDrawerProps> = props => {
  const [searchQuery, setSearchQuery] = useState('');

  const isPerkSelected = (perkKey: string) =>
    props.characterClient.perks.some(perk => perk.key === perkKey);

  const togglePerk = (perkKey: string) => {
    if (isPerkSelected(perkKey)) {
      props.characterClient.removePerk(perkKey);
    } else {
      props.characterClient.addPerk(perkKey);
    }
  };

  const isPerkAvailable = (perk: Perk) => {
    if (!perk.requirement) return true;

    const attribute = props.characterClient.attributes[perk.requirement.attributeKey];
    const skill = attribute.skills[perk.requirement.skillKey];
    return skill.value >= perk.requirement.skillRequirement;
  };

  const filteredPerks = searchObjects(
    PERKS,
    ['name', 'requirement.skillKey', 'description'],
    searchQuery
  );

  return (
    <StyledPerksDrawer
      {...props}
      onClose={() => {
        setSearchQuery('');
        props.onClose?.();
      }}
      width={800}
      header="Perks"
    >
      <div className="drawer__content">
        <VCard style={{ padding: 0 }}>
          <VInput placeholder="Search perks..." value={searchQuery} onChange={setSearchQuery} />
        </VCard>
        <div className="content__section">
          <VHeader>Perks</VHeader>
          <VCard style={{ padding: 0 }}>
            <VTable
              columns={[
                {
                  key: 'selected',
                  render: perk => <VCheckbox checked={isPerkSelected(perk.key)} />
                },
                { key: 'name', dataKey: 'name' },
                {
                  key: 'skill',
                  render: perk =>
                    !!perk.requirement &&
                    `${capitalize(perk.requirement.skillKey)} ${perk.requirement.skillRequirement}`
                },
                { key: 'description', dataKey: 'description', width: '100%' }
              ]}
              rows={filteredPerks}
              emptyMessage="No perks match your query."
              onRowClick={perk => togglePerk(perk.key)}
              rowDisabled={perk => !isPerkAvailable(perk)}
            />
          </VCard>
        </div>
      </div>
    </StyledPerksDrawer>
  );
};
