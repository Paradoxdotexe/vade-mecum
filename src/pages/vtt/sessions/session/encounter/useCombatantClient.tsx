import { Attributes } from '@/pages/vtt/types/Character';
import { Combatant } from '@/pages/vtt/types/Combatant';
import { WORLD_KIT } from '@/pages/vtt/types/WorldKit';

export const getCombatantMaxHealthPoints = (combatant: Combatant) =>
  (combatant.level + combatant.attributes.strength) * 6;

export const useCombatantClient = (combatant: Combatant) => {
  // ---------- ATTRIBUTES ----------- //
  const attributes: Attributes = {
    strength: {
      label: 'Strength',
      value: combatant.attributes.strength,
      skills: {
        power: { label: 'Power', value: 0 },
        fortitude: { label: 'Fortitude', value: 0 },
        athletics: { label: 'Athletics', value: 0 }
      }
    },
    dexterity: {
      label: 'Dexterity',
      value: combatant.attributes.dexterity,
      skills: {
        precision: { label: 'Precision', value: 0 },
        stealth: { label: 'Stealth', value: 0 },
        agility: { label: 'Agility', value: 0 }
      }
    },

    intelligence: {
      label: 'Intelligence',
      value: combatant.attributes.intelligence,
      skills: {
        intellect: { label: 'Intellect', value: 0 },
        medicine: { label: 'Medicine', value: 0 },
        engineering: { label: 'Engineering', value: 0 }
      }
    },
    charisma: {
      label: 'Charisma',
      value: combatant.attributes.charisma,
      skills: {
        intuition: { label: 'Intuition', value: 0 },
        influence: { label: 'Influence', value: 0 },
        luck: { label: 'Luck', value: 0 }
      }
    },
    perception: {
      label: 'Perception',
      value: combatant.attributes.perception,
      skills: {
        insight: { label: 'Insight', value: 0 },
        detection: { label: 'Detection', value: 0 },
        investigation: { label: 'Investigation', value: 0 }
      }
    }
  };

  // ---------- INVENTORY ITEMS ----------- //
  const items = combatant.itemQuantities.map(({ key, quantity }) => {
    const item = WORLD_KIT.items.find(item => item.key === key)!;
    return { ...item, quantity };
  });

  // ---------- COMBAT RATING ----------- //
  const combatRating = 1 + Math.floor(combatant.level / 3);

  // ---------- SPEED ----------- //
  const speed = 3 + combatant.attributes.dexterity;

  // ---------- HEALTH POINTS ----------- //
  const maxHealthPoints = getCombatantMaxHealthPoints(combatant);

  return {
    ...combatant,
    attributes,
    items,
    combatRating,
    speed,
    maxHealthPoints
  };
};

export type CombatantClient = NonNullable<ReturnType<typeof useCombatantClient>>;
