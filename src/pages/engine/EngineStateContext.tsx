import React, { ReactNode, useContext, useMemo } from 'react';
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
  version: number;
  characters: Character[];
  characterIndex: number;
  diceRolls: DiceRoll[];
};

const DEFAULT_ENGINE_STATE: EngineState = {
  version: 0,
  characters: [structuredClone(DEFAULT_CHARACTER)],
  characterIndex: 0,
  diceRolls: []
};

interface ESC extends EngineState {
  character: Character;
  update: (partialEngineState: Partial<EngineState>) => void;
  updateCharacter: (partialCharacter: Partial<Character>) => void;
}

const EngineStateContext = React.createContext<ESC>({
  ...DEFAULT_ENGINE_STATE,
  character: DEFAULT_ENGINE_STATE.characters[0],
  update: () => {},
  updateCharacter: () => {}
});

export const EngineStateProvider: React.FC<{ children?: ReactNode }> = props => {
  const [engineState, setEngineState] = useLocalStorage('vc-engine', DEFAULT_ENGINE_STATE);

  const character = engineState.characters[engineState.characterIndex];

  useMemo(() => {
    // ensure engineState in LocalStorage is up to date
    if (engineState.version === undefined || DEFAULT_ENGINE_STATE.version > engineState.version) {
      setEngineState({ ...DEFAULT_ENGINE_STATE, ...engineState });
    }
  }, [engineState]);

  const update = (partialEngineState: Partial<EngineState>) =>
    setEngineState({ ...engineState, ...partialEngineState });

  const updateCharacter = (partialCharacter: Partial<Character>) => {
    const newCharacter = { ...character, ...partialCharacter };
    const characters = [...engineState.characters];
    characters[engineState.characterIndex] = newCharacter;
    update({ characters });
  };

  const engineStateContext: ESC = {
    ...engineState,
    character,
    update,
    updateCharacter
  };

  return (
    <EngineStateContext.Provider value={engineStateContext}>
      {props.children}
    </EngineStateContext.Provider>
  );
};

export const useEngineState = () => useContext(EngineStateContext);
