import { capitalize, keyBy } from 'lodash-es';
import { Character } from '../../types/Character';
import { CharacterComputations, WORLD_KIT } from '../../types/WorldKit';
import { parseComputation } from '@/utils/parseComputation';
import { PERKS } from '../../types/Perk';

const raceByKey = keyBy(WORLD_KIT.races, 'key');
const classByKey = keyBy(WORLD_KIT.classes, 'key');
const perkByKey = keyBy(PERKS, 'key');

const getClassItemBonus = (character: Character) => Math.floor(character.level / 6);

const getPerks = (character: Character) => {
  const perks = character.perkKeys.map(key => perkByKey[key]);

  if (character.raceKey) {
    const race = raceByKey[character.raceKey];
    perks.splice(0, 0, race.perk);
  }

  return perks;
};

const getClassAbilities = (character: Character) => {
  const _class = classByKey[character.classKey];

  return _class.classAbilities.filter(ability => {
    const isInnate = ability.requirement === 'INNATE';
    const isAcquired = character.classAbilityKeys.includes(ability.key);
    const isAcquiredByClassAbility =
      typeof ability.requirement === 'string' &&
      character.classAbilityKeys.includes(ability.requirement);

    return isInnate || isAcquired || isAcquiredByClassAbility;
  });
};

const useCharacterComputation = (
  character: Character,
  computationKey: keyof CharacterComputations,
  defaultComputation?: string
) => {
  // compile variables available to computation
  const computationVariables: { [key: string]: number } = {
    level: character.level,
    classItemBonus: getClassItemBonus(character)
  };
  for (const [attributeKey, attribute] of Object.entries(character.attributes)) {
    computationVariables[`attribute.${attributeKey}`] = attribute.value;

    for (const [skillKey, skill] of Object.entries(attribute.skills)) {
      computationVariables[`skill.${skillKey}`] = skill.value;
    }
  }

  // parse base computation
  const _class = classByKey[character.classKey];
  const classComputation = _class.computed?.[computationKey];
  const baseComputation = classComputation ?? defaultComputation;

  if (!baseComputation) {
    return 0;
  }

  const baseValue = parseComputation(baseComputation, computationVariables);
  computationVariables.base = baseValue;

  // parse perk computation if applicable
  const perks = getPerks(character);
  for (const perk of perks) {
    const perkComputation = perk.computed?.[computationKey];
    if (perkComputation) {
      return parseComputation(perkComputation, computationVariables);
    }
  }

  // parse class ability computation if applicable
  const classAbilities = getClassAbilities(character);
  for (const classAbility of classAbilities) {
    const classAbilityComputation = classAbility.computed?.[computationKey];
    if (classAbilityComputation) {
      return parseComputation(classAbilityComputation, computationVariables);
    }
  }

  return baseValue;
};

