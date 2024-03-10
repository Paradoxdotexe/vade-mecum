import { v4 as uuid } from 'uuid';

export type Attribute = {
  label: string;
  value: number;
  skills: {
    [key: string]: Skill;
  };
};

type Skill = {
  label: string;
  value: number;
};

type StrengthAttribute = Attribute & {
  skills: {
    power: Skill;
    fortitude: Skill;
    athletics: Skill;
  };
};

type DexterityAttribute = Attribute & {
  skills: {
    precision: Skill;
    stealth: Skill;
    agility: Skill;
  };
};

type IntelligenceAttribute = Attribute & {
  skills: {
    comprehension: Skill;
    medicine: Skill;
    innovation: Skill;
  };
};

type CharismaAttribute = Attribute & {
  skills: {
    intuition: Skill;
    speech: Skill;
    barter: Skill;
  };
};

type PerceptionAttribute = Attribute & {
  skills: {
    insight: Skill;
    detection: Skill;
    investigation: Skill;
  };
};

type Attributes = {
  strength: StrengthAttribute;
  dexterity: DexterityAttribute;
  intelligence: IntelligenceAttribute;
  charisma: CharismaAttribute;
  perception: PerceptionAttribute;
};

export type AttributeKey = keyof Attributes;

const DEFAULT_ATTRIBUTES: Attributes = {
  strength: {
    label: 'Strength',
    value: 0,
    skills: {
      power: { label: 'Power', value: 0 },
      fortitude: { label: 'Fortitude', value: 0 },
      athletics: { label: 'Athletics', value: 0 }
    }
  },
  dexterity: {
    label: 'Dexterity',
    value: 0,
    skills: {
      precision: { label: 'Precision', value: 0 },
      stealth: { label: 'Stealth', value: 0 },
      agility: { label: 'Agility', value: 0 }
    }
  },

  intelligence: {
    label: 'Intelligence',
    value: 0,
    skills: {
      comprehension: { label: 'Comprehension', value: 0 },
      medicine: { label: 'Medicine', value: 0 },
      innovation: { label: 'Innovation', value: 0 }
    }
  },
  charisma: {
    label: 'Charisma',
    value: 0,
    skills: {
      intuition: { label: 'Intuition', value: 0 },
      speech: { label: 'Speech', value: 0 },
      barter: { label: 'Barter', value: 0 }
    }
  },
  perception: {
    label: 'Perception',
    value: 0,
    skills: {
      insight: { label: 'Insight', value: 0 },
      detection: { label: 'Detection', value: 0 },
      investigation: { label: 'Investigation', value: 0 }
    }
  }
};

type Class = {
  attributeKey: AttributeKey;
  skillKey: string;
};

export const CLASSES: { [key: string]: Class } = {
  knight: {
    attributeKey: 'strength',
    skillKey: 'honor'
  },
  barbarian: {
    attributeKey: 'strength',
    skillKey: 'rage'
  },
  monk: {
    attributeKey: 'dexterity',
    skillKey: 'chi'
  },
  ranger: {
    attributeKey: 'dexterity',
    skillKey: 'survival'
  },
  mage: {
    attributeKey: 'intelligence',
    skillKey: 'magic'
  },
  forge: {
    attributeKey: 'intelligence',
    skillKey: 'smithing'
  },
  herald: {
    attributeKey: 'charisma',
    skillKey: 'influence'
  },
  enchanter: {
    attributeKey: 'charisma',
    skillKey: 'enchantment'
  },
  sage: {
    attributeKey: 'perception',
    skillKey: 'nature'
  },
  druid: {
    attributeKey: 'perception',
    skillKey: 'beast'
  }
};

export type Character = {
  key: string;
  name: string;
  description: string;
  level: number;
  classKey?: string;
  race?: string;
  attributes: Attributes;
  hitPoints: number;
};

export const DEFAULT_CHARACTER: Character = {
  key: uuid(),
  name: '',
  description: '',
  level: 1,
  attributes: DEFAULT_ATTRIBUTES,
  hitPoints: 6
};
