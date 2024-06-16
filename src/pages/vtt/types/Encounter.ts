export type Encounter = {
  id: string;
  name: string;
  participants: EncounterParticipant[];
  turn: number;
  hidden: boolean;
};

export type CharacterParticipant = {
  characterId: string;
  initiative: number;
};

export type CombatantParticipant = {
  combatantKey: string;
  initiative: number;
  healthPoints: number;
};

export type EncounterParticipant = CharacterParticipant | CombatantParticipant;

export const isCharacterParticipant = (
  participant: EncounterParticipant
): participant is CharacterParticipant => 'characterId' in participant;

export const isCombatantParticipant = (
  participant: EncounterParticipant
): participant is CombatantParticipant => 'combatantKey' in participant;
