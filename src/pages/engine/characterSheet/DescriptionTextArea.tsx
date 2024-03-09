import React from 'react';
import { useEngineState } from '../EngineStateContext';
import { VTextArea } from '@/components/VTextArea';

type DescriptionTextAreaProps = {
  className?: string;
};

export const DescriptionTextArea: React.FC<DescriptionTextAreaProps> = props => {
  const { character, updateCharacter } = useEngineState();

  return (
    <VTextArea
      placeholder="Description"
      value={character.description}
      onChange={description => updateCharacter({ description })}
      className={props.className}
    />
  );
};
