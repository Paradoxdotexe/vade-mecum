import { Combatant } from '@/pages/vtt/types/Combatant';

export const useCombatantClient = (combatant: Combatant) => {
  // ---------- COMBAT RATING ----------- //
  const combatRating = 2 + Math.floor(combatant.level / 4);

  // ---------- HEALTH POINTS ----------- //
  const maxHealthPoints = (combatant.level + combatRating) * 6;

  return {
    ...combatant,
    combatRating,
    maxHealthPoints
  };
};
