import { AttributeKey } from './Character';

type CharacterClass = {
  label: string;
  attributeKey: AttributeKey;
  skillKey: string;
  classItemLabel: string;
  classAbilities: ClassAbility[];
  computed?: {
    speed?: string;
    maxHitPoints?: string;
    maxClassPoints?: string;
  };
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
};

export type InventoryItemType = 'WEAPON' | 'ARMOR' | 'TOOL';

type InventoryItem = {
  type?: InventoryItemType;
  name: string;
  description: string;
  cost: number;
  weight: number;
};

type WorldKit = {
  label: string;
  races: string[];
  classes: { [key: string]: CharacterClass };
  items: { [key: string]: InventoryItem };
};

const VALE_OF_MYTHS: WorldKit = {
  label: 'Vale of Myths',
  races: ['Human', 'Dwarf', 'Elf', 'Fay', 'Halfling'],
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
          description: 'When you have 12 hit points or less, your attack damage is doubled.',
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
            'You can make a Rage check to throw a Very Heavy item within 5 feet at an enemy within 30 feet. On a success, the target is hit and takes 2d6 damage.',
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
          requirement: 1
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
          description: 'You find inner peace and restore all of your missing Chi Points.',
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
            'You can make a Chi check to calm a group of people. On a success, you gain advantage on Speech checks against them equal to your Chi.',
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
            'You can stabilize an incapacitated character using Chi instead of Medicine. On a success, the character is stabilized with 1D6 hit points. For each Chi Point spent, increase this healing by 2D6.',
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
          requirement: 'INNATE'
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
            'When rolling Medicine to stabilize an incapacitated character or heal an injured character during a Rest, add your Survival bonus. Characters healed or stabilized by you gain 2D6 hit points.',
          requirement: 18
        },
        {
          key: 'speed_quiver',
          name: 'Speed Quiver',
          type: ClassAbilityType.PASSIVE,
          description: 'You can make a ranged attack with a bow using Survival.',
          requirement: 18
        }
      ],
      computed: {
        speed: '3 + [attribute.dexterity] + [skill.agility] + [skill.survival]'
      }
    },
    mage: {
      label: 'Mage',
      attributeKey: 'intelligence',
      skillKey: 'magic',
      classItemLabel: 'Magical Channel',
      classAbilities: [
        {
          key: 'channel_magic',
          name: 'Channel Magic',
          type: ClassAbilityType.REST_ACTIVITY,
          description: 'You study your magic and regain all missing Magic Points.',
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
            'When casting a spell, you can roll a Deception check to hide your casting. Characters can roll an Insight check against your Magic bonus to spot the casting.',
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
            'You can spend 1 to 3 MP to surround you or another character in magical armor until your next Rest. Spend 1 MP for Light Armor, 2 MP for Medium Armor, and 4 MP for Heavy Armor.',
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
            'You can roll a Magic check to create a wall of fire that covers a 5ft x 30ft area within 30ft until the end of combat. On a success, spend 3 MP. The wall blocks line of sight for ranged attacks and any character hit by the fire must make a Fortitude check against your Magic bonus, taking 3d6 damage on a success and 6d6 damage otherwise.',
          requirement: 'elementalism'
        },
        {
          key: 'tidal_wave',
          name: 'Tidal Wave',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to create a tidal wave of water that hits a 15ft x 30ft area within 30ft. On a success, spend 4 MP. Any character hit by the wave must make a Fortitude check against your Magic bonus, taking 2d6 damage on a success and 4d6 damage otherwise.',
          requirement: 'elementalism'
        },
        {
          key: 'sink_hole',
          name: 'Sink Hole',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to crumble the earth in a 30ft x 30ft area within 30ft. On a success, spend 6 MP. All characters caught within the area must make an Agility check against your Magic bonus, taking 3d6 damage on a success and 6d6 damage otherwise. The area becomes Rough Terrain until the end of combat.',
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
            'You can roll a Magic check to steal the life force from an enemy within 5ft. On a success, spend 3 MP. The enemy takes 3d6 damage.',
          requirement: 'necromancy'
        },
        {
          key: 'life_steal',
          name: 'Life Steal',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to steal the life force from an enemy within 5ft. On a success, spend 6 MP. The enemy takes 4d6 damage and you heal 2d6 hit points.',
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
    forge: {
      label: 'Forge',
      attributeKey: 'intelligence',
      skillKey: 'smithing',
      classItemLabel: 'Smithing Hammer',
      classAbilities: [],
      computed: {
        maxClassPoints: '3 + [classItemBonus] * 3'
      }
    },
    herald: {
      label: 'Herald',
      attributeKey: 'charisma',
      skillKey: 'influence',
      classItemLabel: 'Beacon of Influence',
      classAbilities: [
        {
          key: 'influence_others',
          name: 'Influence Others',
          type: ClassAbilityType.PASSIVE,
          description:
            'At any time, you can make an Influence check to force an enemy or ally to reroll a skill check. On a success, the target must reroll with advantage or disadvantage equal to the number of IP spent (minimum 1). On a stalemate, the target keeps their roll. On a failure, the target keeps their roll and you expend 1 IP.',
          requirement: 'INNATE'
        },
        {
          key: 'influential_nature',
          name: 'Influential Nature',
          type: ClassAbilityType.PASSIVE,
          description: 'You regain of your missing Influence Points after a Rest.',
          requirement: 'INNATE'
        },
        {
          key: 'whisper',
          name: 'Whisper',
          type: ClassAbilityType.PASSIVE,
          description: 'You go unnoticed when influencing others.',
          requirement: 1
        },
        {
          key: 'captivating_speech',
          name: 'Captivating Speech',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can roll an Influence check to captivate a group of people with a speech. On a success, spend 2 IP. All characters within 60ft are captivated by your speech, giving you and your allies +advantage on Speech and Deception checks made against them equal to your Influence.',
          requirement: 1
        },
        {
          key: 'charming_presence',
          name: 'Charming Presence',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can roll an Influence check to charm those around you with your presence. On a success, spend 2 IP. All characters within 10ft become charmed by your presence, compelling them to obey any simple commands that do not harm themselves or others.',
          requirement: 1
        },
        {
          key: 'combat_knowledge',
          name: 'Combat Knowledge',
          type: ClassAbilityType.PASSIVE,
          description:
            'When you influence an ally to succeed on an attack roll, they deal an additional 1D6 damage.',
          requirement: 6
        },
        {
          key: 'rallying_cry',
          name: 'Rallying Cry',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            'You can make an Influence check to rally your allies in combat. On a success, you spend IP equal to the number of allies rallied and they all gain +1 advantage on attacks for 3 turns.',
          requirement: 6
        },
        {
          key: 'psychological_warfare',
          name: 'Psychological Warfare',
          type: ClassAbilityType.PASSIVE,
          description:
            'When you influence an enemy to fail on an attack roll, they take 1D6 damage.',
          requirement: 12
        },
        {
          key: 'combat_guidance',
          name: 'Combat Guidance',
          type: ClassAbilityType.BONUS_ACTION,
          description:
            'You can roll an Influence check to give an ally within 30ft guidance. On a success, that ally has advantage equal to your Influence on all attack checks for 1 turn.',
          requirement: 12
        },
        {
          key: 'student_of_life',
          name: 'Student of Life',
          type: ClassAbilityType.PASSIVE,
          description: 'On a failure to Influence Others, you gain 1 IP instead of losing 1 IP.',
          requirement: 18
        },
        {
          key: 'turncoat',
          name: 'Turncoat',
          type: ClassAbilityType.MAIN_ACTION,
          description:
            "You can make an Influence check against an enemy's Intuition to convince them to join your cause. On a success, you spend IP equal to the enemy's level and they change sides until the end of combat.",
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
      classAbilities: []
    },
    sage: {
      label: 'Sage',
      attributeKey: 'perception',
      skillKey: 'nature',
      classItemLabel: 'Ritual Totem',
      classAbilities: [],
      computed: {
        maxClassPoints: '[level]'
      }
    },
    druid: {
      label: 'Druid',
      attributeKey: 'perception',
      skillKey: 'beast',
      classItemLabel: 'Tamed Beast',
      classAbilities: [],
      computed: {
        maxClassPoints: '[classItemBonus] + 1'
      }
    }
  },
  items: {
    currency: {
      name: 'Valerian Pieces',
      description: '',
      cost: 1,
      weight: 1 / 20
    },
    dagger: {
      type: 'WEAPON',
      name: 'Dagger',
      description: '+1 Power to attack, 1d6 damage, 5ft range',
      cost: 5,
      weight: 1 / 2
    },
    shortsword: {
      type: 'WEAPON',
      name: 'Shortsword',
      description: '+1 Power to attack, 2d6 damage, 5ft range',
      cost: 20,
      weight: 1
    },
    longsword: {
      type: 'WEAPON',
      name: 'Longsword',
      description: '+2 Power to attack, 3d6 damage, 5ft range',
      cost: 100,
      weight: 2
    },
    greatsword: {
      type: 'WEAPON',
      name: 'Greatsword',
      description: '+3 Power to attack, 4d6 damage, 5ft range',
      cost: 200,
      weight: 2
    },
    shortbow: {
      type: 'WEAPON',
      name: 'Shortbow',
      description: '+1 Precision to attack, 1d6 damage, 40ft range',
      cost: 20,
      weight: 2
    },
    crossbow: {
      type: 'WEAPON',
      name: 'Crossbow',
      description: '+2 Precision to attack, 2d6 damage, 40ft range',
      cost: 100,
      weight: 2
    },
    longbow: {
      type: 'WEAPON',
      name: 'Longbow',
      description: '+3 Precision to attack, 3d6 damage, 80ft range',
      cost: 200,
      weight: 2
    },
    leather_armor: {
      type: 'ARMOR',
      name: 'Leather Armor',
      description: 'Light armor',
      cost: 20,
      weight: 0
    },
    chainmail_armor: {
      type: 'ARMOR',
      name: 'Chainmail Armor',
      description: 'Medium armor',
      cost: 100,
      weight: 0
    },
    plate_armor: {
      type: 'ARMOR',
      name: 'Plate Armor',
      description: 'Heavy armor',
      cost: 200,
      weight: 0
    },
    rope: {
      type: 'TOOL',
      name: 'Rope',
      description: '+1 Athletics to climb',
      cost: 5,
      weight: 1
    },
    grappling_hook: {
      type: 'TOOL',
      name: 'Grappling Hook',
      description: '+1 Athletics to climb',
      cost: 5,
      weight: 1 / 2
    },
    lantern: {
      type: 'TOOL',
      name: 'Lantern',
      description: '+1 Investigation/Detection to search',
      cost: 5,
      weight: 1 / 2
    },
    medical_pouch: {
      type: 'TOOL',
      name: 'Medical Pouch',
      description: '+1 Medicine to heal or stabilize',
      cost: 20,
      weight: 1 / 2
    },
    tool_belt: {
      type: 'TOOL',
      name: 'Tool Belt',
      description: '+1 Innovation to repair or craft',
      cost: 20,
      weight: 1
    },
    world_map: {
      type: 'TOOL',
      name: 'World Map',
      description: '+1 Insight to interpret a location or path',
      cost: 5,
      weight: 1 / 4
    }
  }
};

export const WORLD_KITS = {
  vale_of_myths: VALE_OF_MYTHS
};
