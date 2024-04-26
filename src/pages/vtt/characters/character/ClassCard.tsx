import { VSelect } from '@/components/VSelect';
import React from 'react';
import { VCard } from '@/components/VCard';
import { CharacterClient } from './useCharacterClient';
import { WORLD_KITS } from '@/pages/engine/WorldKit';

type ClassCardProps = {
  characterClient: CharacterClient;
  style?: React.CSSProperties;
};

export const ClassCard: React.FC<ClassCardProps> = props => {
  return (
    <VCard style={{ padding: 0, ...props.style }}>
      <VSelect
        placeholder="Class"
        options={Object.entries(WORLD_KITS.vale_of_myths.classes).map(
          ([classKey, characterClass]) => ({
            value: classKey,
            label: characterClass.label
          })
        )}
        value={props.characterClient.classKey}
        onChange={props.characterClient.setClass}
      />
    </VCard>
  );
};
