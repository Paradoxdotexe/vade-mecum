import React, { ReactNode, useContext } from 'react';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { AttributeKey, CLASSES, Character, DEFAULT_CHARACTER } from '@/types/Character';
import { capitalize } from '@/utils/capitalize';
import { v4 as uuid } from 'uuid';
import { useStateVersioner } from '@/utils/useStateVersioner';

type CharactersState = {
  version: string;
  characters: { [key: string]: Character };
  currentCharacterKey: string;
};

const DEFAULT_CHARACTERS_STATE: CharactersState = {
  version: '1.0',
  characters: { [DEFAULT_CHARACTER.key]: structuredClone(DEFAULT_CHARACTER) },
  currentCharacterKey: DEFAULT_CHARACTER.key
};

interface CSC extends CharactersState {
  update: (partialCharactersState: Partial<CharactersState>) => void;
}

const CharactersStateContext = React.createContext<CSC>({
  ...structuredClone(DEFAULT_CHARACTERS_STATE),
  update: () => {}
});

export const CharactersStateProvider: React.FC<{ children?: ReactNode }> = props => {
  const [charactersState, setCharactersState] = useLocalStorage(
    'vc:engine:characters',
    structuredClone(DEFAULT_CHARACTERS_STATE)
  );

  useStateVersioner(charactersState, setCharactersState, DEFAULT_CHARACTERS_STATE);

  const update = (partialCharactersState: Partial<CharactersState>) => {
    setCharactersState(charactersState => ({ ...charactersState, ...partialCharactersState }));
  };

  const charactersStateContext: CSC = {
    ...charactersState,
    update
  };

  return (
    <CharactersStateContext.Provider value={charactersStateContext}>
      {props.children}
    </CharactersStateContext.Provider>
  );
};

export const useCharacters = () => {
  const charactersState = useContext(CharactersStateContext);

  const currentCharacter = useCurrentCharacter();
  const setCurrentCharacter = (characterKey: string) => {
    charactersState.update({ currentCharacterKey: characterKey });
  };

  const addCharacter = () => {
    // add new default character
    const characterKey = uuid();
    const characters = {
      ...charactersState.characters,
      [characterKey]: { ...structuredClone(DEFAULT_CHARACTER), key: characterKey }
    };

    charactersState.update({ characters, currentCharacterKey: characterKey });
  };

  const removeCharacter = (characterKey: string) => {
    // remove character from characters
    const characters = { ...charactersState.characters };
    delete characters[characterKey];

    // update characterKey if current character was removed
    let newCharacterKey = currentCharacter.key;
    if (characterKey === currentCharacter.key) {
      newCharacterKey = Object.keys(characters)[0];
    }

    charactersState.update({
      characters,
      currentCharacterKey: newCharacterKey
    });
  };

  return {
    characters: charactersState.characters,
    currentCharacter,
    setCurrentCharacter,
    addCharacter,
    removeCharacter
  };
};

const useCurrentCharacter = () => {
  const charactersState = useContext(CharactersStateContext);

  const character = charactersState.characters[charactersState.currentCharacterKey];

  const updateCharacter = (partialCharacter: Partial<Character>) => {
    const newCharacter = { ...character, ...partialCharacter };
    const characters = { ...charactersState.characters };
    characters[charactersState.currentCharacterKey] = newCharacter;
    charactersState.update({ characters });
  };

  const getSpeed = () => {
    let speed =
      3 +
      character.attributes.dexterity.value +
      character.attributes.dexterity.skills.agility.value;

    // a ranger adds their class skill to their speed
    if (character.classKey === 'ranger') {
      const { attributeKey, skillKey } = CLASSES[character.classKey];
      speed += character.attributes[attributeKey].skills[skillKey].value;
    }

    return speed;
  };

  const getMaxHitPoints = () => {
    return (
      (character.level +
        character.attributes.strength.value +
        character.attributes.strength.skills.fortitude.value) *
      6
    );
  };

  const classItemBonus = Math.floor(character.level / 6);

  const getMaxClassPoints = () => {
    if (character.classKey) {
      if (['mage', 'herald', 'sage'].includes(character.classKey)) {
        return character.level;
      } else if (['monk', 'forge'].includes(character.classKey)) {
        return 3 + classItemBonus * 3;
      } else if (['druid'].includes(character.classKey)) {
        return classItemBonus + 1;
      }
    }

    return 0;
  };

  const setName = (name: string) => updateCharacter({ name });
  const setDescription = (description: string) => updateCharacter({ description });
  const setRace = (race?: string) => updateCharacter({ race });
  const setLevel = (level: number) => updateCharacter({ level });
  const setHitPoints = (hitPoints: number) => updateCharacter({ hitPoints });
  const setClassPoints = (classPoints: number) => updateCharacter({ classPoints });

  const setClass = (classKey?: string) => {
    const attributes = structuredClone(character.attributes);

    // delete current class skill
    if (character.classKey) {
      const { attributeKey, skillKey } = CLASSES[character.classKey];
      delete attributes[attributeKey].skills[skillKey];
    }

    // add new class skill
    if (classKey) {
      const { attributeKey, skillKey } = CLASSES[classKey];
      attributes[attributeKey].skills[skillKey] = {
        label: capitalize(skillKey),
        value: 0
      };
    }

    updateCharacter({ classKey, attributes });
  };

  const setAttributeValue = (attributeKey: AttributeKey, value: number) => {
    const attributes = structuredClone(character.attributes);
    attributes[attributeKey].value = value;
    updateCharacter({ attributes });
  };

  const setSkillValue = (attributeKey: AttributeKey, skillKey: string, value: number) => {
    const attributes = structuredClone(character.attributes);
    attributes[attributeKey].skills[skillKey].value = value;
    updateCharacter({ attributes });
  };

  return {
    ...character,
    classLabel: character.classKey && capitalize(character.classKey),
    speed: getSpeed(),
    maxHitPoints: getMaxHitPoints(),
    maxClassPoints: getMaxClassPoints(),
    setName,
    setDescription,
    setRace,
    setLevel,
    setHitPoints,
    setClassPoints,
    setClass,
    setAttributeValue,
    setSkillValue
  };
};
