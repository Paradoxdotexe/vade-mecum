import { VCard } from '@/components/VCard';
import { VDrawer, VDrawerProps } from '@/components/VDrawer';
import { VInput } from '@/components/VInput';
import { VTable, VTableColumn } from '@/components/VTable';
import React, { useState } from 'react';
import styled from 'styled-components';
import { PERKS, Perk } from '../Perk';
import { capitalize } from '@/utils/capitalize';
import { VCheckbox } from '@/components/VCheckbox';
import { useCharacters } from '../useCharacters';

const StyledEditPerksDrawer = styled(VDrawer)`
  .drawer__content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px 6px 24px 24px;
    overflow: auto;
    scrollbar-gutter: stable;
  }
`;

type EditPerksDrawerProps = Pick<VDrawerProps, 'open' | 'onClose'>;

export const EditPerksDrawer: React.FC<EditPerksDrawerProps> = props => {
  const { currentCharacter } = useCharacters();

  const [searchQuery, setSearchQuery] = useState('');

  const isSelected = (perkKey: string) => currentCharacter.perkKeys.includes(perkKey);

  const togglePerk = (perkKey: string) => {
    isSelected(perkKey) ? currentCharacter.removePerk(perkKey) : currentCharacter.addPerk(perkKey);
  };

  const columns: VTableColumn<Perk>[] = [
    {
      key: 'selected',
      render: perk => <VCheckbox checked={isSelected(perk.key)} />
    },
    { key: 'name', dataKey: 'name' },
    {
      key: 'skill',
      render: perk => `${capitalize(perk.skillKey)} ${perk.skillRequirement}`
    },
    { key: 'description', dataKey: 'description' }
  ];

  let perks = PERKS;
  if (searchQuery) {
    const regex = new RegExp(searchQuery, 'i');
    perks = perks.filter(perk =>
      [perk.name, perk.description, perk.attributeKey, perk.skillKey].some(str => regex.test(str))
    );
  }

  return (
    <StyledEditPerksDrawer {...props} width={800} header={'Edit Perks'}>
      <div className="drawer__content">
        <VCard style={{ padding: 0 }}>
          <VInput placeholder="Search perks..." value={searchQuery} onChange={setSearchQuery} />
        </VCard>
        <VCard style={{ padding: 0 }}>
          <VTable
            columns={columns}
            rows={perks}
            emptyMessage="No perks match your query."
            onRowClick={row => togglePerk(row.key)}
          />
        </VCard>
      </div>
    </StyledEditPerksDrawer>
  );
};
