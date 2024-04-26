import { AttributeKey } from './Character';

export type Item = {
  key: string;
  type?: ItemType;
  name: string;
  cost: string;
  weight?: number;
  bonus?: {
    attributeKey: AttributeKey;
    skillKey: string;
    skillBonus: number;
  };
  damage?: number;
  notes?: string;
};

export enum ItemType {
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
  TOOL = 'TOOL',
  MEAL = 'MEAL',
  LODGING = 'LODGING'
}
