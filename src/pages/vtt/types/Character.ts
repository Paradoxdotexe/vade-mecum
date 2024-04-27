type Attribute = {
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
    intellect: Skill;
    medicine: Skill;
    innovation: Skill;
  };
};

type CharismaAttribute = Attribute & {
  skills: {
    intuition: Skill;
    influence: Skill;
    luck: Skill;
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

// if CharacterDefinition is updated, DEFAULT_CHARACTER_DEFINITION and CHARACTER_MIGRATIONS in the API must be updated accordingly
export type CharacterDefinition = {
  name: string;
  raceKey: string;
  classKey: string;
  partyGoal: string;
  personalGoal: string;
  level: number;
  levelPoints: number;
  healthPoints: number;
  classPoints: number;
  attributes: Attributes;
  classItemDescription?: string;
  satiation: number;
  exhaustion: number;
  perkKeys: string[];
  classAbilityKeys: string[];
  itemQuantities: { key: string; quantity: number }[];
};

export type Character = CharacterDefinition & {
  id: string;
  userId: string;
};
