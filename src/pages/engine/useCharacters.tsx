import React, { ReactNode, useContext, useMemo } from 'react';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { AttributeKey, Character, DEFAULT_CHARACTER } from '@/pages/engine/Character';
import { capitalize } from '@/utils/capitalize';
import { v4 as uuid } from 'uuid';
import { useStateVersioner } from '@/utils/useStateVersioner';
import { WORLD_KITS } from './WorldKit';
import { parseComputation } from '@/utils/parseComputation';
import { PERKS } from './Perk';

type CharactersState = {
  version: string;
  characters: { [key: string]: Character };
  currentCharacterKey: string;
};

const DEFAULT_CHARACTERS_STATE: CharactersState = {
  version: '3.0',
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

  const characterClass = character.classKey
    ? {
        ...WORLD_KITS.vale_of_myths.classes[character.classKey],
        classItemBonus: Math.floor(character.level / 6)
      }
    : undefined;

  const perks = PERKS.filter(perk => character.perkKeys.includes(perk.key));

  const items = character.itemQuantities.map(item => ({
    ...item,
    ...WORLD_KITS.vale_of_myths.items[item.key]
  }));

  const computationVariables = useMemo(() => {
    const computationVariables: { [key: string]: number } = {
      level: character.level
    };

    if (characterClass) {
      computationVariables.classItemBonus = characterClass.classItemBonus;
    }

    for (const [attributeKey, attribute] of Object.entries(character.attributes)) {
      computationVariables[`attribute.${attributeKey}`] = attribute.value;

      for (const [skillKey, skill] of Object.entries(attribute.skills)) {
        computationVariables[`skill.${skillKey}`] = skill.value;
      }
    }

    return computationVariables;
  }, [character]);

  const getSpeed = () => {
    return parseComputation(
      characterClass?.computed?.speed ?? '3 + [attribute.dexterity] + [skill.agility]',
      computationVariables
    );
  };

  const getMaxHitPoints = () => {
    return parseComputation(
      characterClass?.computed?.maxHitPoints ??
        '([level] + [attribute.strength] + [skill.fortitude]) * 6',
      computationVariables
    );
  };

  const getMaxClassPoints = () => {
    if (characterClass?.computed?.maxClassPoints) {
      return parseComputation(characterClass.computed.maxClassPoints, computationVariables);
    }

    return 0;
  };

  const setName = (name: string) => updateCharacter({ name });
  const setDescription = (description: string) => updateCharacter({ description });
  const setRace = (race?: string) => updateCharacter({ race });
  const setLevel = (level: number) => updateCharacter({ level });
  const setHitPoints = (hitPoints: number) => updateCharacter({ hitPoints });
  const setClassPoints = (classPoints: number) => updateCharacter({ classPoints });
  const setClassItemDescription = (classItemDescription?: string) =>
    updateCharacter({ classItemDescription });

  const setClass = (classKey?: string) => {
    const attributes = structuredClone(character.attributes);

    // delete current class skill
    if (character.classKey) {
      const { attributeKey, skillKey } = WORLD_KITS.vale_of_myths.classes[character.classKey];
      delete attributes[attributeKey].skills[skillKey];
    }

    // add new class skill
    if (classKey) {
      const { attributeKey, skillKey } = WORLD_KITS.vale_of_myths.classes[classKey];
      attributes[attributeKey].skills[skillKey] = {
        label: capitalize(skillKey),
        value: 0
      };
    }

    updateCharacter({ classKey, classItemDescription: '', attributes });
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

  const addPerk = (perkKey: string) =>
    updateCharacter({ perkKeys: [...character.perkKeys, perkKey] });
  const removePerk = (perkKey: string) =>
    updateCharacter({ perkKeys: character.perkKeys.filter(key => key !== perkKey) });

  const addItem = (itemKey: string) =>
    updateCharacter({
      itemQuantities: [...character.itemQuantities, { key: itemKey, quantity: 1 }]
    });
  const removeItem = (itemKey: string) =>
    updateCharacter({
      itemQuantities: character.itemQuantities.filter(item => item.key !== itemKey)
    });
  const updateItemQuantity = (itemKey: string, quantity: number) => {
    const itemQuantities = [...character.itemQuantities];
    const item = itemQuantities.find(item => item.key === itemKey);
    if (item) {
      item.quantity = quantity;
      updateCharacter({ itemQuantities });
    }
  };

  return {
    ...character,
    class: characterClass,
    perks,
    items,
    speed: getSpeed(),
    maxHitPoints: getMaxHitPoints(),
    maxClassPoints: getMaxClassPoints(),
    setName,
    setDescription,
    setRace,
    setLevel,
    setHitPoints,
    setClassPoints,
    setClassItemDescription,
    setClass,
    setAttributeValue,
    setSkillValue,
    addPerk,
    removePerk,
    addItem,
    removeItem,
    updateItemQuantity
  };
};
