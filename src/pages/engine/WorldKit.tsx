import { AttributeKey } from './Character';

type CharacterClass = {
  label: string;
  attributeKey: AttributeKey;
  skillKey: string;
  classItemLabel: string;
  classAbilities: ClassAbility[];
  computed?: {
    speed?: string;
    maxHitPoints?: string;
    maxClassPoints?: string;
  };
};

enum ClassAbilityType {
  PASSIVE = 'PASSIVE',
  MAIN_ACTION = 'MAIN_ACTION',
  BONUS_ACTION = 'BONUS_ACTION',
  REACTION = 'REACTION',
  REST_ACTIVITY = 'REST_ACTIVITY'
}

type ClassAbility = {
  key: string;
  type: ClassAbilityType;
  name: string;
  description: string;
  levelRequirement: number;
};

export type InventoryItemType = 'WEAPON' | 'ARMOR' | 'TOOL';

type InventoryItem = {
  type?: InventoryItemType;
  name: string;
  description: string;
  cost: number;
  weight: number;
};

type WorldKit = {
  label: string;
  races: string[];
  classes: { [key: string]: CharacterClass };
  items: { [key: string]: InventoryItem };
};

const VALE_OF_MYTHS: WorldKit = {
  label: 'Vale of Myths',
  races: ['Human', 'Dwarf', 'Elf', 'Fay', 'Halfling'],
  classes: {
    knight: {
      label: 'Knight',
      attributeKey: 'strength',
      skillKey: 'honor',
      classItemLabel: 'Honorific Banner',
      classAbilities: [
        {
          key: 'battle_knowledge',
          name: 'Battle Knowledge',
          type: ClassAbilityType.PASSIVE,
          description:
            'You can make Insight and Intuition checks using Honor instead when gauging an upcoming battle.',
          levelRequirement: 1
        }
      ]
    },
    barbarian: {
      label: 'Barbarian',
      attributeKey: 'strength',
      skillKey: 'rage',
      classItemLabel: 'Tribal Marking',
      classAbilities: []
    },
    monk: {
      label: 'Monk',
      attributeKey: 'dexterity',
      skillKey: 'chi',
      classItemLabel: 'Spiritual Talisman',
      classAbilities: [],
      computed: {
        maxClassPoints: '3 + [classItemBonus] * 3'
      }
    },
    ranger: {
      label: 'Ranger',
      attributeKey: 'dexterity',
      skillKey: 'survival',
      classItemLabel: 'Survival Toolkit',
      classAbilities: [],
      computed: {
        speed: '3 + [attribute.dexterity] + [skill.agility] + [skill.survival]'
      }
    },
    mage: {
      label: 'Mage',
      attributeKey: 'intelligence',
      skillKey: 'magic',
      classItemLabel: 'Magical Channel',
      classAbilities: [],
      computed: {
        maxClassPoints: '[level]'
      }
    },
    forge: {
      label: 'Forge',
      attributeKey: 'intelligence',
      skillKey: 'smithing',
      classItemLabel: 'Smithing Hammer',
      classAbilities: [],
      computed: {
        maxClassPoints: '3 + [classItemBonus] * 3'
      }
    },
    herald: {
      label: 'Herald',
      attributeKey: 'charisma',
      skillKey: 'influence',
      classItemLabel: 'Beacon of Influence',
      classAbilities: [],
      computed: {
        maxClassPoints: '[level]'
      }
    },
    enchanter: {
      label: 'Enchanter',
      attributeKey: 'charisma',
      skillKey: 'enchantment',
      classItemLabel: 'Enchantment Charm',
      classAbilities: []
    },
    sage: {
      label: 'Sage',
      attributeKey: 'perception',
      skillKey: 'nature',
      classItemLabel: 'Ritual Totem',
      classAbilities: [],
      computed: {
        maxClassPoints: '[level]'
      }
    },
    druid: {
      label: 'Druid',
      attributeKey: 'perception',
      skillKey: 'beast',
      classItemLabel: 'Tamed Beast',
      classAbilities: [],
      computed: {
        maxClassPoints: '[classItemBonus] + 1'
      }
    }
  },
  items: {
    currency: {
      name: 'Valerian Pieces',
      description: '',
      cost: 1,
      weight: 1 / 20
    },
    dagger: {
      type: 'WEAPON',
      name: 'Dagger',
      description: '+1 Power to attack, 1d6 damage, 5ft range',
      cost: 5,
      weight: 1 / 2
    },
    shortsword: {
      type: 'WEAPON',
      name: 'Shortsword',
      description: '+1 Power to attack, 2d6 damage, 5ft range',
      cost: 20,
      weight: 1
    },
    longsword: {
      type: 'WEAPON',
      name: 'Longsword',
      description: '+2 Power to attack, 3d6 damage, 5ft range',
      cost: 100,
      weight: 2
    },
    greatsword: {
      type: 'WEAPON',
      name: 'Greatsword',
      description: '+3 Power to attack, 4d6 damage, 5ft range',
      cost: 200,
      weight: 2
    },
    shortbow: {
      type: 'WEAPON',
      name: 'Shortbow',
      description: '+1 Precision to attack, 1d6 damage, 40ft range',
      cost: 20,
      weight: 2
    },
    crossbow: {
      type: 'WEAPON',
      name: 'Crossbow',
      description: '+2 Precision to attack, 2d6 damage, 40ft range',
      cost: 100,
      weight: 2
    },
    longbow: {
      type: 'WEAPON',
      name: 'Longbow',
      description: '+3 Precision to attack, 3d6 damage, 80ft range',
      cost: 200,
      weight: 2
    },
    leather_armor: {
      type: 'ARMOR',
      name: 'Leather Armor',
      description: 'Light armor',
      cost: 20,
      weight: 0
    },
    chainmail_armor: {
      type: 'ARMOR',
      name: 'Chainmail Armor',
      description: 'Medium armor',
      cost: 100,
      weight: 0
    },
    plate_armor: {
      type: 'ARMOR',
      name: 'Plate Armor',
      description: 'Heavy armor',
      cost: 200,
      weight: 0
    },
    rope: {
      type: 'TOOL',
      name: 'Rope',
      description: '+1 Athletics to climb',
      cost: 5,
      weight: 1
    },
    grappling_hook: {
      type: 'TOOL',
      name: 'Grappling Hook',
      description: '+1 Athletics to climb',
      cost: 5,
      weight: 1 / 2
    },
    lantern: {
      type: 'TOOL',
      name: 'Lantern',
      description: '+1 Investigation/Detection to search',
      cost: 5,
      weight: 1 / 2
    },
    medical_pouch: {
      type: 'TOOL',
      name: 'Medical Pouch',
      description: '+1 Medicine to heal or stabilize',
      cost: 20,
      weight: 1 / 2
    },
    tool_belt: {
      type: 'TOOL',
      name: 'Tool Belt',
      description: '+1 Innovation to repair or craft',
      cost: 20,
      weight: 1
    },
    world_map: {
      type: 'TOOL',
      name: 'World Map',
      description: '+1 Insight to interpret a location or path',
      cost: 5,
      weight: 1 / 4
    }
  }
};

export const WORLD_KITS = {
  vale_of_myths: VALE_OF_MYTHS
};
