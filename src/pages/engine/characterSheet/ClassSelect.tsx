import { VSelect } from '@/components/VSelect';
import React from 'react';
import { CLASSES, useEngineState } from '../EngineStateContext';

export const ClassSelect: React.FC = () => {
  const { character, updateCharacter } = useEngineState();

  const classes = CLASSES.vale_of_myths;

  return (
    <VSelect
      placeholder="Class"
      options={classes.map(c => ({
        value: c.label,
        label: c.label
      }))}
      className="section__class"
      value={character.class?.label}
      onChange={classLabel => updateCharacter({ class: classes.find(c => c.label === classLabel) })}
    />
  );
};
