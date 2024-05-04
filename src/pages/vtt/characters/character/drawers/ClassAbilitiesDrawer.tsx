import { VCard } from '@/components/VCard';
import { VDrawer, VDrawerProps } from '@/components/VDrawer';
import { VInput } from '@/components/VInput';
import { VTable } from '@/components/VTable';
import React, { useState } from 'react';
import styled from 'styled-components';
import { VCheckbox } from '@/components/VCheckbox';
import { VHeader } from '@/components/VHeader';
import { searchObjects } from '@/utils/searchObjects';
import { startCase } from 'lodash-es';
import { CharacterClient } from '../useCharacterClient';
import { ClassAbility } from '@/pages/vtt/types/Class';

const StyledClassAbilitiesDrawer = styled(VDrawer)`
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

type ClassAbilitiesDrawerProps = Pick<VDrawerProps, 'open' | 'onClose'> & {
  characterClient: CharacterClient;
};

export const ClassAbilitiesDrawer: React.FC<ClassAbilitiesDrawerProps> = props => {
  const [searchQuery, setSearchQuery] = useState('');

  const isClassAbilitySelected = (classAbilityKey: string) =>
    props.characterClient.classAbilities.some(ability => ability.key === classAbilityKey);

  const toggleClassAbility = (classAbilityKey: string) => {
    if (isClassAbilitySelected(classAbilityKey)) {
      props.characterClient.removeClassAbility(classAbilityKey);
    } else {
      props.characterClient.addClassAbility(classAbilityKey);
    }
  };

  const isClassAbilityAvailable = (classAbility: ClassAbility) => {
    if (typeof classAbility.requirement === 'string') {
      return false;
    }
    return classAbility.requirement <= props.characterClient.level;
  };

  const filteredClassAbilities = searchObjects(
    props.characterClient.class?.classAbilities.filter(
      ability => ability.requirement !== 'INNATE'
    ) ?? [],
    ['name', 'type', 'requirement', 'description'],
    searchQuery
  );

  return (
    <StyledClassAbilitiesDrawer
      {...props}
      onClose={() => {
        setSearchQuery('');
        props.onClose?.();
      }}
      width={900}
      header="Class Abilities"
    >
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
                  render: classAbility => (
                    <VCheckbox checked={isClassAbilitySelected(classAbility.key)} />
                  )
                },
                { key: 'name', dataKey: 'name' },
                { key: 'type', render: ability => startCase(ability.type.toLowerCase()) },
                {
                  key: 'requirement',
                  render: classAbility => {
                    // requirement is usually a certain level
                    if (typeof classAbility.requirement === 'number') {
                      return `Level ${classAbility.requirement}`;
                    }
                    // but may be another class ability
                    return props.characterClient.class?.classAbilities.find(
                      ability => ability.key === classAbility.requirement
                    )?.name;
                  }
                },
                { key: 'description', dataKey: 'description', width: '100%' }
              ]}
              rows={filteredClassAbilities}
              emptyMessage="No class abilities match your query."
              onRowClick={ability => toggleClassAbility(ability.key)}
              rowDisabled={ability => !isClassAbilityAvailable(ability)}
            />
          </VCard>
        </div>
      </div>
    </StyledClassAbilitiesDrawer>
  );
};