export const useCharacterClient = (
  value: Character | undefined,
  onChange: (character: Character) => void
) => {
  if (!value) {
    return undefined;
  }

  const character = value;

  const updateCharacter = (partialCharacter: Partial<Character>) => {
    onChange({ ...character, ...partialCharacter });
  };

  // ---------- NAME ----------- //
  const name = character.name;
  const setName = (name: string) => updateCharacter({ name });

  // ---------- RACE ----------- //
  const race = raceByKey[character.raceKey];
  const setRace = (raceKey?: string) => updateCharacter({ raceKey });

  // ---------- CLASS ----------- //
  const _class = {
    ...classByKey[character.classKey],
    classItemBonus: getClassItemBonus(character)
  };

  const setClass = (classKey?: string) => {
    const attributes = structuredClone(character.attributes);

    // delete old class skill
    if (_class) {
      delete attributes[_class.attributeKey].skills[_class.skillKey];
    }

    // add new class skill
    if (classKey) {
      const newClass = classByKey[classKey];
      attributes[newClass.attributeKey].skills[newClass.skillKey] = {
        label: capitalize(newClass.skillKey),
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

  // ---------- HEALTH POINTS ----------- //
  const maxHealthPoints = useCharacterComputation(
    character,
    'maxHealthPoints',
    '([level] + [attribute.strength] + [skill.fortitude]) * 6'
  );

  const healthPoints = character.healthPoints;
  const setHealthPoints = (healthPoints: number) =>
    updateCharacter({ healthPoints: Math.min(healthPoints, maxHealthPoints) });

  // ---------- SPEED ----------- //
  const speed = useCharacterComputation(
    character,
    'speed',
    '3 + [attribute.dexterity] + [skill.agility]'
  );

  // ---------- CLASS POINTS ----------- //
  const maxClassPoints = useCharacterComputation(character, 'maxClassPoints');

  const classPoints = character.classPoints;
  const setClassPoints = (classPoints: number) =>
    updateCharacter({ classPoints: Math.min(classPoints, maxHealthPoints) });

  // ---------- LEVEL ----------- //
  const level = character.level;
  const levelUp = () => {
    if (character.level < 24) {
      updateCharacter({ level: character.level + 1, levelPoints: 0 });
    }
  };

  const levelPoints = character.levelPoints;
  const setLevelPoints = (levelPoints: number) => {
    updateCharacter({ levelPoints: Math.min(Math.max(levelPoints, 0), 6) });
  };

  // const maxSkillPointCount = 6 + character.level - 1;
  // const maxAttributePointCount = 12 + Math.floor(character.level / 4);
  // const maxClassAbilityCount = 1 + Math.floor(character.level / 3);
  // const maxPerkCount = 1 + Math.floor(character.level / 2);

  // const items = character.itemQuantities.map(({ key, quantity }) => {
  //   const item = WORLD_KITS.vale_of_myths.items[key];
  //   return {
  //     key,
  //     quantity,
  //     ...item
  //   };
  // });

  // const getCarryingCapacity = () => {
  //   const baseCarryingCapacity = parseComputation(
  //     '([attribute.strength] + [skill.fortitude]) * 3',
  //     computationVariables
  //   );

  //   // check for perk enhancement
  //   const perkCarryingCapacityComputation = perks.find(perk => perk.computed?.carryingCapacity)
  //     ?.computed?.carryingCapacity;
  //   if (perkCarryingCapacityComputation) {
  //     return parseComputation(perkCarryingCapacityComputation, {
  //       base: baseCarryingCapacity,
  //       ...computationVariables
  //     });
  //   }

  //   return baseCarryingCapacity;
  // };

  // const getInitiative = () => {
  //   const baseInitiative = parseComputation(
  //     characterClass?.computed?.initiative ??
  //       '[attribute.dexterity] + [skill.agility] + [attribute.perception] + [skill.detection]',
  //     computationVariables
  //   );

  //   // check for perk enhancement
  //   const perkInitiativeComputation = perks.find(perk => perk.computed?.initiative)?.computed
  //     ?.initiative;
  //   if (perkInitiativeComputation) {
  //     return parseComputation(perkInitiativeComputation, {
  //       base: baseInitiative,
  //       ...computationVariables
  //     });
  //   }

  //   return baseInitiative;
  // };

  // const getLooting = () => {
  //   return parseComputation('[level] + [skill.luck]', computationVariables);
  // };

  // const getItemWeight = () => {
  //   return items.reduce((sum, item) => sum + (item.weight ?? 0) * item.quantity, 0);
  // };

  // const setDescription = (description: string) => updateCharacter({ description });
  // const setHealthPoints = (healthPoints: number) =>
  //   updateCharacter({ healthPoints: Math.min(healthPoints, getMaxHealthPoints()) });
  // const setSatiation = (satiation: number) => updateCharacter({ satiation });
  // const setExhaustion = (exhaustion: number) => updateCharacter({ exhaustion });
  // const setClassItemDescription = (classItemDescription?: string) =>
  //   updateCharacter({ classItemDescription });

  // const setAttributeValue = (attributeKey: AttributeKey, value: number) => {
  //   const attributes = structuredClone(character.attributes);
  //   attributes[attributeKey].value = value;
  //   updateCharacter({ attributes });
  // };

  // const setSkillValue = (attributeKey: AttributeKey, skillKey: string, value: number) => {
  //   const attributes = structuredClone(character.attributes);
  //   attributes[attributeKey].skills[skillKey].value = value;
  //   updateCharacter({ attributes });
  // };

  // const addClassAbility = (classAbilityKey: string) =>
  //   updateCharacter({ classAbilityKeys: [...character.classAbilityKeys, classAbilityKey] });
  // const removeClassAbility = (classAbilityKey: string) =>
  //   updateCharacter({
  //     classAbilityKeys: character.classAbilityKeys.filter(key => key !== classAbilityKey)
  //   });

  // const addPerk = (perkKey: string) =>
  //   updateCharacter({ perkKeys: [...character.perkKeys, perkKey] });
  // const removePerk = (perkKey: string) =>
  //   updateCharacter({ perkKeys: character.perkKeys.filter(key => key !== perkKey) });

  // const addItem = (itemKey: string) =>
  //   updateCharacter({
  //     itemQuantities: [...character.itemQuantities, { key: itemKey, quantity: 1 }]
  //   });
  // const removeItem = (itemKey: string) =>
  //   updateCharacter({
  //     itemQuantities: character.itemQuantities.filter(item => item.key !== itemKey)
  //   });
  // const updateItemQuantity = (itemKey: string, quantity: number) => {
  //   if (quantity === 0 && items.find(item => item.key === itemKey)?.type) {
  //     removeItem(itemKey);
  //   } else {
  //     const itemQuantities = [...character.itemQuantities];
  //     const item = itemQuantities.find(item => item.key === itemKey);

  //     if (item) {
  //       item.quantity = quantity;
  //       updateCharacter({ itemQuantities });
  //     }
  //   }
  // };

  return {
    id: character.id,
    name,
    setName,
    race,
    setRace,
    class: _class,
    setClass,
    maxHealthPoints,
    healthPoints,
    setHealthPoints,
    speed,
    maxClassPoints,
    classPoints,
    setClassPoints,
    level,
    levelUp,
    levelPoints,
    setLevelPoints
    // classAbilities,
    // perks,
    // items,
    // itemWeight: getItemWeight(),
    // carryingCapacity: getCarryingCapacity(),
    // initiative: getInitiative(),
    // looting: getLooting(),
    // maxSkillPointCount,
    // maxAttributePointCount,
    // maxClassAbilityCount,
    // maxPerkCount,
    // setDescription,
    // setSatiation,
    // setExhaustion,
    // setClassItemDescription,
    // setAttributeValue,
    // setSkillValue,
    // addClassAbility,
    // removeClassAbility,
    // addPerk,
    // removePerk,
    // addItem,
    // removeItem,
    // updateItemQuantity
  };
};

export type CharacterClient = NonNullable<ReturnType<typeof useCharacterClient>>;
