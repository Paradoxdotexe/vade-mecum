import React, { ReactNode, useContext, useMemo } from 'react';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { v4 as uuid } from 'uuid';

const parseVersion = (version: string) =>
  version.split('.').map(v => parseInt(v)) as [number, number];

export type Skill = {
  label: string;
  value: number;
};

export type Attribute = {
  label: string;
  value: number;
  skills: Skill[];
};

export type Class = {
  label: string;
  attribute: string;
  skill: string;
};

export const CLASSES: { [kitKey: string]: Class[] } = {
  vale_of_myths: [
    {
      label: 'Knight',
      attribute: 'Strength',
      skill: 'Honor'
    },
    {
      label: 'Barbarian',
      attribute: 'Strength',
      skill: 'Rage'
    },
    {
      label: 'Monk',
      attribute: 'Dexterity',
      skill: 'Chi'
    },
    {
      label: 'Ranger',
      attribute: 'Dexterity',
      skill: 'Survival'
    },
    {
      label: 'Mage',
      attribute: 'Intelligence',
      skill: 'Magic'
    },
    {
      label: 'Force',
      attribute: 'Intelligence',
      skill: 'Smithing'
    },
    {
      label: 'Herald',
      attribute: 'Charisma',
      skill: 'Enchantment'
    },
    {
      label: 'Enchanter',
      attribute: 'Charisma',
      skill: 'Honor'
    },
    {
      label: 'Sage',
      attribute: 'Perception',
      skill: 'Nature'
    },
    {
      label: 'Druid',
      attribute: 'Perception',
      skill: 'Beast'
    }
  ]
};

export type Character = {
  key: string;
  name: string;
  class?: Class;
  attributes: Attribute[];
};

export const DEFAULT_CHARACTER: Character = {
  key: uuid(),
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
  characterKey: string;
  type: string;
  roll: number[];
};

type EngineState = {
  version: string;
  characters: { [key: string]: Character };
  characterKey: string;
  diceRolls: DiceRoll[];
};

const DEFAULT_ENGINE_STATE: EngineState = {
  version: '2.0',
  characters: { [DEFAULT_CHARACTER.key]: structuredClone(DEFAULT_CHARACTER) },
  characterKey: DEFAULT_CHARACTER.key,
  diceRolls: []
};

interface ESC extends EngineState {
  character: Character;
  update: (partialEngineState: Partial<EngineState>) => void;
  updateCharacter: (partialCharacter: Partial<Character>) => void;
  addCharacter: () => void;
  removeCharacter: () => void;
}

const EngineStateContext = React.createContext<ESC>({
  ...DEFAULT_ENGINE_STATE,
  character: DEFAULT_ENGINE_STATE.characters[0],
  update: () => {},
  updateCharacter: () => {},
  addCharacter: () => {},
  removeCharacter: () => {}
});

export const EngineStateProvider: React.FC<{ children?: ReactNode }> = props => {
  const [engineState, setEngineState] = useLocalStorage('vc-engine', DEFAULT_ENGINE_STATE);

  const character = engineState.characters[engineState.characterKey];

  useMemo(() => {
    // ensure engineState in LocalStorage is up to date
    if (!engineState.version) {
      console.warn('Resetting engine state due to missing version.');
      setEngineState({ ...DEFAULT_ENGINE_STATE });
    } else {
      const [majorVersion, minorVersion] = parseVersion(engineState.version);
      const [currentMajorVersion, currentMinorVersion] = parseVersion(DEFAULT_ENGINE_STATE.version);

      if (currentMajorVersion > majorVersion) {
        console.warn('Resetting engine state due to major version update.');
        setEngineState({ ...DEFAULT_ENGINE_STATE });
      } else if (currentMinorVersion > minorVersion) {
        console.warn('Updating engine state due to minor version update.');
        setEngineState({
          ...DEFAULT_ENGINE_STATE,
          ...engineState,
          version: DEFAULT_ENGINE_STATE.version
        });
      }
    }
  }, [engineState]);

  const update = (partialEngineState: Partial<EngineState>) =>
    setEngineState({ ...engineState, ...partialEngineState });

  const updateCharacter = (partialCharacter: Partial<Character>) => {
    const newCharacter = { ...character, ...partialCharacter };
    const characters = { ...engineState.characters };
    characters[engineState.characterKey] = newCharacter;
    update({ characters });
  };

  const addCharacter = () => {
    // add new default character
    const key = uuid();
    const characters = {
      ...engineState.characters,
      [key]: { ...structuredClone(DEFAULT_CHARACTER), key }
    };

    update({ characters, characterKey: key });
  };

  const removeCharacter = () => {
    // remove current character from characters
    const characters = { ...engineState.characters };
    delete characters[engineState.characterKey];

    // remove character's dice rolls
    const diceRolls = engineState.diceRolls.filter(
      diceRoll => diceRoll.characterKey !== engineState.characterKey
    );

    update({
      characters,
      characterKey: Object.keys(characters)[0],
      diceRolls
    });
  };

  const engineStateContext: ESC = {
    ...engineState,
    character,
    update,
    updateCharacter,
    addCharacter,
    removeCharacter
  };

  return (
    <EngineStateContext.Provider value={engineStateContext}>
      {props.children}
    </EngineStateContext.Provider>
  );
};

export const useEngineState = () => useContext(EngineStateContext);
