import React, { ReactNode, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { AttributeKey, Character, DEFAULT_CHARACTER } from '@/pages/engine/Character';
import { v4 as uuid } from 'uuid';
import { useStateVersioner } from '@/utils/useStateVersioner';
import { WORLD_KITS } from './WorldKit';
import { parseComputation } from '@/utils/parseComputation';
import { PERKS } from './Perk';
import { capitalize, debounce } from 'lodash-es';
import { useSession } from './useSession';
import { useQueryClient } from 'react-query';
import type { Roll } from './useRolls';

type CharactersState = {
  version: string;
  characters: { [id: string]: Character };
  currentCharacterId?: string;
};

const DEFAULT_CHARACTERS_STATE: CharactersState = {
  version: '12.0',
  characters: {},
  currentCharacterId: undefined
};

interface CSC extends CharactersState {
  update: (
    partialCharactersState: (charactersState: CharactersState) => Partial<CharactersState>
  ) => void;
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
  const { sessionId, userId, webSocket, sessionCharacters } = useSession();

  useStateVersioner(charactersState, setCharactersState, DEFAULT_CHARACTERS_STATE);

  const update = (
    partialCharactersState: (charactersState: CharactersState) => Partial<CharactersState>
  ) => {
    setCharactersState(charactersState => ({
      ...charactersState,
      ...partialCharactersState(charactersState)
    }));
  };

  const characters = { ...charactersState.characters };
  // supplement with session characters
  for (const sessionCharacter of sessionCharacters ?? []) {
    if (!characters[sessionCharacter.id]) {
      characters[sessionCharacter.id] = sessionCharacter;
    }
  }

  let currentCharacterId = charactersState.currentCharacterId;

  // prevent displaying a null character
  if (currentCharacterId && !characters[currentCharacterId]) {
    currentCharacterId = undefined;
  } else if (!currentCharacterId) {
    currentCharacterId = Object.keys(characters)[0];
  }

  const charactersStateContext: CSC = {
    ...charactersState,
    currentCharacterId,
    characters,
    update
  };

  const ownedCurrentCharacter = charactersState.currentCharacterId
    ? charactersState.characters[charactersState.currentCharacterId]
    : undefined;

  const updateSessionCharacter = useMemo(
    () =>
      debounce((webSocket: WebSocket, character: Character) => {
        webSocket.send(
          JSON.stringify({
            action: 'addCharacter',
            sessionId,
            userId,
            character: character
          })
        );
      }, 2000),
    []
  );

  useEffect(() => {
    if (webSocket && ownedCurrentCharacter) {
      updateSessionCharacter(webSocket, ownedCurrentCharacter);
    }
  }, [webSocket, ownedCurrentCharacter]);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (webSocket) {
      webSocket.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        if (message.event === 'CHARACTER_UPDATE') {
          // update GET_SESSION_CHARACTERS cache with updated character
          queryClient.setQueryData(
            'GET_SESSION_CHARACTERS',
            (sessionCharacters: Character[] | undefined) => {
              if (sessionCharacters) {
                const index = sessionCharacters.findIndex(
                  character => character.id === message.data.character.id
                );
                if (index === -1) {
                  sessionCharacters.push(message.data.character);
                } else {
                  sessionCharacters.splice(index, 1, message.data.character);
                }
              }
              return sessionCharacters ? [...sessionCharacters] : [];
            }
          );
        } else if (message.event === 'CHARACTER_REMOVE') {
          // update GET_SESSION_CHARACTERS cache with removed character
          queryClient.setQueryData(
            'GET_SESSION_CHARACTERS',
            (sessionCharacters: Character[] | undefined) =>
              sessionCharacters?.filter(character => character.id !== message.data.characterId) ??
              []
          );
        }
      });
    }
  }, [webSocket]);

  return (
    <CharactersStateContext.Provider value={charactersStateContext}>
      {props.children}
    </CharactersStateContext.Provider>
  );
};

