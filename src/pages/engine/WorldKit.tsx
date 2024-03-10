import { AttributeKey } from './Character';

type WorldKit = {
  label: string;
  races: string[];
  classes: { [key: string]: CharacterClass };
};

type CharacterClass = {
  label: string;
  attributeKey: AttributeKey;
  skillKey: string;
  classItemLabel: string;
  computed?: {
    speed?: string;
    maxHitPoints?: string;
    maxClassPoints?: string;
  };
};

const VALE_OF_MYTHS: WorldKit = {
  label: 'Vale of Myths',
  races: ['Human', 'Dwarf', 'Elf', 'Fay', 'Halfling'],
  classes: {
    knight: {
      label: 'Knight',
      attributeKey: 'strength',
      skillKey: 'honor',
      classItemLabel: 'Honorific Banner'
    },
    barbarian: {
      label: 'Barbarian',
      attributeKey: 'strength',
      skillKey: 'rage',
      classItemLabel: 'Tribal Marking'
    },
    monk: {
      label: 'Monk',
      attributeKey: 'dexterity',
      skillKey: 'chi',
      classItemLabel: 'Spiritual Talisman',
      computed: {
        maxClassPoints: '3 + [classItemBonus] * 3'
      }
    },
    ranger: {
      label: 'Ranger',
      attributeKey: 'dexterity',
      skillKey: 'survival',
      classItemLabel: 'Survival Toolkit',
      computed: {
        speed: '3 + [attribute.dexterity] + [skill.agility] + [skill.survival]'
      }
    },
    mage: {
      label: 'Mage',
      attributeKey: 'intelligence',
      skillKey: 'magic',
      classItemLabel: 'Magical Channel',
      computed: {
        maxClassPoints: '[level]'
      }
    },
    forge: {
      label: 'Forge',
      attributeKey: 'intelligence',
      skillKey: 'smithing',
      classItemLabel: 'Smithing Hammer',
      computed: {
        maxClassPoints: '3 + [classItemBonus] * 3'
      }
    },
    herald: {
      label: 'Herald',
      attributeKey: 'charisma',
      skillKey: 'influence',
      classItemLabel: 'Beacon of Influence',
      computed: {
        maxClassPoints: '[level]'
      }
    },
    enchanter: {
      label: 'Enchanter',
      attributeKey: 'charisma',
      skillKey: 'enchantment',
      classItemLabel: 'Enchantment Charm'
    },
    sage: {
      label: 'Sage',
      attributeKey: 'perception',
      skillKey: 'nature',
      classItemLabel: 'Ritual Totem',
      computed: {
        maxClassPoints: '[level]'
      }
    },
    druid: {
      label: 'Druid',
      attributeKey: 'perception',
      skillKey: 'beast',
      classItemLabel: 'Tamed Beast',
      computed: {
        maxClassPoints: '[classItemBonus] + 1'
      }
    }
  }
};

export const WORLD_KITS = {
  vale_of_myths: VALE_OF_MYTHS
};
