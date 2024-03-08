import React, { ReactNode, useContext } from 'react';
import { useLocalStorage } from '../../utils/useLocalStorage';

export type Skill = {
  label: string;
  value: number;
};

export type Attribute = {
  label: string;
  value: number;
  skills: Skill[];
};

export type Character = {
  name: string;
  attributes: Attribute[];
};

export const DEFAULT_CHARACTER: Character = {
  name: '',
  attributes: [
    {
      label: 'Strength',
      value: 0,
      skills: [
        { label: 'Power', value: 0 },
        { label: 'Fortitude', value: 0 },
        { label: 'Athletics', value: 0 }
      ]
    },
    {
      label: 'Dexterity',
      value: 0,
      skills: [
        { label: 'Precision', value: 0 },
        { label: 'Stealth', value: 0 },
        { label: 'Agility', value: 0 }
      ]
    },
    {
      label: 'Intelligence',
      value: 0,
      skills: [
        { label: 'Comprehension', value: 0 },
        { label: 'Medicine', value: 0 },
        { label: 'Innovation', value: 0 }
      ]
    },
    {
      label: 'Persuasion',
      value: 0,
      skills: [
        { label: 'Intuition', value: 0 },
        { label: 'Speech', value: 0 },
        { label: 'Barter', value: 0 }
      ]
    },
    {
      label: 'Perception',
      value: 0,
      skills: [
        { label: 'Insight', value: 0 },
        { label: 'Detection', value: 0 },
        { label: 'Investigation', value: 0 }
      ]
    }
  ]
};

export type DiceRoll = {
  label: string;
  roll: number[];
};

type EngineState = {
  characters: Character[];
  diceRolls: DiceRoll[];
};

const DEFAULT_ENGINE_STATE: EngineState = {
  characters: [structuredClone(DEFAULT_CHARACTER)],
  diceRolls: []
};

interface ESC extends EngineState {
  update: (engineState: Partial<EngineState>) => void;
}

const EngineStateContext = React.createContext<ESC>({
  ...DEFAULT_ENGINE_STATE,
  update: () => {}
});

export const EngineStateProvider: React.FC<{ children?: ReactNode }> = props => {
  const [engineState, setEngineState] = useLocalStorage('vc-engine', DEFAULT_ENGINE_STATE);

  const engineStateContext: ESC = {
    ...engineState,
    update: partialEngineState => setEngineState({ ...engineState, ...partialEngineState })
  };

  return (
    <EngineStateContext.Provider value={engineStateContext}>
      {props.children}
    </EngineStateContext.Provider>
  );
};

export const useEngineState = () => useContext(EngineStateContext);
