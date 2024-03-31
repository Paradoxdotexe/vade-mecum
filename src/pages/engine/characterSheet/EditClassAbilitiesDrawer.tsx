import { VCard } from '@/components/VCard';
import { VDrawer, VDrawerProps } from '@/components/VDrawer';
import { VInput } from '@/components/VInput';
import { VTable } from '@/components/VTable';
import React, { useState } from 'react';
import styled from 'styled-components';
import { VCheckbox } from '@/components/VCheckbox';
import { useCharacters } from '../useCharacters';
import { VHeader } from '@/components/VHeader';
import { searchObjects } from '@/utils/searchObjects';

const StyledEditClassAbilitiesDrawer = styled(VDrawer)`
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

type EditClassAbilitiesDrawerProps = Pick<VDrawerProps, 'open' | 'onClose'>;

export const EditClassAbilitiesDrawer: React.FC<EditClassAbilitiesDrawerProps> = props => {
  const { currentCharacter } = useCharacters();

  const [searchQuery, setSearchQuery] = useState('');

  const isSelected = (classAbilityKey: string) =>
    currentCharacter.classAbilityKeys.includes(classAbilityKey);

  const toggleClassAbility = (classAbilityKey: string) => {
    if (isSelected(classAbilityKey)) {
      currentCharacter.removeClassAbility(classAbilityKey);
    } else {
      currentCharacter.addClassAbility(classAbilityKey);
    }
  };

  const classAbilities = searchObjects(
    currentCharacter.class?.classAbilities ?? [],
    ['name', 'description'],
    searchQuery
  );

  return (
    <StyledEditClassAbilitiesDrawer {...props} width={800} header={'Edit Class Abilities'}>
      <div className="drawer__content">
        <VCard style={{ padding: 0 }}>
          <VInput
            placeholder="Search class abilities..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </VCard>
        <div className="content__section">
          <VHeader>Class Abilities</VHeader>
          <VCard style={{ padding: 0 }}>
            <VTable
              columns={[
                {
                  key: 'selected',
                  render: classAbility => <VCheckbox checked={isSelected(classAbility.key)} />
                },
                { key: 'name', dataKey: 'name' },
                {
                  key: 'level',
                  render: classAbility => `Level ${classAbility.levelRequirement}`
                },
                { key: 'description', dataKey: 'description', width: '100%' }
              ]}
              rows={classAbilities}
              emptyMessage="No class abilities match your query."
              onRowClick={row => toggleClassAbility(row.key)}
            />
          </VCard>
        </div>
      </div>
    </StyledEditClassAbilitiesDrawer>
  );
};