export const useCharacters = () => {
  const charactersState = useContext(CharactersStateContext);
  const { userId, sessionId, webSocket } = useSession();

  const queryClient = useQueryClient();

  const currentCharacter = useCurrentCharacter();
  const setCurrentCharacter = (characterId: string) => {
    charactersState.update(() => ({
      currentCharacterId: characterId
    }));
  };

  const addCharacter = () => {
    // add new default character
    const characterId = uuid();

    charactersState.update(charactersState => {
      const characters = {
        ...charactersState.characters,
        [characterId]: { ...structuredClone(DEFAULT_CHARACTER), id: characterId, userId }
      };

      return { characters, currentCharacterId: characterId };
    });
  };

  const removeCharacter = (characterId: string) => {
    charactersState.update(charactersState => {
      // remove character from characters
      const characters = { ...charactersState.characters };
      delete characters[characterId];

      // update characterId if current character was removed
      let newCharacterId = charactersState.currentCharacterId;
      if (newCharacterId === characterId) {
        newCharacterId = Object.keys(characters)[0];
      }

      return {
        characters,
        currentCharacterId: newCharacterId
      };
    });

    if (webSocket) {
      webSocket.send(
        JSON.stringify({
          action: 'removeCharacter',
          sessionId,
          userId,
          characterId: characterId
        })
      );
      // update GET_SESSION_CHARACTERS cache with removed character
      queryClient.setQueryData(
        'GET_SESSION_CHARACTERS',
        (sessionCharacters: Character[] | undefined) =>
          sessionCharacters?.filter(character => character.id !== characterId) ?? []
      );
      // update GET_SESSION_ROLLS cache with removed character rolls
      queryClient.setQueryData(
        'GET_SESSION_ROLLS',
        (sessionRolls: Roll[] | undefined) =>
          sessionRolls?.filter(roll => roll.characterId !== characterId) ?? []
      );
    }
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

  if (!charactersState.currentCharacterId) {
    return undefined;
  }

  const character = charactersState.characters[charactersState.currentCharacterId];

  const updateCharacter = (partialCharacter: Partial<Character>) => {
    charactersState.update(charactersState => {
      const characters = { ...charactersState.characters };

      if (charactersState.currentCharacterId) {
        const character = charactersState.characters[charactersState.currentCharacterId];
        const newCharacter = { ...character, ...partialCharacter };
        characters[charactersState.currentCharacterId] = newCharacter;
      }

      return { characters };
    });
  };

  const characterClass = character.classKey
    ? {
        ...WORLD_KITS.vale_of_myths.classes[character.classKey],
        classItemBonus: Math.floor(character.level / 6)
      }
    : undefined;

  const classAbilities =
    characterClass?.classAbilities.filter(ability => {
      const isInnate = ability.requirement === 'INNATE';
      const isAcquired = character.classAbilityKeys.includes(ability.key);
      const isAcquiredByClassAbility =
        typeof ability.requirement === 'string' &&
        character.classAbilityKeys.includes(ability.requirement);

      return isInnate || isAcquired || isAcquiredByClassAbility;
    }) ?? [];

  const race = character.raceKey ? WORLD_KITS.vale_of_myths.races[character.raceKey] : undefined;

  const perks = PERKS.filter(perk => character.perkKeys.includes(perk.key));

  if (race) {
    perks.splice(0, 0, race.perk);
  }

  const maxSkillPointCount = 6 + character.level - 1;
  const maxAttributePointCount = 12 + Math.floor(character.level / 4);
  const maxClassAbilityCount = 1 + Math.floor(character.level / 3);
  const maxPerkCount = 1 + Math.floor(character.level / 2);

  const items = character.itemQuantities.map(({ key, quantity }) => {
    const item = WORLD_KITS.vale_of_myths.items[key];
    return {
      key,
      quantity,
      ...item
    };
  });

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

  const getSpeed = () => {
    const baseSpeed = parseComputation(
      characterClass?.computed?.speed ?? '3 + [attribute.dexterity] + [skill.agility]',
      computationVariables
    );

    // check for class ability enhancement
    const classAbilitySpeedComputation = classAbilities.find(ability => ability.computed?.speed)
      ?.computed?.speed;
    if (classAbilitySpeedComputation) {
      return parseComputation(classAbilitySpeedComputation, {
        base: baseSpeed,
        ...computationVariables
      });
    }

    return baseSpeed;
  };

  const getMaxHealthPoints = () => {
    const baseMaxHealthPoints = parseComputation(
      '([level] + [attribute.strength] + [skill.fortitude]) * 6',
      computationVariables
    );

    // check for perk enhancement
    const perkMaxHealthPointsComputation = perks.find(perk => perk.computed?.maxHealthPoints)
      ?.computed?.maxHealthPoints;
    if (perkMaxHealthPointsComputation) {
      return parseComputation(perkMaxHealthPointsComputation, {
        base: baseMaxHealthPoints,
        ...computationVariables
      });
    }

    return baseMaxHealthPoints;
  };

  const getMaxClassPoints = () => {
    if (characterClass?.computed?.maxClassPoints) {
      const baseMaxClassPoints = parseComputation(
        characterClass.computed.maxClassPoints,
        computationVariables
      );

      // check for class ability enhancement
      const classAbilityMaxClassPointsComputation = classAbilities.find(
        ability => ability.computed?.maxClassPoints
      )?.computed?.maxClassPoints;
      if (classAbilityMaxClassPointsComputation) {
        return parseComputation(classAbilityMaxClassPointsComputation, {
          base: baseMaxClassPoints,
          ...computationVariables
        });
      }

      return baseMaxClassPoints;
    }

    return 0;
  };

  const getCarryingCapacity = () => {
    const baseCarryingCapacity = parseComputation(
      '([attribute.strength] + [skill.fortitude]) * 3',
      computationVariables
    );

    // check for perk enhancement
    const perkCarryingCapacityComputation = perks.find(perk => perk.computed?.carryingCapacity)
      ?.computed?.carryingCapacity;
    if (perkCarryingCapacityComputation) {
      return parseComputation(perkCarryingCapacityComputation, {
        base: baseCarryingCapacity,
        ...computationVariables
      });
    }

    return baseCarryingCapacity;
  };

  const getInitiative = () => {
    const baseInitiative = parseComputation(
      characterClass?.computed?.initiative ??
        '[attribute.dexterity] + [skill.agility] + [attribute.perception] + [skill.detection]',
      computationVariables
    );

    // check for perk enhancement
    const perkInitiativeComputation = perks.find(perk => perk.computed?.initiative)?.computed
      ?.initiative;
    if (perkInitiativeComputation) {
      return parseComputation(perkInitiativeComputation, {
        base: baseInitiative,
        ...computationVariables
      });
    }

    return baseInitiative;
  };

  const getLooting = () => {
    return parseComputation('[level] + [skill.luck]', computationVariables);
  };

  const getItemWeight = () => {
    return items.reduce((sum, item) => sum + (item.weight ?? 0) * item.quantity, 0);
  };

  const setName = (name: string) => updateCharacter({ name });
  const setDescription = (description: string) => updateCharacter({ description });
  const setRace = (raceKey?: string) => updateCharacter({ raceKey });
  const setHealthPoints = (healthPoints: number) =>
    updateCharacter({ healthPoints: Math.min(healthPoints, getMaxHealthPoints()) });
  const setClassPoints = (classPoints: number) => updateCharacter({ classPoints });
  const setSatiation = (satiation: number) => updateCharacter({ satiation });
  const setExhaustion = (exhaustion: number) => updateCharacter({ exhaustion });
  const setClassItemDescription = (classItemDescription?: string) =>
    updateCharacter({ classItemDescription });

  const setLevelPoints = (levelPoints: number) => {
    updateCharacter({ levelPoints: levelPoints });
  };
  const addLevel = () => {
    if (character.level < 24) {
      updateCharacter({ level: character.level + 1, levelPoints: 0 });
    }
  };
  const removeLevel = () => {
    if (character.level > 1) {
      updateCharacter({ level: character.level - 1 });
    }
  };

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

    updateCharacter({
      classKey,
      classItemDescription: '',
      attributes,
      classAbilityKeys: []
    });
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

  const addClassAbility = (classAbilityKey: string) =>
    updateCharacter({ classAbilityKeys: [...character.classAbilityKeys, classAbilityKey] });
  const removeClassAbility = (classAbilityKey: string) =>
    updateCharacter({
      classAbilityKeys: character.classAbilityKeys.filter(key => key !== classAbilityKey)
    });

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
    if (quantity === 0 && items.find(item => item.key === itemKey)?.type) {
      removeItem(itemKey);
    } else {
      const itemQuantities = [...character.itemQuantities];
      const item = itemQuantities.find(item => item.key === itemKey);

      if (item) {
        item.quantity = quantity;
        updateCharacter({ itemQuantities });
      }
    }
  };

  return {
    ...character,
    class: characterClass,
    classAbilities,
    perks,
    items,
    itemWeight: getItemWeight(),
    speed: getSpeed(),
    maxHealthPoints: getMaxHealthPoints(),
    maxClassPoints: getMaxClassPoints(),
    carryingCapacity: getCarryingCapacity(),
    initiative: getInitiative(),
    looting: getLooting(),
    maxSkillPointCount,
    maxAttributePointCount,
    maxClassAbilityCount,
    maxPerkCount,
    setName,
    setDescription,
    setRace,
    setHealthPoints,
    setLevelPoints,
    addLevel,
    removeLevel,
    setSatiation,
    setExhaustion,
    setClassPoints,
    setClassItemDescription,
    setClass,
    setAttributeValue,
    setSkillValue,
    addClassAbility,
    removeClassAbility,
    addPerk,
    removePerk,
    addItem,
    removeItem,
    updateItemQuantity
  };
};
