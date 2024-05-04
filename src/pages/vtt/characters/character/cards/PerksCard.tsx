import React from 'react';
import { VCard } from '@/components/VCard';
import { VTable, VTableColumn } from '@/components/VTable';
import { CharacterClient } from '../useCharacterClient';
import { Perk } from '@/pages/vtt/types/Perk';

type PerksCardProps = {
  characterClient: CharacterClient;
};

export const PerksCard: React.FC<PerksCardProps> = props => {
  const columns: VTableColumn<Perk>[] = [
    { key: 'name', dataKey: 'name' },
    { key: 'description', dataKey: 'description', width: '100%' }
  ];

  return (
    <VCard style={{ padding: 0 }}>
      <VTable
        columns={columns}
        rows={props.characterClient.perks}
        emptyMessage="You have no perks."
      />
    </VCard>
  );
};
