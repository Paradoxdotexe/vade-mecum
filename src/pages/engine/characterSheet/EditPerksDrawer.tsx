import { VCard } from '@/components/VCard';
import { VDrawer, VDrawerProps } from '@/components/VDrawer';
import { VInput } from '@/components/VInput';
import { VTable } from '@/components/VTable';
import React, { useState } from 'react';
import styled from 'styled-components';
import { PERKS, Perk } from '../Perk';
import { capitalize } from '@/utils/capitalize';
import { VCheckbox } from '@/components/VCheckbox';
import { useCharacters } from '../useCharacters';
import { VHeader } from '@/components/VHeader';
import { searchObjects } from '@/utils/searchObjects';

const StyledEditPerksDrawer = styled(VDrawer)`
  .drawer__content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px 6px 24px 24px;
    overflow: auto;
    scrollbar-gutter: stable;

    .content__section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
`;

type EditPerksDrawerProps = Pick<VDrawerProps, 'open' | 'onClose'>;

export const EditPerksDrawer: React.FC<EditPerksDrawerProps> = props => {
  const { currentCharacter } = useCharacters();

  const [searchQuery, setSearchQuery] = useState('');

  const isSelected = (perkKey: string) => currentCharacter.perkKeys.includes(perkKey);

  const togglePerk = (perkKey: string) => {
    if (isSelected(perkKey)) {
      currentCharacter.removePerk(perkKey);
    } else {
      currentCharacter.addPerk(perkKey);
    }
  };

  const generalPerks = searchObjects(
    PERKS,
    ['name', 'description', 'attributeKey', 'skillKey'],
    searchQuery
  );

  const classPerks = searchObjects(
    Object.values(currentCharacter.class?.perks ?? {}),
    ['name', 'description', 'attributeKey', 'skillKey'],
    searchQuery
  );

  const PerksSection = (props: { label: string; perks: Perk[] }) => {
    return (
      <div className="content__section">
        <VHeader>{props.label}</VHeader>
        <VCard style={{ padding: 0 }}>
          <VTable
            columns={[
              {
                key: 'selected',
                render: perk => <VCheckbox checked={isSelected(perk.key)} />
              },
              { key: 'name', dataKey: 'name' },
              {
                key: 'skill',
                render: perk => `${capitalize(perk.skillKey)} ${perk.skillRequirement}`
              },
              { key: 'description', dataKey: 'description', width: '100%' }
            ]}
            rows={props.perks}
            emptyMessage="No perks match your query."
            onRowClick={row => togglePerk(row.key)}
          />
        </VCard>
      </div>
    );
  };

  return (
    <StyledEditPerksDrawer {...props} width={800} header={'Edit Perks'}>
      <div className="drawer__content">
        <VCard style={{ padding: 0 }}>
          <VInput placeholder="Search perks..." value={searchQuery} onChange={setSearchQuery} />
        </VCard>
        <PerksSection label="General Perks" perks={generalPerks} />
        <PerksSection label="Class Perks" perks={classPerks} />
      </div>
    </StyledEditPerksDrawer>
  );
};
