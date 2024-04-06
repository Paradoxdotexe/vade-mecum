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
import { startCase } from 'lodash-es';

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
    currentCharacter.classAbilities.some(ability => ability.key === classAbilityKey);

  const toggleClassAbility = (classAbilityKey: string) => {
    if (isSelected(classAbilityKey)) {
      currentCharacter.removeClassAbility(classAbilityKey);
    } else {
      currentCharacter.addClassAbility(classAbilityKey);
    }
  };

  const classAbilities = searchObjects(
    currentCharacter.class?.classAbilities.filter(ability => ability.requirement !== 'INNATE') ??
      [],
    ['name', 'description'],
    searchQuery
  );

  return (
    <StyledEditClassAbilitiesDrawer {...props} width={900} header={'Edit Class Abilities'}>
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
                { key: 'type', render: ability => startCase(ability.type.toLowerCase()) },
                {
                  key: 'requirement',
                  render: classAbility => {
                    if (typeof classAbility.requirement === 'number') {
                      return `Level ${classAbility.requirement}`;
                    }
                    return currentCharacter.class?.classAbilities.find(
                      ability => ability.key === classAbility.requirement
                    )?.name;
                  }
                },
                { key: 'description', dataKey: 'description', width: '100%' }
              ]}
              rows={classAbilities}
              emptyMessage="No class abilities match your query."
              onRowClick={ability => toggleClassAbility(ability.key)}
              rowDisabled={ability =>
                typeof ability.requirement !== 'number' ||
                ability.requirement > currentCharacter.level
              }
            />
          </VCard>
        </div>
      </div>
    </StyledEditClassAbilitiesDrawer>
  );
};
