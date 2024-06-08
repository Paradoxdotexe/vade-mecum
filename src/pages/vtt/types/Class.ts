import { AttributeKey } from './Character';
import { CharacterComputations } from './WorldKit';

export type Class = {
  key: string;
  name: string;
  attributeKey: AttributeKey;
  skillKey: string;
  classItemLabel: string;
  classAbilities: ClassAbility[];
  computed?: CharacterComputations;
};

export enum AbilityType {
  PASSIVE = 'PASSIVE',
  MAIN_ACTION = 'MAIN_ACTION',
  BONUS_ACTION = 'BONUS_ACTION',
  REACTION = 'REACTION',
  REST_ACTIVITY = 'REST_ACTIVITY'
}

export type ClassAbility = {
  key: string;
  type: AbilityType;
  name: string;
  description: string;
  requirement: string | number;
  computed?: CharacterComputations;
};
