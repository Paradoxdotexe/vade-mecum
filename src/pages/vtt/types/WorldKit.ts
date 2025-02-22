import { Class, AbilityType } from './Class';
import { Combatant } from './Combatant';
import { Item, ItemType } from './Item';
import { Perk } from './Perk';

export type CharacterComputations = {
  speed?: string;
  maxClassPoints?: string;
  initiative?: string;
  maxHealthPoints?: string;
  carryingCapacity?: string;
};

type Race = {
  key: string;
  name: string;
  perk: Perk;
};

type WorldKit = {
  label: string;
  races: Race[];
  classes: Class[];
  items: Item[];
  combatants: Combatant[];
};

const VALE_OF_MYTHS: WorldKit = {
  label: 'Vale of Myths',
  races: [
    {
      key: 'human',
      name: 'Human',
      perk: {
        key: 'human_determination',
        name: 'Human Determination',
        description: 'Once per Rest, you can reroll a failed skill check.'
      }
    },
    {
      key: 'dwarf,',
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
    {
      key: 'elf',
      name: 'Elf',
      perk: {
        key: 'elven_trance',
        name: 'Elven Trance',
        description: 'During a Rest, you can complete an additional Rest Activity.'
      }
    },
    {
      key: 'fay',
      name: 'Fay',
      perk: {
        key: 'fayan_charm',
        name: 'Fayan Charm',
        description: 'Once per Rest, you can compel a person to tell the truth.'
      }
    },
    {
      key: 'halfling',
      name: 'Halfling',
      perk: {
        key: 'halfling_hospitality',
        name: 'Halfling Hospitality',
        description:
          'You and your companions get +1 advantage on Rest Activity rolls when resting in an Adventuring Camp.'
      }
    }
  ],
  classes: [
    {
      key: 'knight',
      name: 'Knight',
      attributeKey: 'strength',
      skillKey: 'chivalry',
      classItemLabel: 'Chivalrous Cape',
      classAbilities: [
        {
          key: 'martial_prowess',
          name: 'Martial Prowess',
          type: AbilityType.PASSIVE,
          description: 'You gain advantage equal to your Chivalry on all melee attacks.',
          requirement: 'INNATE'
        },
        {
          key: 'honorific_strike',
          name: 'Honorific Strike',
          type: AbilityType.BONUS_ACTION,
          description: 'You can make an additional melee attack.',
          requirement: 'INNATE'
        },
        {
          key: 'battle_charge',
          name: 'Battle Charge',
          type: AbilityType.PASSIVE,
          description: 'Your Movement Speed is doubled for the first round of combat.',
          requirement: 1
        },
        {
          key: 'kings_champion',
          name: "King's Champion",
          type: AbilityType.PASSIVE,
          description: 'You add `6D6` to your initiative roll.',
          requirement: 1,
          computed: {
            initiative: '[base] + 6'
          }
        },
        {
          key: 'domination',
          name: 'Domination',
          type: AbilityType.PASSIVE,
          description: 'You take only half damage from enemies that are Bloodied.',
          requirement: 6
        },
        {
          key: 'righteous_defense',
          name: 'Righteous Defense',
          type: AbilityType.PASSIVE,
          description:
            'While a member of your Adventuring Party is incapacitated, you double your Chivalry bonus on all melee attacks.',
          requirement: 6
        },
        {
          key: 'shield_bash',
          name: 'Shield Bash',
          type: AbilityType.BONUS_ACTION,
          description:
            'You can make a Chivalry check to bash a target within 5ft. On a success, the target takes `2D6` damage and is Stunned for 1 turn.',
          requirement: 12
        },
        {
          key: 'formal_decree',
          name: 'Formal Decree',
          type: AbilityType.MAIN_ACTION,
          description:
            "You can make a Chivalry check contested against an enemy's Fortitude to command them to stand down. On a success, they will not attack unless otherwise provoked.",
          requirement: 12
        },
        {
          key: 'indomitable_spirit',
          name: 'Indomitable Spirit',
          type: AbilityType.PASSIVE,
          description: 'While you are Bloodied, your attack damage is doubled.',
          requirement: 18
        },
        {
          key: 'honorable_duel',
          name: 'Honorable Duel',
          type: AbilityType.BONUS_ACTION,
          description:
            'You can make a Chivalry check to command an enemy to duel. On a success, they cannot make attacks on characters other than you. The duel ends if they are attacked by anyone other than you.',
          requirement: 18
        },
        {
          key: 'righteous_wrath',
          name: 'Righteous Wrath',
          type: AbilityType.BONUS_ACTION,
          description:
            'Once per rest, you can bolster yourself in combat with the righteousness of your cause. For two turns, your Movement Speed is doubled, all of your attacks instantly succeed, and your attack damage is doubled.',
          requirement: 24
        }
      ]
    },
    {
      key: 'barbarian',
      name: 'Barbarian',
      attributeKey: 'strength',
      skillKey: 'rage',
      classItemLabel: 'Tribal Marking',
      classAbilities: [
        {
          key: 'rampage',
          name: 'Rampage',
          type: AbilityType.BONUS_ACTION,
          description:
            'You can make a Rage check to throw a Very Heavy item within 5ft at an enemy within 20ft. On a success, the target is hit and takes `2D6` damage. Alternatively, you can make a Rage check to throw an enemy within 5ft at a tile within 10ft. On a success the target takes `2D6` damage and is knocked Prone.',
          requirement: 'INNATE'
        },
        {
          key: 'ready_to_rampage',
          name: 'Ready to Rampage',
          type: AbilityType.PASSIVE,
          description: 'You always start combat with a Very Heavy item within 5ft of you.',
          requirement: 1
        },
        {
          key: 'blood_rush',
          name: 'Blood Rush',
          type: AbilityType.PASSIVE,
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
          type: AbilityType.PASSIVE,
          description:
            'After an enemy is killed by you or an ally, your next attack deals double damage.',
          requirement: 6
        },
        {
          key: 'feral_instincts',
          name: 'Feral Instincts',
          type: AbilityType.REACTION,
          description:
            'When an enemy within 10ft moves away from you, you can make an attack against that enemy with advantage equal to your Rage.',
          requirement: 6
        },
        {
          key: 'reckless_attack',
          name: 'Reckless Attack',
          type: AbilityType.BONUS_ACTION,
          description:
            'You can make an additional melee attack with advantage equal to your Rage. Until your next turn, attacks on you have +2 advantage.',
          requirement: 12
        },
        {
          key: 'feral_presence',
          name: 'Feral Presence',
          type: AbilityType.PASSIVE,
          description:
            'When an enemy is within 15ft of you, they must make a Fortitude check at the beginning of each turn. On a failure, they become Frightened and have -2 disadvantage on attacks until their next turn.',
          requirement: 12
        },
        {
          key: 'reckless_beserker',
          name: 'Reckless Beserker',
          type: AbilityType.PASSIVE,
          description: 'When using Reckless Attack, your damage is doubled.',
          requirement: 18
        },
        {
          key: 'furious_rampage',
          name: 'Furious Rampage',
          type: AbilityType.PASSIVE,
          description: 'When using Rampage, your damage, reach, and range is doubled.',
          requirement: 18
        },
        {
          key: 'furious_frenzy',
          name: 'Furious Frenzy',
          type: AbilityType.BONUS_ACTION,
          description:
            'Once per rest, you can enter a combat frenzy. For two turns, all of your attacks instantly succeed and those you hit are Stunned for 1 turn.',
          requirement: 24
        }
      ]
    },
    {
      key: 'monk',
      name: 'Monk',
      attributeKey: 'dexterity',
      skillKey: 'chi',
      classItemLabel: 'Spiritual Talisman',
      classAbilities: [
        {
          key: 'chi_surge',
          name: 'Chi Surge',
          type: AbilityType.PASSIVE,
          description:
            'At any time, you can spend 1 CP to reroll an unsuccessful skill check. You cannot use Chi Surge twice on the same skill check.',
          requirement: 'INNATE'
        },
        {
          key: 'chi_deflection',
          name: 'Chi Deflection',
          type: AbilityType.REACTION,
          description:
            'When you are hit by an attack, you can roll a Chi check. On a success, you reduce the incoming damage by half.',
          requirement: 'INNATE'
        },
        {
          key: 'channel_chi',
          name: 'Channel Chi',
          type: AbilityType.REST_ACTIVITY,
          description: 'You find inner peace and regain all of your missing Chi Points.',
          requirement: 'INNATE'
        },
        {
          key: 'pacifist_pacing',
          name: 'Pacifist Pacing',
          type: AbilityType.PASSIVE,
          description:
            'Before you make your first attack in combat, your Movement Speed is doubled.',
          requirement: 1
        },
        {
          key: 'good_karma',
          name: 'Good Karma',
          type: AbilityType.PASSIVE,
          description:
            'Before you make your first attack in combat, all attacks against you have -3 disadvantage.',
          requirement: 1
        },
        {
          key: 'spirit_shield',
          name: 'Spirit Shield',
          type: AbilityType.REACTION,
          description:
            'After using Chi Deflection to deflect an attack, you can spend 1 CP to negate all incoming damage.',
          requirement: 6
        },
        {
          key: 'reflexive',
          name: 'Reflexive',
          type: AbilityType.PASSIVE,
          description: 'You gain a second Reaction during combat.',
          requirement: 6
        },
        {
          key: 'return_to_sender',
          name: 'Return to Sender',
          type: AbilityType.REACTION,
          description:
            'After using Chi Deflection to deflect an attack, you can spend 1 CP to deal the intended damage back on the attacker.',
          requirement: 12
        },
        {
          key: 'credence',
          name: 'Credence',
          type: AbilityType.PASSIVE,
          description:
            'If you roll an unsuccessful skill check with Chi Surge, you regain the lost Chi Point.',
          requirement: 12
        },
        {
          key: 'spirit_walk',
          name: 'Spirit Walk',
          type: AbilityType.BONUS_ACTION,
          description:
            'You can enter or leave the spirit plane. While in the spirit plane, you become intangible to all creatures in the physical plane.',
          requirement: 18
        },
        {
          key: 'chi_restoration',
          name: 'Chi Restoration',
          type: AbilityType.BONUS_ACTION,
          description:
            'You can roll a Chi check to stabilize an incapacitated character. On a success, spend 1 CP. The character is stabilized with the same number of HP as you currently have.',
          requirement: 18
        },
        {
          key: 'transcendence',
          name: 'Transcendence ',
          type: AbilityType.PASSIVE,
          description:
            "While in the spirit plane, you can make attacks against an enemy's spirit. These attacks deal half damage to the enemy in the physical.",
          requirement: 24
        }
      ],
      computed: {
        maxClassPoints: '[classItemBonus] * 2'
      }
    },
    {
      key: 'ranger',
      name: 'Ranger',
      attributeKey: 'dexterity',
      skillKey: 'survival',
      classItemLabel: 'Survival Toolkit',
      classAbilities: [
        {
          key: 'ranger_training',
          name: 'Ranger Training',
          type: AbilityType.PASSIVE,
          description:
            'You add your Survival bonus to your Movement Speed. When rolling Athletics or Agility to traverse natural obstacles, add your Survival Bonus.',
          requirement: 'INNATE',
          computed: {
            speed: '[base] + [classItemBonus]'
          }
        },
        {
          key: 'ranger_vision',
          name: 'Ranger Vision',
          type: AbilityType.PASSIVE,
          description:
            'When rolling Insight, Detection, or Investigation to inspect a natural area, add your Survival Bonus.',
          requirement: 'INNATE'
        },
        {
          key: 'survival_shelter',
          name: 'Survival Shelter',
          type: AbilityType.PASSIVE,
          description: 'You get the bonus of Simple Lodging when resting in an Adventuring Camp.',
          requirement: 1
        },
        {
          key: 'trapping_kit',
          name: 'Trapping Kit',
          type: AbilityType.REST_ACTIVITY,
          description:
            'You set traps in an area to catch small wild game. Roll a Survival check. On a success, you catch an animal worth two Adventuring Rations.',
          requirement: 1
        },
        {
          key: 'handcrafted_arrows',
          name: 'Handcrafted Arrows',
          type: AbilityType.PASSIVE,
          description:
            'When rolling Precision to attack with a bow, add your Survival bonus. Your attack damage with bows is increased by `1D6`.',
          requirement: 6
        },
        {
          key: 'camouflage',
          name: 'Camouflage',
          type: AbilityType.PASSIVE,
          description:
            'When you or your Adventuring Party roll Stealth to avoid being detected, add your Survival bonus.',
          requirement: 6
        },
        {
          key: 'speed_quiver',
          name: 'Speed Quiver',
          type: AbilityType.BONUS_ACTION,
          description: 'You can make an additional ranged attack with a bow.',
          requirement: 12
        },
        {
          key: 'healing_salve',
          name: 'Healing Salve',
          type: AbilityType.PASSIVE,
          description:
            'When rolling Medicine to stabilize an incapacitated character or heal an injured character during a Rest, add your Survival bonus.',
          requirement: 12
        },
        {
          key: 'poisoned_arrows',
          name: 'Poisoned Arrows',
          type: AbilityType.PASSIVE,
          description:
            'When you land an attack with a bow, the target becomes Poisoned. At the start of each turn, they take `2D6` damage.',
          requirement: 18
        },
        {
          key: 'smoke_bomb',
          name: 'Smoke Bomb',
          type: AbilityType.BONUS_ACTION,
          description:
            'You can throw a smoke bomb that effects a 20ft x 20ft area within 30ft. For 1 turn, this area becomes Rough Terrain, blocks all line of sight, and deals `2D6` damage per turn.',
          requirement: 18
        },
        {
          key: 'hunters_tonic',
          name: "Hunter's Tonic",
          type: AbilityType.BONUS_ACTION,
          description:
            'Once per rest, you can consume a special tonic to enhance your combat ability. For two turns, your Movement Speed is doubled and whenever you make an attack, you make two attacks instead.',
          requirement: 24
        }
      ]
    },
    {
      key: 'mage',
      name: 'Mage',
      attributeKey: 'intelligence',
      skillKey: 'magic',
      classItemLabel: 'Magical Channel',
      classAbilities: [
        {
          key: 'study_magic',
          name: 'Study Magic',
          type: AbilityType.REST_ACTIVITY,
          description:
            'You study and practice your magic, regaining all of your missing Magic Points.',
          requirement: 'INNATE'
        },
        {
          key: 'illusionist',
          name: 'Illusionist',
          type: AbilityType.BONUS_ACTION,
          description:
            'You can roll a Magic check to cast Murmur or Mimic. With Murmur, you can create a small sensory effect of an image, sound, or smell for 1 minute. With Mimic, you can spend 1 MP to disguise you or another character as someone else for 1 hour.',
          requirement: 'INNATE'
        },
        {
          key: 'pyromancer',
          name: 'Pyromancer',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to cast Fireball or Inferno. With Fireball, you can spend 1 MP to hit an enemy within 30ft with a ball of fire that deals `3D6` damage. With Inferno, you can spend 2 MP to fill a 15ft x 15ft area within 30ft with fire, dealing `3D6` damage to everyone inside.',
          requirement: 'INNATE'
        },
        {
          key: 'magical_eminence',
          name: 'Magical Eminence',
          type: AbilityType.PASSIVE,
          description:
            'All allies within 15ft of you get +1 advantage on attacks and deal an additional `1D6` damage.',
          requirement: 1
        },
        {
          key: 'magical_discharge',
          name: 'Magical Discharge',
          type: AbilityType.PASSIVE,
          description:
            'After consuming your last Magic Point, you can discharge your residual magic energy into a single attack. This attack deals an additional `1D6` damage for each Magic Point spent since your last Rest.',
          requirement: 1
        },
        {
          key: 'geomancer',
          name: 'Geomancer',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to cast Quicksand or Earthquake. With Quicksand, you can spend 2 MP to entrap a target within 30ft, dealing `6D6` damage and knocking them Prone. With Earthquake, you can spend 3 MP to shake the ground in a 15ft x 15ft area within 30ft, causing all enemies within the area to become Stunned for 1 turn.',
          requirement: 6
        },
        {
          key: 'war_mage',
          name: 'War Mage',
          type: AbilityType.PASSIVE,
          description: 'You can cast any spell that requires a Main Action as a Bonus Action.',
          requirement: 6
        },
        {
          key: 'protectorate',
          name: 'Protectorate',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to cast Magic Armor or Shield Ward. With Magic Armor, you can spend 3 MP to surround a character with magical heavy armor for 1 minute (this stacks with physical armor). With Shield Ward, you can spend 4 MP to shield you and your allies from all damage for 1 turn.',
          requirement: 12
        },
        {
          key: 'magic_shield',
          name: 'Magic Shield',
          type: AbilityType.REACTION,
          description:
            'When you or another character is hit by an attack, you can spend 1 MP to reduce the incoming damage by `3D6`.',
          requirement: 12
        },
        {
          key: 'necromancer',
          name: 'Necromancer',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to cast Life Steal or Resurrection. With Life Steal, you can spend 4 MP to sap the life force from a target within 10ft. The target takes `6D6` damage and you heal `6D6` health points. With Resurrection, you can spend 5 MP and 64 Valerian Pieces to resurrect a character that has been dead for less than 24 hours. The resurrected character returns to life with 1 HP.',
          requirement: 18
        },
        {
          key: 'magical_recharge',
          name: 'Magical Recharge',
          type: AbilityType.PASSIVE,
          description: 'Once per Rest, you can recharge half of your maximum Magic Points.',
          requirement: 18
        },
        {
          key: 'chronomancer',
          name: 'Chronomancer',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can roll a Magic check to cast Time Slow or Time Stop. With Time Slow, you can spend 5 MP to slow time for 2 turns. While time is slowed, all allies gain an additional Main Action and double their Movement Speed. With Time Stop, you can spend 6 MP to stop time for 2 turns. While time is stopped, all enemies forgo movement, actions, or reactions and attacks against them have +3 advantage.',
          requirement: 24
        }
      ],
      computed: {
        maxClassPoints: '[classItemBonus] * 5'
      }
    },
    {
      key: 'mancer',
      name: 'Mancer',
      attributeKey: 'intelligence',
      skillKey: 'magichanics',
      classItemLabel: 'Portable Workshop',
      classAbilities: [
        {
          key: 'experiment',
          name: 'Experiment',
          type: AbilityType.REST_ACTIVITY,
          description:
            'You experiment with your magichanical inventions. Roll a Magichanics check. On a success, you gain 2 MP. On a stalemate, you gain 1 MP.',
          requirement: 'INNATE'
        },
        {
          key: 'blessed_blunderbuss',
          name: 'Blessed Blunderbuss',
          type: AbilityType.PASSIVE,
          description: 'During a Rest, you can spend 1 MP to build a Blessed Blunderbuss.',
          requirement: 'INNATE'
        },
        {
          key: 'arcane_aegis_armor',
          name: 'Arcane Aegis Armor',
          type: AbilityType.PASSIVE,
          description: 'During a Rest, you can spend 2 MP to build a set of Arcane Aegis Armor.',
          requirement: 'INNATE'
        },
        {
          key: 'mad_scientist',
          name: 'Mad Scientist',
          type: AbilityType.PASSIVE,
          description: 'When using Magichanical Experimentation, you gain 1 MP even on a failure.',
          requirement: 1
        },
        {
          key: 'recycled_materials',
          name: 'Recycled Materials',
          type: AbilityType.PASSIVE,
          description: 'All magichanical inventions cost 1 MP less (to a minimum of 1).',
          requirement: 1
        },
        {
          key: 'frost_flintlock',
          name: 'Frost Flintlock',
          type: AbilityType.PASSIVE,
          description: 'During a Rest, you can spend 3 MP to build a Frost Flintlock.',
          requirement: 6
        },
        {
          key: 'mystic_mail_armor',
          name: 'Mystic Mail Armor',
          type: AbilityType.PASSIVE,
          description: 'During a Rest, you can spend 4 MP to build a set of Mystic Mail Armor.',
          requirement: 6
        },
        {
          key: 'radiant_revolver',
          name: 'Radiant Revolver',
          type: AbilityType.PASSIVE,
          description: 'During a Rest, you can spend 5 MP to build a Radiant Revolver.',
          requirement: 12
        },
        {
          key: 'eldritch_exo_armor',
          name: 'Eldritch Exo Armor',
          type: AbilityType.PASSIVE,
          description: 'During a Rest, you can spend 6 MP to build a set of Eldritch Exo Armor.',
          requirement: 12
        },
        {
          key: 'resonant_repeater',
          name: 'Resonant Repeater',
          type: AbilityType.PASSIVE,
          description: 'During a Rest, you can spend 7 MP to build a Resonant Repeater.',
          requirement: 18
        },
        {
          key: 'mystic_masterkey',
          name: 'Mystic Masterkey',
          type: AbilityType.PASSIVE,
          description: 'During a Rest, you can spend 8 MP to build a Mystic Masterkey.',
          requirement: 18
        },
        {
          key: 'hexed_cartridges',
          name: 'Hexed Cartridges',
          type: AbilityType.PASSIVE,
          description: 'Your attack damage is doubled when using a magichanical weapon.',
          requirement: 24
        }
      ],
      computed: {
        maxClassPoints: '[classItemBonus] * 2'
      }
    },
    {
      key: 'herald',
      name: 'Herald',
      attributeKey: 'charisma',
      skillKey: 'inspiration',
      classItemLabel: 'Beacon of Inspiration',
      classAbilities: [
        {
          key: 'inspirational_nature',
          name: 'Inspirational Nature',
          type: AbilityType.PASSIVE,
          description: 'You regain all of your missing Inspiration Points after a Rest.',
          requirement: 'INNATE'
        },
        {
          key: 'inspire_ally',
          name: 'Inspire Ally',
          type: AbilityType.REACTION,
          description:
            'When an ally rolls an unsuccessful skill check, you can make an Inspiration check to allow them to reroll. On a success, the ally rerolls with advantage equal to the number of IP spent (minimum 1). On a stalemate or failure, the ally keeps their roll.',
          requirement: 'INNATE'
        },
        {
          key: 'inhibit_enemy',
          name: 'Inhibit Enemy',
          type: AbilityType.REACTION,
          description:
            'When an enemy rolls a successful skill check, you can make an Inspiration check to force them to reroll. On a success, the enemy must reroll with disadvantage equal to the number of IP spent (minimum 1). On a stalemate, the enemy keeps their roll. On a failure, the enemy keeps their roll and you expend 1 IP.',
          requirement: 'INNATE'
        },
        {
          key: 'whisper',
          name: 'Whisper',
          type: AbilityType.PASSIVE,
          description: 'You go unnoticed when using Inspire Ally or Inhibit Enemy.',
          requirement: 1
        },
        {
          key: 'captivating_speech',
          name: 'Captivating Speech',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can roll an Inspiration check to captivate a group of people with a speech. On a success, spend 3 IP. All characters within 60ft are captivated by your speech, giving you and your allies advantage on Influence and Stealth checks made against them equal to your Inspiration.',
          requirement: 1
        },
        {
          key: 'combat_guidance',
          name: 'Combat Guidance',
          type: AbilityType.PASSIVE,
          description:
            'When you using Inspire Ally to make an ally succeed on an attack roll, they deal an additional `1D6` damage for each IP that had been spent.',
          requirement: 6
        },
        {
          key: 'commander',
          name: 'Commander',
          type: AbilityType.PASSIVE,
          description: 'You gain a second Reaction during combat.',
          requirement: 6
        },
        {
          key: 'rallying_cry',
          name: 'Rallying Cry',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can make an Inspiration check to rally your allies in combat. On a success, you spend IP equal to the number of allies rallied. For 3 turns, all allies gain +1 advantage on attacks and deal an additional `1D6` damage.',
          requirement: 12
        },
        {
          key: 'charming_presence',
          name: 'Charming Presence',
          type: AbilityType.BONUS_ACTION,
          description:
            'You can roll an Inspiration check to charm those around you with your presence. On a success, spend 6 IP. All characters within 10ft become charmed by your presence, compelling them to obey any simple commands that do not harm themselves or others.',
          requirement: 12
        },
        {
          key: 'psychological_warfare',
          name: 'Psychological Warfare',
          type: AbilityType.PASSIVE,
          description:
            'When you use Inhibit Enemy to make an enemy fail on an attack roll, they take `1D6` damage for each IP that had been spent.',
          requirement: 18
        },
        {
          key: 'student_of_life',
          name: 'Student of Life',
          type: AbilityType.PASSIVE,
          description:
            'When your use Inspire Ally or Inhibit Enemy and fail to have an effect, gain 2 Inspiration Points.',
          requirement: 18
        },
        {
          key: 'turncoat',
          name: 'Turncoat',
          type: AbilityType.MAIN_ACTION,
          description:
            "You can make an Inspiration check contested against an enemy's Intuition to convince them to join your cause. On a success, you spend IP equal to the enemy's level and they change sides until the end of combat.",
          requirement: 24
        }
      ],
      computed: {
        maxClassPoints: '[classItemBonus] * 6'
      }
    },
    {
      key: 'enchanter',
      name: 'Enchanter',
      attributeKey: 'charisma',
      skillKey: 'enchantment',
      classItemLabel: 'Enchantment Charm',
      classAbilities: [
        {
          key: 'deep_meditation',
          name: 'Deep Meditation',
          type: AbilityType.PASSIVE,
          description: 'You regain all of your missing Enchantment Points after a Rest.',
          requirement: 'INNATE'
        },
        {
          key: 'enchantment_of_hallucination',
          name: 'Enchantment of Hallucination',
          type: AbilityType.BONUS_ACTION,
          description:
            "You can make an Enchantment check to enchant a target within 60ft with hallucinations. On a success, the target sees, smells, or hears something that isn't there for 1 minute.",
          requirement: 'INNATE'
        },
        {
          key: 'enchantment_of_pain',
          name: 'Enchantment of Pain',
          type: AbilityType.BONUS_ACTION,
          description:
            'You can make an Enchantment check to enchant a target within 30ft with psychological pain. On a success, spend 1 EP. The target takes `2D6` damage.',
          requirement: 'INNATE'
        },
        {
          key: 'enthralling_aura',
          name: 'Enthralling Aura',
          type: AbilityType.PASSIVE,
          description: 'You automatically succeed on enchanting a target within 15ft of you.',
          requirement: 1
        },
        {
          key: 'painful_memories',
          name: 'Painful Memories',
          type: AbilityType.PASSIVE,
          description: 'You double the damage inflicted by all class abilities.',
          requirement: 1
        },
        {
          key: 'enchantment_of_fear',
          name: 'Enchantment of Fear',
          type: AbilityType.BONUS_ACTION,
          description:
            'You can make an Enchantment check to enchant a target within 30ft with harrowing fear. On a success, spend 2 EP. On their next turn, the target must use their Movement Speed to move as far away from you as possible.',
          requirement: 6
        },
        {
          key: 'mind_fog',
          name: 'Mind Fog',
          type: AbilityType.PASSIVE,
          description:
            'When you use an enchantment, you can target a 15ft x 15ft area instead of an enemy. All enemies within this area suffer the effect of your enchantment.',
          requirement: 6
        },
        {
          key: 'enchantment_of_confusion',
          name: 'Enchantment of Confusion',
          type: AbilityType.BONUS_ACTION,
          description:
            'You can make an Enchantment check to enchant a target within 30ft with confusion. On a success, spend 3 EP. The target becomes Stunned for 1 turn.',
          requirement: 12
        },
        {
          key: 'mental_attunement',
          name: 'Mental Attunement',
          type: AbilityType.PASSIVE,
          description: 'When you enchant a target, you can read their surface-level thoughts.',
          requirement: 12
        },
        {
          key: 'enchantment_of_mind_control',
          name: 'Enchantment of Mind Control',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can make an Enchantment check to enchant a target within 30ft to submit to your will. On a success, spend 4 EP. You can force the target to move up to 15ft and carry out one Main Action of your choosing.',
          requirement: 18
        },
        {
          key: 'enchanters_cant',
          name: "Enchanter's Cant",
          type: AbilityType.BONUS_ACTION,
          description:
            'You can make an Enchantment check to speak an ancient cant against the last 3 targets you enchanted. On a success, spend 3 EP. All targets take `2D6` damage.',
          requirement: 18
        },
        {
          key: 'enchantment_of_death',
          name: 'Enchantment of Death',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can make an Enchantment check to enchant a target within 30ft with deathly psychological pain. On a success, spend 5 EP. Until they are dead, the target takes `3D6` damage at the beginning of each turn.',
          requirement: 24
        }
      ],
      computed: {
        maxClassPoints: '[classItemBonus] * 3'
      }
    },
    {
      key: 'sage',
      name: 'Sage',
      attributeKey: 'perception',
      skillKey: 'nature',
      classItemLabel: 'Ritual Totem',
      classAbilities: [
        {
          key: 'ritual_of_guidance',
          name: 'Ritual of Guidance',
          type: AbilityType.REST_ACTIVITY,
          description:
            'You can roll a Nature check to cast a ritual for nature to guide you on your journey. You regain all of your missing Nature Points. On a success, you choose one guided attribute. Until your next Rest, all skill checks under this attribute have advantage equal to your Nature bonus.',
          requirement: 'INNATE'
        },
        {
          key: 'glancing_wind',
          name: 'Glancing Wind',
          type: AbilityType.REACTION,
          description:
            'When you or an ally within 60ft are hit by an attack, you can roll a Nature check. On a success, spend 1 NP. All incoming damage is negated.',
          requirement: 'INNATE'
        },
        {
          key: 'gust_of_wind',
          name: 'Gust of Wind',
          type: AbilityType.PASSIVE,
          description: 'You add your Nature bonus to your Movement Speed.',
          requirement: 1,
          computed: {
            speed: '[base] + [classItemBonus]'
          }
        },
        {
          key: 'stone_skin',
          name: 'Stone Skin',
          type: AbilityType.PASSIVE,
          description: 'Your Difficulty Threshold to be hit by an attack is increased by 3.',
          requirement: 1
        },
        {
          key: 'solar_smite',
          name: 'Solar Smite',
          type: AbilityType.PASSIVE,
          description:
            "While attacking with nature's guidance, your attack damage is increased by `2D6`.",
          requirement: 6
        },
        {
          key: 'impromptu_ritual',
          name: 'Impromptu Ritual',
          type: AbilityType.MAIN_ACTION,
          description:
            'Once per Rest, you can change the guided attribute of an ongoing Ritual of Guidance.',
          requirement: 6
        },
        {
          key: 'lightning_storm',
          name: 'Lightning Storm',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can roll a Nature check to strike up to 3 targets within 120ft with lightning. On a success, spend 2 NP. Each lightning bolt deals `5D6` damage.',
          requirement: 12
        },
        {
          key: 'natures_blessing',
          name: "Nature's Blessing",
          type: AbilityType.PASSIVE,
          description:
            'When you are incapacitated, you can roll a Nature check to determine if nature intervenes. On a success, spend 2 NP. Instead of being incapacitated, you are reduced to 1 health point.',
          requirement: 12
        },
        {
          key: 'freezing_strike',
          name: 'Freezing Strike',
          type: AbilityType.PASSIVE,
          description:
            "While attacking with nature's guidance, you can roll a Nature check to freeze the target. On a success, the target becomes Stunned for 1 turn.",
          requirement: 18
        },
        {
          key: 'chaotic_recharge',
          name: 'Chaotic Recharge',
          type: AbilityType.PASSIVE,
          description:
            "When you are unsuccessful on a roll with nature's guidance, you regain 1 Nature Point.",
          requirement: 18
        },
        {
          key: 'blizzard',
          name: 'Blizzard',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can roll a Nature check to strike up to 3 targets within 120ft with a freezing blizzard. On a success, spend 4 NP. Each target becomes Stunned for 1 turn.',
          requirement: 24
        }
      ],
      computed: {
        maxClassPoints: '[classItemBonus] * 2'
      }
    },
    {
      key: 'druid',
      name: 'Druid',
      attributeKey: 'perception',
      skillKey: 'beast',
      classItemLabel: 'Tamed Beast',
      classAbilities: [
        {
          key: 'foster_companionship',
          name: 'Foster Companionship',
          type: AbilityType.REST_ACTIVITY,
          description:
            'You foster companionship with your Tamed Beast and regain all of your missing Beast Points. You can optionally adopt a new Tamed Beast.',
          requirement: 'INNATE'
        },
        {
          key: 'command_tamed_beast',
          name: 'Command Tamed Beast',
          type: AbilityType.BONUS_ACTION,
          description:
            'You can roll a Beast check to command your Tamed Beast to attack a target or perform an object interaction within range. Small beasts have a range of 60ft and deal `1D6` damage. Medium beasts have a range of 30ft and deal `2D6` damage. Large beasts have a range of 15ft and deal `3D6` damage.',
          requirement: 'INNATE'
        },
        {
          key: 'summon_eagle',
          name: 'Summon Eagle',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can roll a Beast check to summon an eagle to attack a target within 120ft. On a success, spend 1 BP. The target takes `4D6` damage.',
          requirement: 'INNATE'
        },
        {
          key: 'beast_speech',
          name: 'Beast Speech',
          type: AbilityType.PASSIVE,
          description:
            "You can communicate with nature's beasts through their unique visual and auditory cues. Communication is effectively limited to basic one-word messages.",
          requirement: 1
        },
        {
          key: 'guard_beast',
          name: 'Guard Beast',
          type: AbilityType.REACTION,
          description:
            'When you are hit by a melee attack, you can roll a Beast check to have your Tamed Beast protect you. On a success, you reduce the incoming damage by half.',
          requirement: 1
        },
        {
          key: 'summon_wolves',
          name: 'Summon Wolves',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can roll a Beast check to summon a pack of wolves to attack up to 3 targets within 60ft. On a success, spend 2 BP. Each target takes `3D6` damage.',
          requirement: 6
        },
        {
          key: 'beast_shape',
          name: 'Beast Shape',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can spend 1 BP to transform into the same form as your Tamed Beast for up to 1 hour. While transformed, you share the same speed and attack damage as your Tamed Beast.',
          requirement: 6
        },
        {
          key: 'summon_bear',
          name: 'Summon Bear',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can roll a Beast check to summon a bear to attack a target within 30ft. On a success, spend 3 BP. The target takes `12D6` damage and becomes Crippled.',
          requirement: 12
        },
        {
          key: 'elder_beast',
          name: 'Elder Beast',
          type: AbilityType.PASSIVE,
          description:
            'Your Tamed Beast grows into a giant version of itself. It now deals twice the amount of damage.',
          requirement: 12
        },
        {
          key: 'summon_panther',
          name: 'Summon Panther',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can roll a Beast check to summon a panther to attack a target within 60ft. On a success, spend 4 BP. The target takes `16D6` damage and becomes Stunned for 1 turn.',
          requirement: 18
        },
        {
          key: 'enhanced_beast_shape',
          name: 'Enhanced Beast Shape',
          type: AbilityType.PASSIVE,
          description:
            'When using Beast Shape, you can transform into any small, medium, or large creature and the transformation lasts up to 24 hours.',
          requirement: 18
        },
        {
          key: 'summon_behemoth',
          name: 'Summon Behemoth',
          type: AbilityType.MAIN_ACTION,
          description:
            'You can roll a Beast check to summon a behemoth to attack a 15ft x 15ft area within 30ft. On a success, spend 5 BP. All targets within the area takes `10D6` damage and are knocked Prone.',
          requirement: 24
        }
      ],
      computed: {
        maxClassPoints: '[classItemBonus]'
      }
    }
  ],
  items: [
    {
      key: 'currency',
      name: 'Valerian Pieces',
      cost: '',
      weight: 1 / 20
    },
    {
      key: 'improvised_melee_weapon',
      type: ItemType.WEAPON,
      name: 'Improvised Melee Weapon',
      cost: 'FREE',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 1
      },
      damage: 1,
      notes: '5ft range'
    },
    {
      key: 'improvised_ranged_weapon',
      type: ItemType.WEAPON,
      name: 'Improvised Ranged Weapon',
      cost: 'FREE',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 1
      },
      damage: 1,
      notes: '15ft range'
    },
    {
      key: 'dagger',
      type: ItemType.WEAPON,
      name: 'Dagger',
      cost: '8 VP',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 1
      },
      damage: 3,
      notes: '5ft range'
    },
    {
      key: 'shortsword',
      type: ItemType.WEAPON,
      name: 'Shortsword',
      cost: '16 VP',
      weight: 1,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 1
      },
      damage: 4,
      notes: '5ft range'
    },
    {
      key: 'longsword',
      type: ItemType.WEAPON,
      name: 'Longsword',
      cost: '32 VP',
      weight: 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 2
      },
      damage: 5,
      notes: '5ft range'
    },
    {
      key: 'greatsword',
      type: ItemType.WEAPON,
      name: 'Greatsword',
      cost: '64 VP',
      weight: 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 3
      },
      damage: 6,
      notes: '5ft range'
    },
    {
      key: 'handaxe',
      type: ItemType.WEAPON,
      name: 'Handaxe',
      cost: '8 VP',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 0
      },
      damage: 4,
      notes: '5ft range'
    },
    {
      key: 'waraxe',
      type: ItemType.WEAPON,
      name: 'Waraxe',
      cost: '16 VP',
      weight: 1,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 0
      },
      damage: 5,
      notes: '5ft range'
    },
    {
      key: 'battleaxe',
      type: ItemType.WEAPON,
      name: 'Battleaxe',
      cost: '32 VP',
      weight: 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 1
      },
      damage: 6,
      notes: '5ft range'
    },
    {
      key: 'greataxe',
      type: ItemType.WEAPON,
      name: 'Greataxe',
      cost: '64 VP',
      weight: 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 2
      },
      damage: 7,
      notes: '5ft range'
    },
    {
      key: 'quarterstaff',
      type: ItemType.WEAPON,
      name: 'Quarterstaff',
      cost: '8 VP',
      weight: 1,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 1
      },
      damage: 2,
      notes: '10ft range'
    },
    {
      key: 'pike',
      type: ItemType.WEAPON,
      name: 'Pike',
      cost: '16 VP',
      weight: 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 1
      },
      damage: 3,
      notes: '10ft range'
    },
    {
      key: 'halberd',
      type: ItemType.WEAPON,
      name: 'Halberd',
      cost: '32 VP',
      weight: 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 2
      },
      damage: 4,
      notes: '10ft range'
    },
    {
      key: 'glaive',
      type: ItemType.WEAPON,
      name: 'Glaive',
      cost: '64 VP',
      weight: 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 3
      },
      damage: 5,
      notes: '10ft range'
    },
    {
      key: 'slingshot',
      type: ItemType.WEAPON,
      name: 'Slingshot',
      cost: '8 VP',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 1
      },
      damage: 2,
      notes: '10ft - 30ft range'
    },
    {
      key: 'shortbow',
      type: ItemType.WEAPON,
      name: 'Shortbow',
      cost: '16 VP',
      weight: 1,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 1
      },
      damage: 3,
      notes: '10ft - 90ft range'
    },
    {
      key: 'crossbow',
      type: ItemType.WEAPON,
      name: 'Crossbow',
      cost: '32 VP',
      weight: 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 2
      },
      damage: 4,
      notes: '10ft - 60ft range'
    },
    {
      key: 'longbow',
      type: ItemType.WEAPON,
      name: 'Longbow',
      cost: '64 VP',
      weight: 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 3
      },
      damage: 5,
      notes: '20ft - 120ft range'
    },
    {
      key: 'blessed_blunderbuss',
      type: ItemType.WEAPON,
      name: 'Blessed Blunderbuss',
      cost: '16 VP',
      weight: 1,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 2
      },
      damage: 3,
      notes: '15ft range'
    },
    {
      key: 'frost_flintlock',
      type: ItemType.WEAPON,
      name: 'Frost Flintlock',
      cost: '32 VP',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 2
      },
      damage: 4,
      notes: '30ft range'
    },
    {
      key: 'radiant_revolver',
      type: ItemType.WEAPON,
      name: 'Radiant Revolver',
      cost: '64 VP',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 3
      },
      damage: 5,
      notes: '60ft range'
    },
    {
      key: 'resonant_repeater',
      type: ItemType.WEAPON,
      name: 'Resonant Repeater',
      cost: '128 VP',
      weight: 1,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 4
      },
      damage: 6,
      notes: '90ft range'
    },
    {
      key: 'shadowstrider',
      type: ItemType.WEAPON,
      name: 'Shadowstrider',
      cost: '32 VP',
      weight: 1,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 2
      },
      damage: 4,
      notes:
        '5ft range, [Shadow Step=Once per Rest, the wielder can use a Bonus Action to enter the shadow plane. While in the shadow plane, the wielder becomes intangible to all objects and creatures in the physical plane.]'
    },
    {
      key: 'bogs_blessing',
      type: ItemType.WEAPON,
      name: "Bog's Blessing",
      cost: '16 VP',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 2
      },
      damage: 2,
      notes:
        '10ft - 30ft range, [Binding Bog=Once per Rest, the wielder can fire a special mud projectile. Upon impact, the projectile creates a mud-filled area in a 10ft radius and all creatures within the area are knocked Prone. This area is considered Difficult Terrain and restrains all creatures. A DT 14 Athletics check is required to free oneself.]'
    },
    {
      key: 'Whisperwood',
      type: ItemType.WEAPON,
      name: 'Whisperwood',
      cost: '32 VP',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 2
      },
      damage: 3,
      notes:
        '10ft range, [Wind Whisper=The wielder can focus to hear sounds from 100ft away.] [Wind Gust=Once per Rest, the wielder can fade into the breeze, silently teleporting up to 60 feet away.]'
    },
    {
      key: 'leather_armor',
      type: ItemType.ARMOR,
      name: 'Leather Armor',
      cost: '16 VP',
      weight: 1,
      notes: 'DT 8, 1D6 deflection'
    },
    {
      key: 'chainmail_armor',
      type: ItemType.ARMOR,
      name: 'Chainmail Armor',
      cost: '32 VP',
      weight: 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'stealth',
        skillBonus: -1
      },
      notes: 'DT 8, 2D6 deflection'
    },
    {
      key: 'plate_armor',
      type: ItemType.ARMOR,
      name: 'Plate Armor',
      cost: '64 VP',
      weight: 4,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'stealth',
        skillBonus: -2
      },
      notes: 'DT 8, 3D6 deflection'
    },
    {
      key: 'arcane_aegis_armor',
      type: ItemType.ARMOR,
      name: 'Arcane Aegis Armor',
      cost: '16 VP',
      weight: 1 / 2,
      notes: 'DT 8, 1D6 deflection'
    },
    {
      key: 'mystic_mail_armor',
      type: ItemType.ARMOR,
      name: 'Mystic Mail Armor',
      cost: '32 VP',
      weight: 1,
      notes: 'DT 8, 2D6 deflection'
    },
    {
      key: 'eldritch_exo_armor',
      type: ItemType.ARMOR,
      name: 'Eldritch Exo Armor',
      cost: '64 VP',
      weight: 2,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'stealth',
        skillBonus: -1
      },
      notes: 'DT 8, 3D6 deflection'
    },
    {
      key: 'cloak_of_billowing',
      type: ItemType.ARMOR,
      name: 'Cloak of Billowing',
      cost: '128 VP',
      weight: 1 / 4,
      notes:
        'When falling, this cloak automatically billows, letting the wearer control their descent safely and silently, negating all fall damage.'
    },
    {
      key: 'goggles_of_true_sight',
      type: ItemType.ARMOR,
      name: 'Goggles of True Sight',
      cost: '128 VP',
      weight: 1 / 4,
      notes:
        'Once per Rest, these goggles can be activated to gain True Sight for 10 minutes. While active, the wearer can see any creature within 60ft, even if it is obscured by darkness, obstructions, or magic.'
    },
    {
      key: 'world_map',
      type: ItemType.TOOL,
      name: 'World Map',
      cost: '8 VP',
      weight: 1 / 4,
      bonus: {
        attributeKey: 'perception',
        skillKey: 'insight',
        skillBonus: 1
      }
    },
    {
      key: 'local_map',
      type: ItemType.TOOL,
      name: 'Local Map',
      cost: '16 VP',
      weight: 1 / 4,
      bonus: {
        attributeKey: 'perception',
        skillKey: 'insight',
        skillBonus: 2
      }
    },
    {
      key: 'rope',
      type: ItemType.TOOL,
      name: 'Rope',
      cost: '8 VP',
      weight: 1,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'athletics',
        skillBonus: 1
      }
    },
    {
      key: 'rope_and_grappling_hook',
      type: ItemType.TOOL,
      name: 'Rope and Grappling Hook',
      cost: '16 VP',
      weight: 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'athletics',
        skillBonus: 2
      }
    },
    {
      key: 'medical_pouch',
      type: ItemType.TOOL,
      name: 'Medical Pouch',
      cost: '16 VP',
      weight: 1 / 2,
      bonus: {
        attributeKey: 'intelligence',
        skillKey: 'medicine',
        skillBonus: 1
      }
    },
    {
      key: 'battering_ram',
      type: ItemType.TOOL,
      name: 'Battering Ram',
      cost: '16 VP',
      weight: 2,
      bonus: {
        attributeKey: 'strength',
        skillKey: 'power',
        skillBonus: 1
      }
    },
    {
      key: 'lock_picking_set',
      type: ItemType.TOOL,
      name: 'Lock Picking Set',
      cost: '16 VP',
      weight: 1 / 4,
      bonus: {
        attributeKey: 'dexterity',
        skillKey: 'precision',
        skillBonus: 1
      }
    },
    {
      key: 'mystic_masterkey',
      type: ItemType.TOOL,
      name: 'Mystic Masterkey',
      cost: '128 VP',
      weight: 1 / 4,
      notes: 'Instantly opens any locked door'
    },
    {
      key: 'adventuring_ration',
      type: ItemType.MEAL,
      name: 'Adventuring Ration',
      cost: '2 VP',
      weight: 1 / 4,
      notes: 'Satiates a character for 1 Rest'
    },
    {
      key: 'simple_meal',
      type: ItemType.MEAL,
      name: 'Simple Meal',
      cost: '4 VP',
      notes: 'Satiates a character for 2 Rests'
    },
    {
      key: 'fancy_meal',
      type: ItemType.MEAL,
      name: 'Fancy Meal',
      cost: '8 VP',
      notes: 'Satiates a character for 4 Rests'
    },
    {
      key: 'adventuring_camp',
      type: ItemType.LODGING,
      name: 'Adventuring Camp',
      cost: 'FREE',
      notes: 'A cold place to sleep'
    },
    {
      key: 'simple_lodging',
      type: ItemType.LODGING,
      name: 'Simple Lodging',
      cost: '8 VP',
      notes: 'A warm place to sleep, +2 to Rest Activity rolls'
    },
    {
      key: 'fancy_lodging',
      type: ItemType.LODGING,
      name: 'Fancy Lodging',
      cost: '16 VP',
      notes: 'A warm and safe place to sleep, +3 to Rest Activity rolls'
    },
    {
      key: 'donkey',
      type: ItemType.VEHICLE,
      name: 'Donkey',
      cost: '16 VP',
      notes:
        'A donkey can carry one character and has a movement speed of 3 miles per hour or 24 miles per day. In place of a character, a donkey can carry 40 slots worth of items.'
    },
    {
      key: 'horse',
      type: ItemType.VEHICLE,
      name: 'Horse',
      cost: '32 VP',
      notes:
        'A horse can carry two characters and has a movement speed of 6 miles per hour or 48 miles per day. In place of a character, a horse can carry 40 slots worth of items.'
    },
    {
      key: 'carriage',
      type: ItemType.VEHICLE,
      name: 'Carriage',
      cost: '64 VP',
      notes:
        'A carriage with two horses can carry six characters and has a movement speed of 6 miles per hour or 48 miles per day. In place of a character, a carriage can carry 40 slots worth of items.'
    }
  ],
  combatants: [
    {
      key: 'commoner',
      name: 'Commoner',
      description: 'A citizen of the Vale.',
      level: 1,
      attributes: {
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        charisma: 0,
        perception: 0
      },
      abilities: [],
      itemQuantities: []
    },
    {
      key: 'brineling',
      name: 'Huskling',
      description:
        'A host that has been recently infected by the Brine. They still maintain some autonomy and memory, but are slowly losing it to become a Husk.',
      affiliation: 'The Brine',
      level: 2,
      attributes: {
        strength: 1,
        dexterity: 0,
        intelligence: 0,
        charisma: 0,
        perception: -1
      },
      abilities: [],
      itemQuantities: []
    },
    {
      key: 'wolf',
      name: 'Wolf',
      description: 'A wild wolf that hunts for food and defends its pack from threats.',
      level: 3,
      attributes: {
        strength: 0,
        dexterity: 2,
        intelligence: -2,
        charisma: -1,
        perception: 1
      },
      itemQuantities: [],
      abilities: [
        {
          key: 'bite',
          type: AbilityType.MAIN_ACTION,
          name: 'Bite',
          description:
            'You can roll a Power check to bite a target within 5ft. On a success, the target takes `1D6` damage.'
        },
        {
          key: 'maul',
          type: AbilityType.BONUS_ACTION,
          name: 'Maul',
          description:
            'You can roll a Precision check to maul a target within 5ft. On a success, the target takes `1D6` damage.'
        },
        {
          key: 'spread_the_brine',
          type: AbilityType.MAIN_ACTION,
          name: 'Spread the Brine',
          description:
            "While you have a target grappled, you can roll a Power check against the target's Fortitude to infect them. If you succeed, roll `1D6`. This is the number of turns before the infection permanently takes hold. A successful Medicine check is required to prevent the infection on the target."
        }
      ]
    },
    {
      key: 'husk',
      name: 'Husk',
      description:
        'Basic hosts that make up the bulk of the Brine. They infiltrate communities, infect new hosts, and follow orders from Conduits.',
      affiliation: 'The Brine',
      level: 4,
      attributes: {
        strength: 2,
        dexterity: 0,
        intelligence: 0,
        charisma: 0,
        perception: -1
      },
      abilities: [
        {
          key: 'brine_blade',
          type: AbilityType.MAIN_ACTION,
          name: 'Brine Blade',
          description:
            'Your arm transforms into a blade made of algae. You can roll a Power check to hit a target within 5ft. On a success, the target takes `2D6` damage.'
        },
        {
          key: 'spread_the_brine',
          type: AbilityType.MAIN_ACTION,
          name: 'Spread the Brine',
          description:
            "While you have a target grappled, you can roll a Power check against the target's Fortitude to infect them. If you succeed, roll `1D6`. This is the number of turns before the infection permanently takes hold. A successful Medicine check is required to prevent the infection on the target."
        }
      ],
      itemQuantities: []
    },
    {
      key: 'crazed_commoner',
      name: 'Crazed Commoner',
      description:
        'A citizen of the Vale crazed into mania, usually wielding a stick, shovel, or other blunt object.',
      level: 5,
      attributes: {
        strength: 2,
        dexterity: 1,
        intelligence: 0,
        charisma: -2,
        perception: 0
      },
      abilities: [
        {
          key: 'headbutt',
          type: AbilityType.BONUS_ACTION,
          name: 'Headbutt',
          description:
            'You can roll a contested Fortitude check to headbutt a target within 5ft. The loser of the contested skill check takes `1D6` damage.'
        }
      ],
      itemQuantities: [
        {
          key: 'quarterstaff',
          quantity: 1
        }
      ]
    },
    {
      key: 'ghast',
      name: 'Ghast',
      description: 'An evil spirit who uses apparitions to deceive its victims.',
      level: 6,
      attributes: {
        strength: 1,
        dexterity: 0,
        intelligence: -1,
        charisma: 2,
        perception: -1
      },
      abilities: [
        {
          key: 'incorporeal',
          type: AbilityType.PASSIVE,
          name: 'Incorporeal',
          description:
            'You can pass through solid objects, including walls, floors, and creatures. You cannot end your turn inside of a solid object.'
        },
        {
          key: 'chilling_presence',
          type: AbilityType.MAIN_ACTION,
          name: 'Chilling Presence',
          description:
            'You can roll an Influence check to frighten all nearby enemies. On a success, all enemies within 40ft are pushed 5ft away and take `1D6` damage.'
        },
        {
          key: 'chilling_blast',
          type: AbilityType.MAIN_ACTION,
          name: 'Chilling Blast',
          description:
            'You can roll a Power check to blast a target within 10ft. On a success, the target is pushed 10ft away, is knocked Prone, and takes `1D6` damage.'
        },
        {
          key: 'chilling_touch',
          type: AbilityType.MAIN_ACTION,
          name: 'Chilling Touch',
          description:
            'You can roll a Power check to weaken a target within 5ft. On a success, the target takes `2D6` damage.'
        },
        {
          key: 'apparition',
          type: AbilityType.BONUS_ACTION,
          name: 'Apparition',
          description:
            'You can create an apparition within 40ft that deals `1D6` damage to a nearby enemy.'
        },
        {
          key: 'hallucination',
          type: AbilityType.REACTION,
          name: 'Hallucination',
          description:
            'You can create disorienting hallucinations for a target within 40ft. The target has -2 disadvantage on all Perception checks for 1 turn.'
        }
      ],
      itemQuantities: []
    },
    {
      key: 'shadow',
      name: 'Shadow',
      affiliation: 'Project Perimentum',
      description:
        "An undercover operative who gathers intelligence, abducts test subjects, and ensures the secrecy of the project's activities.",
      level: 8,
      attributes: {
        strength: -2,
        dexterity: 2,
        intelligence: 0,
        charisma: 1,
        perception: 1
      },
      abilities: [
        {
          key: 'lightning_baton',
          type: AbilityType.MAIN_ACTION,
          name: 'Lightning Baton',
          description:
            'You can roll a Precision check to shock a target within 10ft. On a success, the target takes `2D6` damage and must roll a DT 14 Fortitude check to avoid being stunned.'
        },
        {
          key: 'fog_ball',
          type: AbilityType.BONUS_ACTION,
          name: 'Fog Ball',
          description:
            'You can throw a fog ball at your feet, creating a plume of smoke that spreads 15ft in all directions. Inside the fog cloud, visibility range is decreased to 5ft.'
        },
        {
          key: 'poison_capsule',
          type: AbilityType.REACTION,
          name: 'Poison Capsule',
          description:
            'If you are grappled or otherwise subdued, you can consume a poison capsule that kills you instantly.'
        }
      ],
      itemQuantities: []
    },
    {
      key: 'arcanotech_officer',
      name: 'Arcanotech Officer',
      description:
        'An officer of the Cirllion Vanguard that specializes in magical technology to support field operations.',
      affiliation: 'Cirillion Vanguard',
      level: 13,
      attributes: {
        strength: 0,
        dexterity: 2,
        intelligence: 2,
        charisma: -2,
        perception: 0
      },
      abilities: [
        {
          key: 'improvised_grenade',
          type: AbilityType.REACTION,
          name: 'Improvised Grenade',
          description:
            'As a reaction, you can roll an Intellect check to prep and throw an improvised grenade up to 30ft. This grenades affects all creatures within 10ft. At DT 20, the grenade stuns. At DT 17, the grenade deals `2D6` damage. At DT 14, the grenade deals `1D6` damage. At DT 11, the grenade forces a reaction usage. At DT 8, the grenade duds. At DT 5, the grenade goes off in your hand (reroll for its effect). You can use three grenades per Rest.'
        }
      ],
      itemQuantities: [
        { key: 'radiant_revolver', quantity: 1 },
        { key: 'arcane_aegis_armor', quantity: 1 }
      ]
    },
    {
      key: 'shambler',
      name: 'Shambler',
      description:
        'A swamp monster that can move undetected through mud and engulf its targets in its muddy embrace.',
      level: 14,
      attributes: {
        strength: 5,
        dexterity: 1,
        intelligence: 0,
        charisma: -2,
        perception: -1
      },
      abilities: [
        {
          key: 'death_by_mud',
          type: AbilityType.MAIN_ACTION,
          name: 'Death by Mud',
          description:
            'You can roll a grappling check to engulf a target within 5ft. On a success, the target is grappled inside of you. At the start of each turn, the target must make a DT 14 Fortitude check or take `2D6` damage. You cannot engulf multiple targets at the same time.'
        },
        {
          key: 'mud_wave',
          type: AbilityType.MAIN_ACTION,
          name: 'Mud Wave',
          description:
            'You can roll a Power check to blast mud at a target within 5ft. On a success, the target takes `4D6` damage.'
        },
        {
          key: 'mud_ball',
          type: AbilityType.BONUS_ACTION,
          name: 'Mud Ball',
          description:
            'You can roll a Precision check to hurl mud at a target within 60ft. On a success, the target takes `1D6` damage.'
        },
        {
          key: 'born_of_mud',
          type: AbilityType.BONUS_ACTION,
          name: 'Born of Mud',
          description:
            'You submerge yourself in mud, becoming undetectable in the process. You can move freely in the mud and emerge at any time. You cannot submerge while engulfing an enemy.'
        }
      ],
      itemQuantities: []
    },
    {
      key: 'elder_husk',
      name: 'Elder Husk',
      description:
        "Indoctrinated hosts that serve as the Brine's primary enforcers. They ensure the Brine's will is enforced and its interests are protected.",
      affiliation: 'The Brine',
      level: 15,
      attributes: {
        strength: 4,
        dexterity: 1,
        intelligence: 0,
        charisma: 0,
        perception: -2
      },
      abilities: [
        {
          key: 'brine_blades',
          type: AbilityType.MAIN_ACTION,
          name: 'Brine Blades',
          description:
            'Your arms transform into blades made of algae. You can roll a Power check to hit up to two targets within 5ft. On a success, each target takes `2D6` damage.'
        },
        {
          key: 'aqueous_evasion',
          type: AbilityType.BONUS_ACTION,
          name: 'Aqueous Evasion',
          description: 'You move 5ft, dodging nearby combatants. All opportunity attacks are DT 17.'
        },
        {
          key: 'spread_the_brine',
          type: AbilityType.MAIN_ACTION,
          name: 'Spread the Brine',
          description:
            "While you have a target grappled, you can roll a Power check against the target's Fortitude to infect them. If you succeed, roll `1D6`. This is the number of turns before the infection permanently takes hold. A successful Medicine check is required to prevent the infection of the target."
        }
      ],
      itemQuantities: [
        { key: 'halberd', quantity: 1 },
        { key: 'chainmail_armor', quantity: 1 }
      ]
    },
    {
      key: 'the_hellman',
      name: 'The Hellman',
      description: 'A hunter that seeks to trap, ambush, and incapacitate its quarry.',
      level: 17,
      attributes: {
        strength: -2,
        dexterity: 4,
        intelligence: 1,
        charisma: 0,
        perception: 1
      },
      abilities: [
        {
          key: 'ensnaring_chain',
          type: AbilityType.BONUS_ACTION,
          name: 'Ensnaring Chain',
          description:
            'You can roll a Precision check to ensnare a target within 15ft with your chain. On a success, the target becomes Grappled at DT 17.'
        },
        {
          key: 'chain_strangulation',
          type: AbilityType.BONUS_ACTION,
          name: 'Chain Strangulation',
          description:
            'When you have a target ensnared in your chain for 1 turn or more, you can strangle them. Strangling a target will incapacitate them for 3 turns.'
        },
        {
          key: 'chain_whip',
          type: AbilityType.MAIN_ACTION,
          name: 'Chain Whip',
          description:
            'You can roll a Precision check to whip a target within 15ft with your chain. On a success, the target takes `5D6` damage and is pushed back 5ft.'
        },
        {
          key: 'toxic_bomb',
          type: AbilityType.BONUS_ACTION,
          name: 'Toxic Bomb',
          description:
            'You can roll a Precision check to throw a toxic bomb at a spot within 45ft. On a success, all enemies within 10ft of the blast must make a DT 14 Fortitude check to resist the toxic smoke. If an enemy fails, they are incapacitated for 1 turn.'
        },
        {
          key: 'toxic_dart',
          type: AbilityType.MAIN_ACTION,
          name: 'Toxic Dart',
          description:
            'You can roll a Precision check to shoot a target within 45ft with a toxic dart. On a success, the target must make a DT 14 Fortitude check to resist the toxic venom. If the target fails, they are incapacitated for 3 turns.'
        }
      ],
      itemQuantities: [{ key: 'plate_armor', quantity: 1 }]
    },
    {
      key: 'winged_harbinger',
      name: 'Winged Harbinger',
      description:
        'A corrupted creature with glowing red eyes, leathery wings, and a terrifying screech.',
      level: 24,
      attributes: {
        strength: -1,
        dexterity: 5,
        intelligence: -2,
        charisma: 3,
        perception: 1
      },
      abilities: [
        {
          key: 'winged',
          type: AbilityType.PASSIVE,
          name: 'Winged',
          description:
            'You can use your movement to fly in any direction. You are not impeded by Rough Terrain.'
        },
        {
          key: 'terrifying_screech',
          type: AbilityType.MAIN_ACTION,
          name: 'Terrifying Screech',
          description:
            'You can roll a contested Influence check to scare up to six targets within 120ft. If a target fails, they become Terrified for 1 turn (-6 disadvantage on attacks).'
        },
        {
          key: 'retched_wind',
          type: AbilityType.MAIN_ACTION,
          name: 'Retched Wind',
          description:
            'You can roll an Influence check to make a breath attack on all targets within 5ft. On a success, each target is Stunned and rolls a Strength check. On a failure, the target contracts Retch Rot.'
        },
        {
          key: 'wing_wind',
          type: AbilityType.BONUS_ACTION,
          name: 'Wing Wind',
          description:
            'You can roll an Agility check to make a winged attack on all targets within 10ft. On a success, each target takes `2D6` damage, is pushed back 10ft, and is knocked Prone.'
        },
        {
          key: 'claw_above',
          type: AbilityType.BONUS_ACTION,
          name: 'Claw Above',
          description:
            'You can roll a Precision check to make a claw attack on a target within 10ft. On a success, the target takes `3D6` damage and is knocked Prone.'
        },
        {
          key: 'claw_face',
          type: AbilityType.MAIN_ACTION,
          name: 'Claw Face',
          description:
            'You can roll a Precision check to make a claw attack on a target within 10ft. On a success, the target takes `6D6` damage and is Blinded for 1 turn (sight reduced to 5ft).'
        }
      ],
      itemQuantities: []
    }
  ]
};

export const WORLD_KITS = {
  vale_of_myths: VALE_OF_MYTHS
};

// TODO: make current world kit dynamic
export const WORLD_KIT = WORLD_KITS.vale_of_myths;
