import { AbilityType } from './Class';

export type Enemy = {
  key: string;
  name: string;
  level: number;
  itemQuantities: { key: string; quantity: number }[];
  abilities: EnemyAbility[];
  speed: number;
};

export type EnemyAbility = {
  key: string;
  type: AbilityType;
  name: string;
  description: string;
};
