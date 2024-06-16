import { AbilityType } from './Class';

export type Combatant = {
  key: string;
  name: string;
  level: number;
  itemQuantities: { key: string; quantity: number }[];
  abilities: CombatantAbility[];
  speed: number;
};

export type CombatantAbility = {
  key: string;
  type: AbilityType;
  name: string;
  description: string;
};
