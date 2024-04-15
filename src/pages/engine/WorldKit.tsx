import { AttributeKey } from './Character';
import { Perk } from './Perk';

type CharacterClass = {
  label: string;
  attributeKey: AttributeKey;
  skillKey: string;
  classItemLabel: string;
  classAbilities: ClassAbility[];
  computed?: CharacterComputations;
};

export type CharacterComputations = {
  speed?: string;
  maxClassPoints?: string;
  initiative?: string;
  maxHealthPoints?: string;
  carryingCapacity?: string;
};

enum ClassAbilityType {
  PASSIVE = 'PASSIVE',
  MAIN_ACTION = 'MAIN_ACTION',
  BONUS_ACTION = 'BONUS_ACTION',
  REACTION = 'REACTION',
  REST_ACTIVITY = 'REST_ACTIVITY'
}

type ClassAbility = {
  key: string;
  type: ClassAbilityType;
  name: string;
  description: string;
  requirement: string | number;
  computed?: CharacterComputations;
};

export enum InventoryItemType {
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
  TOOL = 'TOOL',
  MEAL = 'MEAL',
  LODGING = 'LODGING'
}

export type InventoryItem = {
  type?: InventoryItemType;
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

type Race = {
  name: string;
  perk: Perk;
};

type WorldKit = {
  label: string;
  races: { [key: string]: Race };
  classes: { [key: string]: CharacterClass };
  items: { [key: string]: InventoryItem };
};

const VALE_OF_MYTHS: WorldKit = {
  label: 'Vale of Myths',
  races: {
    human: {
      name: 'Human',
      perk: {
        key: 'human_determination',
        name: 'Human Determination',
        description: 'Once per Rest, you can reroll a failed skill check.'
      }
    },
    dwarf: {
      name: 'Dwarf',
      perk: {
        key: 'dwarven_resilience',
        name: 'Dwarven Resilience',
        description: 'Your Max HP is increased by 24.',
        computed: {
          maxHealthPoints: '[base] + 24'
        }
      }
    },
    elf: {
      name: 'Elf',
      perk: {
        key: 'elven_trance',
        name: 'Elven Trance',
        description: 'During a Rest, you can complete an additional Rest Activity.'
      }
    },
    fay: {
      name: 'Fay',
      perk: {
        key: 'fayan_charm',
        name: 'Fayan Charm',
        description: 'Once per Rest, you can force a person to tell one truth.'
      }
    },
    halfling: {
      name: 'Halfling',
      perk: {
        key: 'halfling_hospitality',
        name: 'Halfling Hospitality',
        description:
          'You and your companions get the bonus of Simple Lodging when resting in an Adventuring Camp.'
      }
    }
  },
  classes: {
    knight: {
      label: 'Knight',
      attributeKey: 'strength',
      skillKey: 'honor',
      classItemLabel: 'Honorific Banner',
      classAbilities: [
        {
          key: 'honorific_strike',
          name: 'Honorific Strike',
          type: ClassAbilityType.BONUS_ACTION,
          description: 'You can make a melee attack using Honor.',
          requirement: 'INNATE'
        },
        {
          key: 'battle_knowledge',
          name: 'Battle Knowledge',
          type: ClassAbilityType.PASSIVE,
          description:
            'You can make Insight and Intuition checks using Honor instead when gauging an upcoming battle.',
          requirement: 1
        },
        {
          key: 'battle_charge',
          name: 'Battle Charge',
          type: ClassAbilityType.PASSIVE,
          description: 'Your Movement Speed is doubled for the first round of combat.',
          requirement: 1
        },
        {
          key: 'indomitable_spirit',
          name: 'Indomitable Spirit',
          type: ClassAbilityType.PASSIVE,
          description:
            'While a member of your Adventuring Party is incapacitated, you gain +1 advantage on melee attacks.',
          requirement: 1
        },
        {
          key: 'kings_champion',
          name: "King's Champion",
          type: ClassAbilityType.PASSIVE,
          description: 'Your initiative roll is automatically doubled.',
          requirement: 1
        },
        {
          key: 'last_stand',
          name: 'Last Stand',
          type: ClassAbilityType.PASSIVE,
          description: 'When you have 12 health points or less, your attack damage is doubled.',
          requirement: 6
        },
        {
          key: 'bulwark',
          name: 'Bulwark',
          type: ClassAbilityType.PASSIVE,
          description:
            'You take only half damage when hit by an enemy with over half of its health remaining.',
          requirement: 6
        },
        {
          key: 'formal_decree',
          name: 'Formal Decree',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            "You can make an Honor check against an enemy's Intuition to command them to stand down. On a success, they will not attack unless otherwise provoked.",
          requirement: 12
        },
        {
          key: 'honorable_duel',
          name: 'Honorable Duel',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can make an Honor check to command an enemy to duel. On a success, they cannot make attacks on characters other than you. The duel ends if they are attacked by anyone other than you.',
          requirement: 12
        },
        {
          key: 'shield_bash',
          name: 'Shield Bash',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can make an Honor check to bash an enemy within 5ft. On a success, they are knocked prone.',
          requirement: 18
        }
      ]
    },
    barbarian: {
      label: 'Barbarian',
      attributeKey: 'strength',
      skillKey: 'rage',
      classItemLabel: 'Tribal Marking',
      classAbilities: [
        {
          key: 'rampage',
          name: 'Rampage',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can make a Rage check to throw a Very Heavy item within 5 feet at an enemy within 30 feet. On a success, the target is hit and takes 2D6 damage.',
          requirement: 'INNATE'
        },
        {
          key: 'ready_to_rampage',
          name: 'Ready to Rampage',
          type: ClassAbilityType.PASSIVE,
          description: 'You always start combat with a Very Heavy item within 5 feet of you.',
          requirement: 1
        },
        {
          key: 'blood_rush',
          name: 'Blood Rush',
          type: ClassAbilityType.PASSIVE,
          description:
            'Your Movement Speed is increased by 10ft and you can traverse obstacles using Rage instead of Athletics or Agility.',
          requirement: 1,
          computed: {
            speed: '[base] + 2'
          }
        },
        {
          key: 'bloodlust',
          name: 'Bloodlust',
          type: ClassAbilityType.PASSIVE,
          description: 'After killing an enemy, your next attack deals double damage.',
          requirement: 1
        },
        {
          key: 'feral_instincts',
          name: 'Feral Instincts',
          type: ClassAbilityType.PASSIVE,
          description: 'You get advantage on opportunity attacks equal to your Rage.',
          requirement: 6
        },
        {
          key: 'feral_presence',
          name: 'Feral Presence',
          type: ClassAbilityType.PASSIVE,
          description:
            'When an enemy is within 10ft of you, they must make a Fortitude check at the beginning of their turn. On a failure, they are frightened and have -1 disadvantage on attacks until their next turn.',
          requirement: 6
        },
        {
          key: 'reckless_attack',
          name: 'Reckless Attack',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can make a melee attack using Rage. Until your next turn, attacks on you have +2 advantage.',
          requirement: 12
        },
        {
          key: 'reckless_beserker',
          name: 'Reckless Beserker',
          type: ClassAbilityType.PASSIVE,
          description:
            'After landing a melee attack using Power, your following Reckless Attack does not grant advantage on attacks made against you.',
          requirement: 12
        },
        {
          key: 'furious_hurl',
          name: 'Furious Hurl',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can make a Rage check to grab and throw an enemy within 5ft. On a success, the target lands prone 20ft away and takes 2D6 damage.',
          requirement: 18
        },
        {
          key: 'furious_frenzy',
          name: 'Furious Frenzy',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You double your Movement Speed this turn and make four attacks using Rage. Afterwards, you are stunned until the end of your next turn.',
          requirement: 18
        }
      ]
    },
    monk: {
      label: 'Monk',
      attributeKey: 'dexterity',
      skillKey: 'chi',
      classItemLabel: 'Spiritual Talisman',
      classAbilities: [
        {
          key: 'chi_surge',
          name: 'Chi Surge',
          type: ClassAbilityType.PASSIVE,
          description:
            'At any time, you can spend 1 CP to reroll an unsuccessful skill check. You cannot use Chi Surge twice on the same skill check.',
          requirement: 'INNATE'
        },
        {
          key: 'chi_deflection',
          name: 'Chi Deflection',
          type: ClassAbilityType.REACTION,
          description:
            'When hit with an attack, roll a Chi check. On a success, you deflect all damage.',
          requirement: 'INNATE'
        },
        {
          key: 'channel_chi',
          name: 'Channel Chi',
          type: ClassAbilityType.REST_ACTIVITY,
          description: 'You find inner peace and regain all of your missing Chi Points.',
          requirement: 'INNATE'
        },
        {
          key: 'reflexive',
          name: 'Reflexive',
          type: ClassAbilityType.PASSIVE,
          description: 'You gain a second reaction during combat.',
          requirement: 1
        },
        {
          key: 'pacifist_pacing',
          name: 'Pacifist Pacing',
          type: ClassAbilityType.PASSIVE,
          description:
            'Before you make your first attack in combat, you double your Movement Speed.',
          requirement: 1
        },
        {
          key: 'inspire_zen',
          name: 'Inspire Zen',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can make a Chi check to calm a group of people. On a success, you gain advantage on Influence checks against them equal to your Chi.',
          requirement: 1
        },
        {
          key: 'credence',
          name: 'Credence',
          type: ClassAbilityType.PASSIVE,
          description:
            'If you fail a skill check after using Chi Surge, you regain the lost Chi Point.',
          requirement: 6
        },
        {
          key: 'karmic_retribution',
          name: 'Karmic Retribution',
          type: ClassAbilityType.PASSIVE,
          description:
            'Before you make your first attack in combat, all attacks made against you have -2 disadvantage.',
          requirement: 6
        },
        {
          key: 'spirit_walk',
          name: 'Spirit Walk',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You enter or leave the spirit plane. While in the spirit plane, you become intangible to all characters in the physical plane and the effect of Rough Terrain is nullified.',
          requirement: 12
        },
        {
          key: 'healing_hand',
          name: 'Healing Hand',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can stabilize an incapacitated character using Chi instead of Medicine. On a success, the character is stabilized with 1D6 health points. For each Chi Point spent, increase this healing by 2D6.',
          requirement: 12
        },
        {
          key: 'return_to_sender',
          name: 'Return to Sender',
          type: ClassAbilityType.PASSIVE,
          description:
            'After using Chi Deflection to deflect an attack, you can spend 1 CP to deal the intended damage back on the attacker.',
          requirement: 18
        },
        {
          key: 'chi_discharge',
          name: 'Chi Discharge',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Chi check to release a forceful wave of Chi in all directions. On a success, all characters within 20ft take 2D6 damage. For each Chi Point spent, increase this damage by 2D6.',
          requirement: 18
        }
      ],
      computed: {
        maxClassPoints: '3 + [classItemBonus] * 3'
      }
    },
    ranger: {
      label: 'Ranger',
      attributeKey: 'dexterity',
      skillKey: 'survival',
      classItemLabel: 'Survival Toolkit',
      classAbilities: [
        {
          key: 'ranger_training',
          name: 'Ranger Training',
          type: ClassAbilityType.PASSIVE,
          description:
            'You add your Survival bonus to your Movement speed and can traverse natural obstacles using Survival instead of Athletics or Agility.',
          requirement: 'INNATE',
          computed: {
            speed: '[base] + [skill.survival]'
          }
        },
        {
          key: 'ranger_vision',
          name: 'Ranger Vision',
          type: ClassAbilityType.PASSIVE,
          description:
            'While you are alert, Stealth checks made by enemies to surprise your Adventuring Party have disadvantage equal to your Survival bonus.',
          requirement: 'INNATE'
        },
        {
          key: 'scouting_lens',
          name: 'Scouting Lens',
          type: ClassAbilityType.PASSIVE,
          description:
            'When rolling Detection or Investigation to scout or search from a vantage point, add your Survival bonus.',
          requirement: 1
        },
        {
          key: 'field_notes',
          name: 'Field Notes',
          type: ClassAbilityType.PASSIVE,
          description:
            'When rolling Insight against natural phenomena, such as plants, animals, weather, or terrain, add your Survival bonus.',
          requirement: 1
        },
        {
          key: 'climbing_kit',
          name: 'Climbing Kit',
          type: ClassAbilityType.PASSIVE,
          description: 'When rolling Athletics to climb, add your Survival bonus.',
          requirement: 1
        },
        {
          key: 'camouflage',
          name: 'Camouflage',
          type: ClassAbilityType.PASSIVE,
          description: 'When rolling Stealth to avoid being seen, add your Survival bonus.',
          requirement: 6
        },
        {
          key: 'splintering_arrows',
          name: 'Splintering Arrows',
          type: ClassAbilityType.PASSIVE,
          description: 'The damage inflicted by bows is increased by 1D6.',
          requirement: 6
        },
        {
          key: 'tripwire',
          name: 'Tripwire',
          type: ClassAbilityType.PASSIVE,
          description:
            'When rolling Detection to watch for enemies during a Rest or in a prepared area, add your Survival bonus.',
          requirement: 12
        },
        {
          key: 'survival_shelter',
          name: 'Survival Shelter',
          type: ClassAbilityType.PASSIVE,
          description:
            'You get the bonus of Simple Lodging when resting in an Adventuring Camp. When rolling Fortitude against natural phenomena, add your Survival bonus.',
          requirement: 12
        },
        {
          key: 'healing_salve',
          name: 'Healing Salve',
          type: ClassAbilityType.PASSIVE,
          description:
            'When rolling Medicine to stabilize an incapacitated character or heal an injured character during a Rest, add your Survival bonus. Characters healed or stabilized by you gain 2D6 health points.',
          requirement: 18
        },
        {
          key: 'speed_quiver',
          name: 'Speed Quiver',
          type: ClassAbilityType.PASSIVE,
          description: 'You can make a ranged attack with a bow using Survival.',
          requirement: 18
        }
      ]
    },
    mage: {
      label: 'Mage',
      attributeKey: 'intelligence',
      skillKey: 'magic',
      classItemLabel: 'Magical Channel',
      classAbilities: [
        {
          key: 'study_magic',
          name: 'Study Magic',
          type: ClassAbilityType.REST_ACTIVITY,
          description: 'You study magical theory and regain all of your missing Magic Points.',
          requirement: 'INNATE'
        },
        {
          key: 'prestidigitation',
          name: 'Prestidigitation',
          type: ClassAbilityType.PASSIVE,
          description:
            'You unlock all spells from the School of Prestidigitation, giving the ability to cast minor illusions and tricks.',
          requirement: 'INNATE'
        },
        {
          key: 'murmur',
          name: 'Murmur',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            "You can create a small sensory effect of an image, sound, or smell, such as the image of a tattoo, the sound of a barking dog, or the smell of oil. Characters can roll an Insight check against your Magic bonus to determine it's legitimacy.",
          requirement: 'INNATE'
        },
        {
          key: 'voices',
          name: 'Voices',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            "You can spend 1 MP to create a voice in someone's head that speaks one desired sentence. Characters can roll an Intuition check against your Magic bonus to determine it's legitimacy.",
          requirement: 'INNATE'
        },
        {
          key: 'mimic',
          name: 'Mimic',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            "You can spend 2 MP to disguise you or another character as someone else until your next Rest. Characters can roll an Insight check against your Magic bonus to determine it's legitimacy.",
          requirement: 'INNATE'
        },
        {
          key: 'silent_mage',
          name: 'Silent Mage',
          type: ClassAbilityType.PASSIVE,
          description:
            'When casting a spell, you can roll a Stealth check to hide your casting. Characters can roll an Insight check against your Magic bonus to spot the casting.',
          requirement: 1
        },
        {
          key: 'magical_eminence',
          name: 'Magical Eminence',
          type: ClassAbilityType.PASSIVE,
          description:
            'Allies within 15ft of you have +1 advantage on attacks and deal an additional 1D6 damage.',
          requirement: 1
        },
        {
          key: 'abjuration',
          name: 'Abjuration',
          type: ClassAbilityType.PASSIVE,
          description:
            'You unlock all spells from the School of Abjuration, giving the ability to defend yourself and your party.',
          requirement: 1
        },
        {
          key: 'mage_armor',
          name: 'Mage Armor',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can spend 1 to 4 MP to surround you or another character in magical armor until your next Rest. Spend 1 MP for Light Armor, 2 MP for Medium Armor, and 4 MP for Heavy Armor.',
          requirement: 'abjuration'
        },
        {
          key: 'magic_shield',
          name: 'Magic Shield',
          type: ClassAbilityType.REACTION,
          description:
            'When you or another character is hit by an attack, you can roll a Magic check to shield them from the hit. On a success, you reduce the damage by 2D6 for each MP spent.',
          requirement: 'abjuration'
        },
        {
          key: 'magical_discharge',
          name: 'Magical Discharge',
          type: ClassAbilityType.PASSIVE,
          description:
            'After consuming your last Magic Point, you can discharge your residual magic energy into a single attack. This attack deals an additional D6 for each Magic Point spent since your last Rest.',
          requirement: 6
        },
        {
          key: 'elementalism',
          name: 'Elementalism',
          type: ClassAbilityType.PASSIVE,
          description:
            'You unlock all spells from the School of Elementalism, giving the ability to wield the natural elements.',
          requirement: 6
        },
        {
          key: 'wall_of_fire',
          name: 'Wall of Fire',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to create a wall of fire that covers a 5ft x 30ft area within 30ft until the end of combat. On a success, spend 3 MP. The wall blocks line of sight for ranged attacks and any character hit by the fire must make a Fortitude check against your Magic bonus, taking 3D6 damage on a success and 6D6 damage otherwise.',
          requirement: 'elementalism'
        },
        {
          key: 'tidal_wave',
          name: 'Tidal Wave',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to create a tidal wave of water that hits a 15ft x 30ft area within 30ft. On a success, spend 4 MP. Any character hit by the wave must make a Fortitude check against your Magic bonus, taking 2D6 damage on a success and 4D6 damage otherwise.',
          requirement: 'elementalism'
        },
        {
          key: 'sink_hole',
          name: 'Sink Hole',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to crumble the earth in a 30ft x 30ft area within 30ft. On a success, spend 6 MP. All characters caught within the area must make an Agility check against your Magic bonus, taking 3D6 damage on a success and 6D6 damage otherwise. The area becomes Rough Terrain until the end of combat.',
          requirement: 'elementalism'
        },
        {
          key: 'magical_recharge',
          name: 'Magical Recharge',
          type: ClassAbilityType.PASSIVE,
          description:
            'Once per Rest, you can recharge your magic by focusing your remaining Magic Points. You regain 1D6 Magic Points for each Magic Point remaining.',
          requirement: 12
        },
        {
          key: 'necromancy',
          name: 'Necromancy',
          type: ClassAbilityType.PASSIVE,
          description:
            'You unlock all spells from the School of Necromancy, giving the ability to wield vitality and death.',
          requirement: 12
        },
        {
          key: 'necrotic_touch',
          name: 'Necrotic Touch',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to steal the life force from an enemy within 5ft. On a success, spend 3 MP. The enemy takes 3D6 damage.',
          requirement: 'necromancy'
        },
        {
          key: 'life_steal',
          name: 'Life Steal',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to steal the life force from an enemy within 5ft. On a success, spend 6 MP. The enemy takes 4D6 damage and you heal 2D6 health points.',
          requirement: 'necromancy'
        },
        {
          key: 'revival',
          name: 'Revival',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can spend 12 MP to revive a character that has been dead for less than 24 hours. The revived character has one attribute permanently reduced by 1.',
          requirement: 'necromancy'
        },
        {
          key: 'war_mage',
          name: 'War Mage',
          type: ClassAbilityType.PASSIVE,
          description:
            'You can cast any spell that requires a Main Action as a Bonus Action with -1 disadvantage.',
          requirement: 18
        },
        {
          key: 'chronomancy',
          name: 'Chronomancy',
          type: ClassAbilityType.PASSIVE,
          description:
            'You unlock all spells from the School of Chronomancy, giving the ability to wield the flow of time.',
          requirement: 18
        },
        {
          key: 'time_slow',
          name: 'Time Slow',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to slows the flow of time within a 120ft radius for 2 turns. On a success, spend 3 MP. For 2 turns, the Movement Speed of all enemies is reduced by half and all of their skill checks have -1 disadvantage.',
          requirement: 'chronomancy'
        },
        {
          key: 'time_stop',
          name: 'Time Stop',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to stop the flow of time within a 120ft radius. On a success, spend 6 MP. All enemies are frozen in time for 1 turn. All attacks made against them have +3 advantage.',
          requirement: 'chronomancy'
        }
      ],
      computed: {
        maxClassPoints: '[level]'
      }
    },
    mancer: {
      label: 'Mancer',
      attributeKey: 'intelligence',
      skillKey: 'magichanics',
      classItemLabel: 'Portable Workshop',
      classAbilities: [
        {
          key: 'magichanical_experimentation',
          name: 'Magichanical Experimentation',
          type: ClassAbilityType.REST_ACTIVITY,
          description:
            'You experiment with your magichanical inventions. Roll a Magichanics check. On a success, you gain 2 MP. On a stalemate, you gain 1 MP.',
          requirement: 'INNATE'
        },
        {
          key: 'arcane_aegis_armor',
          name: 'Arcane Aegis Armor',
          type: ClassAbilityType.PASSIVE,
          description: 'During a Rest, you can spend 1 MP to build a set of Arcane Aegis Armor.',
          requirement: 'INNATE'
        },
        {
          key: 'blessed_blunderbuss',
          name: 'Blessed Blunderbuss',
          type: ClassAbilityType.PASSIVE,
          description: 'During a Rest, you can spend 2 MP to build a Blessed Blunderbuss.',
          requirement: 'INNATE'
        },
        {
          key: 'mad_scientist',
          name: 'Mad Scientist',
          type: ClassAbilityType.PASSIVE,
          description: 'When using Magichanical Experimentation, you gain 1 MP even on a failure.',
          requirement: 1
        },
        {
          key: 'hexed_cartridges',
          name: 'Hexed Cartridges',
          type: ClassAbilityType.PASSIVE,
          description: 'You deal an additional 1D6 of damage when using a magichanical weapon.',
          requirement: 1
        },
        {
          key: 'mystic_masterkey',
          name: 'Mystic Masterkey',
          type: ClassAbilityType.PASSIVE,
          description:
            'During a Rest, you can spend 1 MP to build a Mystic Masterkey. You can use this device one time to roll a Magichanics check to open any door. On a success, the door is opened.',
          requirement: 1
        },
        {
          key: 'mystic_mail_armor',
          name: 'Mystic Mail Armor',
          type: ClassAbilityType.PASSIVE,
          description: 'During a Rest, you can spend 2 MP to build a set of Mystic Mail Armor.',
          requirement: 6
        },
        {
          key: 'frost_flintlock',
          name: 'Frost Flintlock',
          type: ClassAbilityType.PASSIVE,
          description: 'During a Rest, you can spend 3 MP to build a Frost Flintlock.',
          requirement: 6
        },
        {
          key: 'eldritch_exo_armor',
          name: 'Eldritch Exo Armor',
          type: ClassAbilityType.PASSIVE,
          description: 'During a Rest, you can spend 3 MP to build a set of Eldritch Exo Armor.',
          requirement: 12
        },
        {
          key: 'radiant_revolver',
          name: 'Radiant Revolver',
          type: ClassAbilityType.PASSIVE,
          description: 'During a Rest, you can spend 4 MP to build a Radiant Revolver.',
          requirement: 12
        },
        {
          key: 'recycled_materials',
          name: 'Recycled Materials',
          type: ClassAbilityType.PASSIVE,
          description: 'All magichanical inventions cost 1 MP less.',
          requirement: 18
        },
        {
          key: 'resonant_repeater',
          name: 'Resonant Repeater',
          type: ClassAbilityType.PASSIVE,
          description: 'During a Rest, you can spend 5 MP to build a Resonant Repeater.',
          requirement: 18
        }
      ],
      computed: {
        maxClassPoints: '(1 + [classItemBonus]) * 2'
      }
    },
    herald: {
      label: 'Herald',
      attributeKey: 'charisma',
      skillKey: 'diplomacy',
      classItemLabel: 'Beacon of Diplomacy',
      classAbilities: [
        {
          key: 'call_for_diplomacy',
          name: 'Call for Diplomacy',
          type: ClassAbilityType.PASSIVE,
          description:
            'At any time, you can make a Diplomacy check to force an enemy or ally to reroll a skill check. On a success, the target must reroll with advantage or disadvantage equal to the number of DP spent (minimum 1). On a stalemate, the target keeps their roll. On a failure, the target keeps their roll and you expend 1 DP.',
          requirement: 'INNATE'
        },
        {
          key: 'diplomatic_nature',
          name: 'Diplomatic Nature',
          type: ClassAbilityType.PASSIVE,
          description: 'You regain all of your missing Diplomacy Points after a Rest.',
          requirement: 'INNATE'
        },
        {
          key: 'whisper',
          name: 'Whisper',
          type: ClassAbilityType.PASSIVE,
          description: 'You go unnoticed when using Call for Diplomacy.',
          requirement: 1
        },
        {
          key: 'captivating_speech',
          name: 'Captivating Speech',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can roll a Diplomacy check to captivate a group of people with a speech. On a success, spend 2 DP. All characters within 60ft are captivated by your speech, giving you and your allies advantage on Influence and Stealth checks made against them equal to your Diplomacy bonus.',
          requirement: 1
        },
        {
          key: 'charming_presence',
          name: 'Charming Presence',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can roll a Diplomacy check to charm those around you with your presence. On a success, spend 2 DP. All characters within 10ft become charmed by your presence, compelling them to obey any simple commands that do not harm themselves or others.',
          requirement: 1
        },
        {
          key: 'combat_knowledge',
          name: 'Combat Knowledge',
          type: ClassAbilityType.PASSIVE,
          description:
            'When you use Call for Diplomacy to make an ally succeed on an attack roll, they deal an additional 1D6 damage.',
          requirement: 6
        },
        {
          key: 'rallying_cry',
          name: 'Rallying Cry',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can make a Diplomacy check to rally your allies in combat. On a success, you spend DP equal to the number of allies rallied and they all gain +1 advantage on attacks for 3 turns.',
          requirement: 6
        },
        {
          key: 'psychological_warfare',
          name: 'Psychological Warfare',
          type: ClassAbilityType.PASSIVE,
          description:
            'When you use Call for Diplomacy to make an enemy fail on an attack roll, they take 1D6 damage.',
          requirement: 12
        },
        {
          key: 'combat_guidance',
          name: 'Combat Guidance',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can roll a Diplomacy check to give an ally within 30ft guidance. On a success, that ally has advantage equal to your Diplomacy on all attack checks for 1 turn.',
          requirement: 12
        },
        {
          key: 'student_of_life',
          name: 'Student of Life',
          type: ClassAbilityType.PASSIVE,
          description: 'On a failure to Call for Diplomacy, you gain 1 DP instead of losing 1 DP.',
          requirement: 18
        },
        {
          key: 'turncoat',
          name: 'Turncoat',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            "You can make a Diplomacy check against an enemy's Intuition to convince them to join your cause. On a success, you spend DP equal to the enemy's level and they change sides until the end of combat.",
          requirement: 18
        }
      ],
      computed: {
        maxClassPoints: '[level]'
      }
    },
    enchanter: {
      label: 'Enchanter',
      attributeKey: 'charisma',
      skillKey: 'enchantment',
      classItemLabel: 'Enchantment Charm',
      classAbilities: [
        {
          key: 'recall_enchantment',
          name: 'Recall Enchantment',
          type: ClassAbilityType.PASSIVE,
          description:
            'At any time, you can recall one your enchantments to regain 1 Enchantment Point.',
          requirement: 'INNATE'
        },
        {
          key: 'enchantment_of_hallucination',
          name: 'Enchantment of Hallucination',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            "You can make an Enchantment check to enchant a target within 120ft with hallucinations. On a success, spend 1 EP. Until recalled, the target believes they see, smell, or hear something that isn't there. The target can roll an Insight check against your Enchantment bonus to see through the hallucination. This effect can grant advantage and disadvantage on related skill checks equal to your Enchantment bonus.",
          requirement: 'INNATE'
        },
        {
          key: 'mental_attunement',
          name: 'Mental Attunement',
          type: ClassAbilityType.PASSIVE,
          description: 'You permanently increase your Enchantment Points by 1.',
          requirement: 1,
          computed: {
            maxClassPoints: '[base] + 1'
          }
        },
        {
          key: 'enthralling_aura',
          name: 'Enthralling Aura',
          type: ClassAbilityType.PASSIVE,
          description: 'You automatically succeed on enchanting a target within 15ft of you.',
          requirement: 1
        },
        {
          key: 'enchantment_of_fear',
          name: 'Enchantment of Fear',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can make an Enchantment check to enchant a target within 120ft with harrowing fear. On a success, spend 1 EP and select a character or object for the target to fear. Until recalled, the target cannot move within 15ft of their fear or target their fear with an attack.',
          requirement: 1
        },
        {
          key: 'mind_fog',
          name: 'Mind Fog',
          type: ClassAbilityType.PASSIVE,
          description:
            'When you bestow an enchantment, you can target a 15ft x 15ft area instead of person. All characters within this area suffer the effect of your enchantment.',
          requirement: 6
        },
        {
          key: 'enchantment_of_impotence',
          name: 'Enchantment of Impotence',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can make an Enchantment check to enchant a target within 60ft with unnerving impotence. On a success, spend 1 EP. Until recalled, the target makes all attack checks with disadvantage equal to your Enchantment bonus.',
          requirement: 6
        },
        {
          key: 'enchantment_of_confidence',
          name: 'Enchantment of Confidence',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can make an enchantment check to enchant a target within 60ft with empowering confidence. On a success, spend 1 EP. Until recalled, the target makes all attack checks with advantage equal to your Enchantment Bonus.',
          requirement: 6
        },
        {
          key: 'enchantment_of_confusion',
          name: 'Enchantment of Confusion',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can make an Enchantment check to enchant a target within 60ft with disorienting confusion. On a success, spend 1 EP. Until recalled, the target must roll a Fortitude check against your Enchantment bonus at the start of each turn. On a stalemate, they are confused and cannot make any attacks. On a failure, they mistake an ally for an enemy and move to attack them.',
          requirement: 12
        },
        {
          key: 'enchanters_cant',
          name: "Enchanter's Cant",
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can make an Enchantment check to speak an ancient cant against all of your enchanted targets. On a success, all enchanted targets take 1D6 damage.',
          requirement: 18
        },
        {
          key: 'enchantment_of_death',
          name: 'Enchantment of Death',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can make an Enchantment check to enchant a target within 30ft with deadly psychological pain. On a success, spend 1 EP. Until recalled, the target takes 1D6 damage at the start of each turn.',
          requirement: 18
        }
      ],
      computed: {
        maxClassPoints: '[classItemBonus] + 1'
      }
    },
    sage: {
      label: 'Sage',
      attributeKey: 'perception',
      skillKey: 'nature',
      classItemLabel: 'Ritual Totem',
      classAbilities: [
        {
          key: 'ritual_of_guidance',
          name: 'Ritual of Guidance',
          type: ClassAbilityType.REST_ACTIVITY,
          description:
            'You cast a ritual to call upon nature to guide you on your journey. Until your next rest, you have access to all class abilities granted by Ritual of Guidance. You regain all of your missing Nature Points.',
          requirement: 'INNATE'
        },
        {
          key: 'natural_charisma',
          name: 'Natural Charisma',
          type: ClassAbilityType.PASSIVE,
          description:
            'While Ritual of Guidance is in effect, you gain advantage on Influence checks equal to your Nature bonus.',
          requirement: 'INNATE'
        },
        {
          key: 'natures_tongue',
          name: "Nature's Tongue",
          type: ClassAbilityType.PASSIVE,
          description:
            "While Ritual of Guidance is in effect, you can communicate with nature's beasts through their unique visual and auditory cues. Communication is effectively limited to basic one-word messages.",
          requirement: 'INNATE'
        },
        {
          key: 'veil_of_mist',
          name: 'Veil of Mist',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'While Ritual of Guidance is in effect, you can spend 1 NP to create a dense mist that masks your movements. You and all characters within 15ft of you have advantage on Stealth checks equal to your Nature bonus.',
          requirement: 'INNATE'
        },
        {
          key: 'freezing_touch',
          name: 'Freezing Touch',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'While Ritual of Guidance is in effect, you can roll a Nature check to freeze a target within 5ft. On a success, spend 2 NP. The target is frozen for 2 turns or 12 seconds.',
          requirement: 'INNATE'
        },
        {
          key: 'gust_of_wind',
          name: 'Gust of Wind',
          type: ClassAbilityType.PASSIVE,
          description: 'You add your Nature bonus to your Movement Speed.',
          requirement: 1,
          computed: {
            speed: '[base] + [skill.nature]'
          }
        },
        {
          key: 'fortress_of_thorns',
          name: 'Fortress of Thorns',
          type: ClassAbilityType.REST_ACTIVITY,
          description:
            'You call forth nature to construct a fortress of thorns to rest in. You and your companions get the bonus of Simple Lodging and gain 1 Satiation. All surprise attacks instantly fail. ',
          requirement: 1
        },
        {
          key: 'ritual_of_protection',
          name: 'Ritual of Protection',
          type: ClassAbilityType.REST_ACTIVITY,
          description:
            'You cast a ritual to call upon nature to protect you from danger. Until your next rest, you have access to all class abilities granted by Ritual of Protection. You regain all of your missing Nature Points.',
          requirement: 1
        },
        {
          key: 'stone_skin',
          name: 'Stone Skin',
          type: ClassAbilityType.PASSIVE,
          description:
            'While Ritual of Protection is in effect, you are surrounded by natural Heavy Armor.',
          requirement: 'ritual_of_protection'
        },
        {
          key: 'natural_armor',
          name: 'Natural Armor',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'While Ritual of Protection is in effect, you can spend 1 to 4 NP to surround another character in natural armor until your next Rest. Spend 1 NP for Light Armor, 2 NP for Medium Armor, and 4 NP for Heavy Armor.',
          requirement: 'ritual_of_protection'
        },
        {
          key: 'glancing_wind',
          name: 'Glancing Wind',
          type: ClassAbilityType.REACTION,
          description:
            'While Ritual of Protection is in effect, you can roll a Nature check when a character is hit with an attack. On a success, you can spend 1 NP to reduce the incoming damage by half or 2 NP to deflect all damage.',
          requirement: 'ritual_of_protection'
        },
        {
          key: 'natures_blessing',
          name: "Nature's Blessing",
          type: ClassAbilityType.PASSIVE,
          description:
            'When you are incapacitated, you can roll a Nature check to determine if nature intervenes. On a success, spend 1 NP. Instead of being incapacitated, you are reduced to 1 health point.',
          requirement: 6
        },
        {
          key: 'ritual_of_fury',
          name: 'Ritual of Fury',
          type: ClassAbilityType.REST_ACTIVITY,
          description:
            'You cast a ritual to call upon nature to empower you with its fury. Until your next rest, you have access to all class abilities granted by Ritual of Fury. You regain all of your missing Nature Points.',
          requirement: 6
        },
        {
          key: 'wind_strike',
          name: 'Wind Strike',
          type: ClassAbilityType.PASSIVE,
          description:
            'While Ritual of Fury in effect, you gain advantage on melee and ranged attacks equal to your Nature bonus.',
          requirement: 'ritual_of_fury'
        },
        {
          key: 'solar_smite',
          name: 'Solar Smite',
          type: ClassAbilityType.PASSIVE,
          description:
            'While Ritual of Fury is in effect, melee and ranged attacks deal an additional 1D6 damage.',
          requirement: 'ritual_of_fury'
        },
        {
          key: 'wind_flurry',
          name: 'Wind Flurry',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'While Ritual of Fury is in effect, you can roll a Nature check to summon a flurry of wind gusts. On a success, spend 2 NP. All enemies within 30ft are knocked prone.',
          requirement: 'ritual_of_fury'
        },
        {
          key: 'sun_burst',
          name: 'Sun Burst',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'While Ritual of Fury is in effect, you can roll a Nature check to summon a burst of solar energy. On a success, spend 2 NP. All enemies within 15ft take 3D6 damage.',
          requirement: 'ritual_of_fury'
        },
        {
          key: 'breach_of_rites',
          name: 'Breach of Rites',
          type: ClassAbilityType.PASSIVE,
          description:
            'Once per Rest, you can use a ritual act that requires a ritual that is not in effect.',
          requirement: 12
        },
        {
          key: 'ritual_of_chaos',
          name: 'Ritual of Chaos',
          type: ClassAbilityType.REST_ACTIVITY,
          description:
            'You cast a ritual to call upon nature to give you its chaotic energy to wield. Until your next rest, you have access to all class abilities granted by Ritual of Chaos. You regain all of your missing Nature Points.',
          requirement: 12
        },
        {
          key: 'chaotic_recharge',
          name: 'Chaotic Recharge',
          type: ClassAbilityType.PASSIVE,
          description:
            'While Ritual of Chaos is in effect, you gain 1 Nature Point whenever you are unsuccessful summoning a ritual act.',
          requirement: 'ritual_of_chaos'
        },
        {
          key: 'lightning_storm',
          name: 'Lightning Storm',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'While Ritual of Chaos is in effect, you can roll a Nature check to strike up to 3 targets within 120ft with lightning. On a success, spend 2 NP. Each lightning bolt deals 2D6 damage.',
          requirement: 'ritual_of_chaos'
        },
        {
          key: 'blizzard',
          name: 'Blizzard',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'While Ritual of Chaos is in effect, you can roll a Nature check to target up to 3 targets within 60ft with a freezing blizzard. On a success, spend 2 NP. All targets take 1D6 damage and are stunned for 1 turn.',
          requirement: 'ritual_of_chaos'
        },
        {
          key: 'impromptu_ritual',
          name: 'Impromptu Ritual',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'Once per Rest, you can cast a ritual that would otherwise require a Rest Activity. Your ongoing ritual is ended and the new ritual is put into effect.',
          requirement: 18
        },
        {
          key: 'ritual_of_foresight',
          name: 'Ritual of Foresight',
          type: ClassAbilityType.REST_ACTIVITY,
          description:
            'You cast a ritual to call upon nature to lend you its prescient wisdom. Until your next rest, you have access to all class abilities granted by Ritual of Foresight. You regain all of your missing Nature Points.',
          requirement: 18
        },
        {
          key: 'natures_wisdom',
          name: "Nature's Wisdom",
          type: ClassAbilityType.PASSIVE,
          description:
            'While Ritual of Foresight is in effect, you gain advantage on Intuition and Insight checks equal to your Nature bonus.',
          requirement: 'ritual_of_foresight'
        },
        {
          key: 'temporal_pincer',
          name: 'Temporal Pincer',
          type: ClassAbilityType.PASSIVE,
          description:
            'While Ritual of Foresight is in effect, all surprise attacks lead by you immediately succeed.',
          requirement: 'ritual_of_foresight'
        },
        {
          key: 'premonition',
          name: 'Premonition',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'While Ritual of Foresight is in effect, you can roll a Nature check to turn the last minute into a premonition. On a success, spend 4 NP. You are returned to the point of time exactly 60 seconds ago with the knowledge of what is to come. This ability cannot be used after 10 rounds have passed in combat.',
          requirement: 'ritual_of_foresight'
        },
        {
          key: 'clairvoyance',
          name: 'Clairvoyance',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'While Ritual of Foresight is in effect, you can roll a Nature check to forsee the perfect moments to strike and deflect attacks. On a success, spend 2 NP. For the next 2 turns, you gain advantage on melee and ranged attacks equal to your Nature bonus and get the bonus of Heavy Armor.',
          requirement: 'ritual_of_foresight'
        }
      ],
      computed: {
        maxClassPoints: '([classItemBonus] + 1) * 2'
      }
    },
    druid: {
      label: 'Druid',
      attributeKey: 'perception',
      skillKey: 'beast',
      classItemLabel: 'Tamed Beast',
      classAbilities: [
        {
          key: 'foster_companionship',
          name: 'Foster Companionship',
          type: ClassAbilityType.REST_ACTIVITY,
          description:
            'You foster companionship with your Tamed Beast and regain all of your missing Beast Points. You can optionally adopt a new Tamed Beast.',
          requirement: 'INNATE'
        },
        {
          key: 'summon_tamed_beast',
          name: 'Summon Tamed Beast',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can roll a Beast check to summon your Tamed Beast to attack a target or perform an object interaction within range. Small beasts have a range of 60ft and deal 1D6 damage. Medium beasts have a range of 30ft and deal 2D6 damage. Large beasts have a range of 15ft and deal 3D6 damage.',
          requirement: 'INNATE'
        },
        {
          key: 'swarm_of_bees',
          name: 'Swarm of Bees',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Beast check to summon a swarm of bees to attack a target within 120ft. On a success, spend 1 BP. The target takes 2D6 damage.',
          requirement: 'INNATE'
        },
        {
          key: 'beast_speech',
          name: 'Beast Speech',
          type: ClassAbilityType.PASSIVE,
          description:
            "You can communicate with nature's beasts through their unique visual and auditory cues. Communication is effectively limited to basic one-word messages.",
          requirement: 1
        },
        {
          key: 'beast_protection',
          name: 'Beast Protection',
          type: ClassAbilityType.REACTION,
          description:
            'When you are targeted with a melee attack, you can roll a Beast check to have your Tamed Beast protect you. On a success, incoming damage is reduced by 1D6.',
          requirement: 1
        },
        {
          key: 'vengeful_eagle',
          name: 'Vengeful Eagle',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Beast check to summon an eagle to attack a target within 90ft. On a success, spend 2 BP. The target takes 5D6 damage.',
          requirement: 1
        },
        {
          key: 'giant_companion',
          name: 'Giant Companion',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can roll a Beast check to transform your Tamed Beast into a giant version of itself. On a success, spend 1 BP. For 1 turn, your Tamed Beast is enlarged and deals double damage.',
          requirement: 6
        },
        {
          key: 'charging_bear',
          name: 'Charging Bear',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            '	You can roll a Beast check to summon a bear to attack a target within 60ft. On a success, spend 3 BP. The target takes 6D6 damage and is knocked prone.',
          requirement: 6
        },
        {
          key: 'beast_shape',
          name: 'Beast Shape',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can spend 1 BP to transform into the same form as your Tamed Beast for 1 hour. While transformed, you share the same speed and attack damage as your Tamed Beast.',
          requirement: 12
        },
        {
          key: 'pack_of_wolves',
          name: 'Pack of Wolves',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            ' You can roll a Beast check to summon a pack of 3 wolves to attack up to 3 targets within 60ft. On a success, spend 3 BP. Each wolf deals 3D6 damage.',
          requirement: 12
        },
        {
          key: 'enhanced_beast_shape',
          name: 'Enhanced Beast Shape',
          type: ClassAbilityType.PASSIVE,
          description:
            'When using Beast Shape, you can transform into any small, medium, or large creature and the transformation lasts for 4 hours.',
          requirement: 18
        },
        {
          key: 'prideful_lion',
          name: 'Prideful Lion',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Beast check to summon a lion to attack a target within 30ft. On a success, spend 4 BP. The target takes 10D6 damage is a stunned for 1 turn.',
          requirement: 18
        }
      ],
      computed: {
        maxClassPoints: '[classItemBonus] + 1'
      }
    }
  },
  items: {
    currency: {
      name: 'Valerian Pieces',
      cost: '',
      weight: 1 / 20
    },
    dagger: {
      type: InventoryItemType.WEAPON,
      name: 'Dagger',
      cost: '2D6',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 1
      },
      damage: 1,
      notes: '5ft range'
    },
    shortsword: {
      type: InventoryItemType.WEAPON,
      name: 'Shortsword',
      cost: '4D6',
      weight: 1,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 1
      },
      damage: 2,
      notes: '5ft range'
    },
    longsword: {
      type: InventoryItemType.WEAPON,
      name: 'Longsword',
      cost: '8D6',
      weight: 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 2
      },
      damage: 3,
      notes: '5ft range'
    },
    greatsword: {
      type: InventoryItemType.WEAPON,
      name: 'Greatsword',
      cost: '16D6',
      weight: 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 3
      },
      damage: 4,
      notes: '5ft range'
    },
    shortbow: {
      type: InventoryItemType.WEAPON,
      name: 'Shortbow',
      cost: '4D6',
      weight: 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 1
      },
      damage: 1,
      notes: '60ft range'
    },
    crossbow: {
      type: InventoryItemType.WEAPON,
      name: 'Crossbow',
      cost: '8D6',
      weight: 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 2
      },
      damage: 2,
      notes: '60ft range'
    },
    longbow: {
      type: InventoryItemType.WEAPON,
      name: 'Longbow',
      cost: '16D6',
      weight: 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 3
      },
      damage: 3,
      notes: '90ft range'
    },
    blessed_blunderbuss: {
      type: InventoryItemType.WEAPON,
      name: 'Blessed Blunderbuss',
      cost: '4D6',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 1
      },
      damage: 2,
      notes: '15ft range'
    },
    frost_flintlock: {
      type: InventoryItemType.WEAPON,
      name: 'Frost Flintlock',
      cost: '8D6',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 2
      },
      damage: 3,
      notes: '30ft range'
    },
    radiant_revolver: {
      type: InventoryItemType.WEAPON,
      name: 'Radiant Revolver',
      cost: '16D6',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 3
      },
      damage: 3,
      notes: '60ft range'
    },
    resonant_repeater: {
      type: InventoryItemType.WEAPON,
      name: 'Resonant Repeater',
      cost: '32D6',
      weight: 1,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 3
      },
      damage: 4,
      notes: '60ft range'
    },
    leather_armor: {
      type: InventoryItemType.ARMOR,
      name: 'Leather Armor',
      cost: '4D6',
      weight: 0,
      notes: 'Light armor'
    },
    chainmail_armor: {
      type: InventoryItemType.ARMOR,
      name: 'Chainmail Armor',
      cost: '8D6',
      weight: 0,
      notes: 'Medium armor'
    },
    plate_armor: {
      type: InventoryItemType.ARMOR,
      name: 'Plate Armor',
      cost: '16D6',
      weight: 0,
      notes: 'Heavy armor'
    },
    arcane_aegis_armor: {
      type: InventoryItemType.ARMOR,
      name: 'Arcane Aegis Armor',
      cost: '4D6',
      weight: 0,
      notes: 'Light armor'
    },
    mystic_mail_armor: {
      type: InventoryItemType.ARMOR,
      name: 'Mystic Mail Armor',
      cost: '8D6',
      weight: 0,
      notes: 'Medium armor'
    },
    eldritch_exo_armor: {
      type: InventoryItemType.ARMOR,
      name: 'Eldritch Exo Armor',
      cost: '16D6',
      weight: 0,
      notes: 'Heavy armor'
    },
    rope: {
      type: InventoryItemType.TOOL,
      name: 'Rope',
      cost: '2D6',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'athletics',
        skillBonus: 1
      }
    },
    rope_and_grappling_hook: {
      type: InventoryItemType.TOOL,
      name: 'Rope and Grappling Hook',
      cost: '4D6',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'athletics',
        skillBonus: 2
      }
    },
    medical_pouch: {
      type: InventoryItemType.TOOL,
      name: 'Medical Pouch',
      cost: '4D6',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'intelligence',
        skillKey: 'medicine',
        skillBonus: 1
      }
    },
    world_map: {
      type: InventoryItemType.TOOL,
      name: 'World Map',
      cost: '2D6',
      weight: 1 / 4,
      bonus: {
        attributeKey: 'perception',
        skillKey: 'insight',
        skillBonus: 1
      }
    },
    adventuring_ration: {
      type: InventoryItemType.MEAL,
      name: 'Adventuring Ration',
      cost: '1D6',
      weight: 1 / 4,
      notes: 'Satiates a character for 1 Rest'
    },
    simple_meal: {
      type: InventoryItemType.MEAL,
      name: 'Simple Meal',
      cost: '2D6',
      notes: 'Satiates a character for 2 Rests'
    },
    fancy_meal: {
      type: InventoryItemType.MEAL,
      name: 'Fancy Meal',
      cost: '4D6',
      notes: 'Satiates a character for 4 Rests'
    },
    adventuring_camp: {
      type: InventoryItemType.LODGING,
      name: 'Adventuring Camp',
      cost: 'FREE',
      notes: 'A cold place to sleep'
    },
    simple_lodging: {
      type: InventoryItemType.LODGING,
      name: 'Simple Lodging',
      cost: '4D6 CU',
      notes: 'A warm place to sleep, +2 to Rest Activity rolls'
    },
    fancy_lodging: {
      type: InventoryItemType.LODGING,
      name: 'Fancy Lodging',
      cost: '8D6 CU',
      notes: 'A warm and safe place to sleep, +3 to Rest Activity rolls'
    }
  }
};

export const WORLD_KITS = {
  vale_of_myths: VALE_OF_MYTHS
};
