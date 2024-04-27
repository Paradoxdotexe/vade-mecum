import React from 'react';
import { VCard } from '@/components/VCard';
import styled from 'styled-components';
import { VTable, VTableColumn } from '@/components/VTable';
import { capitalize } from 'lodash-es';
import { CharacterClient } from './useCharacterClient';
import { Perk } from '@/pages/vtt/types/Perk';

const StyledPerksCard = styled(VCard)`
  padding: 0;
  max-height: 300px;
  overflow: auto;
`;

type PerksCardProps = {
  characterClient: CharacterClient;
};


export const PerksCard: React.FC<PerksCardProps> = (props) => {
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
      <VTable columns={columns} rows={props.characterClient.perks} emptyMessage="You have no perks." />
    </StyledPerksCard>
  );
};
