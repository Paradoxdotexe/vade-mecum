import { AbilityType } from './Class';

type Attributes = {
  strength: number;
  dexterity: number;
  intelligence: number;
  charisma: number;
  perception: number;
};

export type Combatant = {
  key: string;
  name: string;
  description: string;
  affiliation?: string;
  level: number;
  attributes: Attributes;
  itemQuantities: { key: string; quantity: number }[];
  abilities: CombatantAbility[];
};

export type CombatantAbility = {
  key: string;
  type: AbilityType;
  name: string;
  description: string;
};
