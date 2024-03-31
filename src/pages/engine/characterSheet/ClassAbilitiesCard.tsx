import React from 'react';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';
import styled from 'styled-components';
import { VTable } from '@/components/VTable';

const StyledClassAbilitiesCard = styled(VCard)`
  padding: 0;
  max-height: 300px;
  overflow: auto;
`;

export const ClassAbilitiesCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  return (
    <StyledClassAbilitiesCard>
      <VTable
        columns={[
          { key: 'name', dataKey: 'name' },
          { key: 'description', dataKey: 'description', width: '100%' }
        ]}
        rows={currentCharacter.classAbilities}
        emptyMessage="You have no class abilities."
      />
    </StyledClassAbilitiesCard>
  );
};
