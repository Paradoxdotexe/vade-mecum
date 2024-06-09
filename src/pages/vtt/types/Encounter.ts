export type Encounter = {
  id: string;
  name: string;
  combatants: EncounterCombatant[];
  turn: number;
  hidden: boolean;
};

type EncounterCombatant =
  | {
      enemyKey: string;
      initiative: string;
    }
  | {
      characterId: string;
      initiative: string;
    };
