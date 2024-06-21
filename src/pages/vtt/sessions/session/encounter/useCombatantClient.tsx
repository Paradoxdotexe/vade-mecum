import { Combatant } from '@/pages/vtt/types/Combatant';

const getCombatantCombatRating = (combatant: Combatant) => 2 + Math.floor(combatant.level / 4);

export const getCombatantMaxHealthPoints = (combatant: Combatant) =>
  (combatant.level + getCombatantCombatRating(combatant)) * 6;

export const useCombatantClient = (combatant: Combatant) => {
  // ---------- COMBAT RATING ----------- //
  const combatRating = getCombatantCombatRating(combatant);

  // ---------- HEALTH POINTS ----------- //
  const maxHealthPoints = getCombatantMaxHealthPoints(combatant);

  return {
    ...combatant,
    combatRating,
    maxHealthPoints
  };
};
