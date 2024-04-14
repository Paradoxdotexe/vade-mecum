import { VCard } from '@/components/VCard';
import { VDrawer, VDrawerProps } from '@/components/VDrawer';
import { VInput } from '@/components/VInput';
import { VTable } from '@/components/VTable';
import React, { useState } from 'react';
import styled from 'styled-components';
import { PERKS } from '../Perk';
import { VCheckbox } from '@/components/VCheckbox';
import { useCharacters } from '../useCharacters';
import { VHeader } from '@/components/VHeader';
import { searchObjects } from '@/utils/searchObjects';
import { capitalize } from 'lodash-es';

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

  const perks = searchObjects(PERKS, ['name', 'description'], searchQuery);

  return (
    <StyledEditPerksDrawer {...props} width={800} header={'Edit Perks'}>
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
                  render: perk => <VCheckbox checked={isSelected(perk.key)} />
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
              rows={perks}
              emptyMessage="No perks match your query."
              onRowClick={row => togglePerk(row.key)}
              rowDisabled={perk =>
                !!perk.requirement &&
                currentCharacter.attributes[perk.requirement.attributeKey].skills[
                  perk.requirement.skillKey
                ].value < perk.requirement.skillRequirement
              }
            />
          </VCard>
        </div>
      </div>
    </StyledEditPerksDrawer>
  );
};
