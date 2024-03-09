import { VSelect } from '@/components/VSelect';
import React from 'react';
import { RACES, useEngineState } from '../EngineStateContext';

type RaceSelectProps = {
  className?: string;
};

export const RaceSelect: React.FC<RaceSelectProps> = props => {
  const { character, updateCharacter } = useEngineState();

  const races = RACES.vale_of_myths;

  return (
    <VSelect
      placeholder="Race"
      options={races.map(race => ({
        value: race,
        label: race
      }))}
      className={props.className}
      value={character.race}
      onChange={race => updateCharacter({ race })}
    />
  );
};
