import React from 'react';
import { VCard } from '@/components/VCard';
import { VTable, VTableColumn } from '@/components/VTable';
import { CharacterClient } from '../useCharacterClient';
import { ClassAbility } from '@/pages/vtt/types/Class';
import { startCase } from 'lodash-es';
import reactStringReplace from 'react-string-replace';
import { VTag } from '@/components/VTag';

type ClassAbilitiesCardProps = {
  characterClient: CharacterClient;
};

export const ClassAbilitiesCard: React.FC<ClassAbilitiesCardProps> = props => {
  const columns: VTableColumn<ClassAbility>[] = [
    { key: 'name', dataKey: 'name' },
    { key: 'type', render: ability => startCase(ability.type.toLowerCase()) },
    {
      key: 'description',
      render: classAbility =>
        reactStringReplace(classAbility.description, /`(.*?)`/g, (match, i) => (
          <VTag key={i} style={{ display: 'inline-block' }}>
            {match}
          </VTag>
        )),
      width: '100%'
    }
  ];

  return (
    <VCard style={{ padding: 0 }}>
      <VTable
        columns={columns}
        rows={props.characterClient.classAbilities}
        emptyMessage="You have no class abilities."
      />
    </VCard>
  );
};
