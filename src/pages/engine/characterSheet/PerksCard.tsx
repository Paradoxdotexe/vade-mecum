import React from 'react';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';
import styled from 'styled-components';
import { VTable, VTableColumn } from '@/components/VTable';
import { Perk } from '../Perk';
import { capitalize } from 'lodash-es';

const StyledPerksCard = styled(VCard)`
  padding: 0;
  max-height: 300px;
  overflow: auto;
`;

export const PerksCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  if (!currentCharacter) {
    return null;
  }

  const columns: VTableColumn<Perk>[] = [
    { key: 'name', dataKey: 'name' },
    {
      key: 'skill',
      render: perk =>
        !!perk.requirement &&
        `${capitalize(perk.requirement.skillKey)} ${perk.requirement.skillRequirement}`
    },
    { key: 'description', dataKey: 'description', width: '100%' }
  ];

  return (
    <StyledPerksCard>
      <VTable columns={columns} rows={currentCharacter.perks} emptyMessage="You have no perks." />
    </StyledPerksCard>
  );
};
