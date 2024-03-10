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
  speed?: string;
  maxHitPoints?: string;
  maxClassPoints?: string;
};

const VALE_OF_MYTHS: WorldKit = {
  label: 'Vale of Myths',
  races: ['Human', 'Dwarf', 'Elf', 'Fay', 'Halfling'],
  classes: {
    knight: {
      label: 'Knight',
      attributeKey: 'strength',
      skillKey: 'honor'
    },
    barbarian: {
      label: 'Barbarian',
      attributeKey: 'strength',
      skillKey: 'rage'
    },
    monk: {
      label: 'Monk',
      attributeKey: 'dexterity',
      skillKey: 'chi',
      maxClassPoints: '3 + [classItemBonus] * 3'
    },
    ranger: {
      label: 'Ranger',
      attributeKey: 'dexterity',
      skillKey: 'survival',
      speed: '3 + [attribute.dexterity] + [skill.agility] + [skill.survival]'
    },
    mage: {
      label: 'Mage',
      attributeKey: 'intelligence',
      skillKey: 'magic',
      maxClassPoints: '[level]'
    },
    forge: {
      label: 'Forge',
      attributeKey: 'intelligence',
      skillKey: 'smithing',
      maxClassPoints: '3 + [classItemBonus] * 3'
    },
    herald: {
      label: 'Herald',
      attributeKey: 'charisma',
      skillKey: 'influence',
      maxClassPoints: '[level]'
    },
    enchanter: {
      label: 'Enchanter',
      attributeKey: 'charisma',
      skillKey: 'enchantment'
    },
    sage: {
      label: 'Sage',
      attributeKey: 'perception',
      skillKey: 'nature',
      maxClassPoints: '[level]'
    },
    druid: {
      label: 'Druid',
      attributeKey: 'perception',
      skillKey: 'beast',
      maxClassPoints: '[classItemBonus] + 1'
    }
  }
};

export const WORLD_KITS = {
  vale_of_myths: VALE_OF_MYTHS
};
