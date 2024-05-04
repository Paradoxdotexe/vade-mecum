import React from 'react';
import { VCard } from '@/components/VCard';
import styled from 'styled-components';
import { VTable, VTableColumn } from '@/components/VTable';
import { CharacterClient } from '../useCharacterClient';
import { ClassAbility } from '@/pages/vtt/types/Class';
import { startCase } from 'lodash-es';

const StyledClassAbilitiesCard = styled(VCard)`
  padding: 0;
  max-height: 300px;
  overflow: auto;
`;

type ClassAbilitiesCardProps = {
  characterClient: CharacterClient;
};

export const ClassAbilitiesCard: React.FC<ClassAbilitiesCardProps> = props => {
  const columns: VTableColumn<ClassAbility>[] = [
    { key: 'name', dataKey: 'name' },
    { key: 'type', render: ability => startCase(ability.type.toLowerCase()) },
    { key: 'description', dataKey: 'description', width: '100%' }
  ];

  return (
    <StyledClassAbilitiesCard>
      <VTable
        columns={columns}
        rows={props.characterClient.classAbilities}
        emptyMessage="You have no class abilities."
      />
    </StyledClassAbilitiesCard>
  );
};
