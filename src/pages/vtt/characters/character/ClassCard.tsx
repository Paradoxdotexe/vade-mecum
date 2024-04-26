import { VSelect } from '@/components/VSelect';
import React from 'react';
import { VCard } from '@/components/VCard';
import { CharacterClient } from './useCharacterClient';
import { WORLD_KIT } from '../../types/WorldKit';

type ClassCardProps = {
  characterClient: CharacterClient;
  style?: React.CSSProperties;
};

export const ClassCard: React.FC<ClassCardProps> = props => {
  return (
    <VCard style={{ padding: 0, ...props.style }}>
      <VSelect
        placeholder="Class"
        options={WORLD_KIT.classes.map(_class => ({
          value: _class.key,
          label: _class.name
        }))}
        value={props.characterClient.class?.key}
        onChange={props.characterClient.setClass}
      />
    </VCard>
  );
};
