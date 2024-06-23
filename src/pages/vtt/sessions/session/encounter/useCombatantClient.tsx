import { Combatant } from '@/pages/vtt/types/Combatant';

export const getCombatantMaxHealthPoints = (combatant: Combatant) =>
  (combatant.level + combatant.attributes.strength) * 6;

export const useCombatantClient = (combatant: Combatant) => {
  // ---------- COMBAT RATING ----------- //
  const combatRating = 1 + Math.floor(combatant.level / 3);

  // ---------- SPEED ----------- //
  const speed = 3 + combatant.attributes.dexterity;

  // ---------- HEALTH POINTS ----------- //
  const maxHealthPoints = getCombatantMaxHealthPoints(combatant);

  return {
    ...combatant,
    combatRating,
    speed,
    maxHealthPoints
  };
};
