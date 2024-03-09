import React from 'react';
import { useEngineState } from '../EngineStateContext';
import { VInput } from '@/components/VInput';

type NameInputProps = {
  className?: string;
};

export const NameInput: React.FC<NameInputProps> = props => {
  const { character, updateCharacter } = useEngineState();

  return (
    <VInput
      placeholder="Name"
      value={character.name}
      onChange={name => updateCharacter({ name })}
      className={props.className}
    />
  );
};
