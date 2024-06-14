export type Encounter = {
  id: string;
  name: string;
  combatants: EncounterCombatant[];
  turn: number;
  hidden: boolean;
};

export type CharacterCombatant = {
  characterId: string;
  initiative: number;
};

export type EnemyCombatant = {
  enemyKey: string;
  initiative: number;
  healthPoints: number;
};

export type EncounterCombatant = CharacterCombatant | EnemyCombatant;

export const isCharacterCombatant = (
  combatant: EncounterCombatant
): combatant is CharacterCombatant => 'characterId' in combatant;

export const isEnemyCombatant = (combatant: EncounterCombatant): combatant is EnemyCombatant =>
  'enemyKey' in combatant;
