import { AttributeKey } from './Character';
import { Perk } from './Perk';

type CharacterClass = {
  label: string;
  attributeKey: AttributeKey;
  skillKey: string;
  classItemLabel: string;
  perks: { [key: string]: Perk };
  computed?: {
    speed?: string;
    maxHitPoints?: string;
    maxClassPoints?: string;
  };
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
      perks: {
        pledged_word: {
          key: 'pledged_word',
          name: 'Pledged Word',
          description: 'You double your Speech bonus when making a promise.',
          attributeKey: 'strength',
          skillKey: 'honor',
          skillRequirement: 1
        },
        charge: {
          key: 'charge',
          name: 'Charge',
          description: 'Your movement speed is doubled for the first round of combat.',
          attributeKey: 'strength',
          skillKey: 'honor',
          skillRequirement: 2
        },
        champion: {
          key: 'champion',
          name: 'Champion',
          description: 'Your initiative roll is automatically doubled.',
          attributeKey: 'strength',
          skillKey: 'honor',
          skillRequirement: 2
        },
        bulwark: {
          key: 'bulwark',
          name: 'Bulwark',
          description:
            'You take only half damage when hit by an enemy with over half of its health remaining.',
          attributeKey: 'strength',
          skillKey: 'honor',
          skillRequirement: 3
        }
      }
    },
    barbarian: {
      label: 'Barbarian',
      attributeKey: 'strength',
      skillKey: 'rage',
      classItemLabel: 'Tribal Marking',
      perks: {
        boiling_blood: {
          key: 'boiling_blood',
          name: 'Boiling Blood',
          description: 'You start combat in a Combat Rage.',
          attributeKey: 'strength',
          skillKey: 'rage',
          skillRequirement: 1
        },
        blood_rush: {
          key: 'blood_rush',
          name: 'Blood Rush',
          description:
            'While in a Combat Rage, your movement speed is increased by 10ft and you can traverse obstacles using Rage instead of Athletics or Agility.',
          attributeKey: 'strength',
          skillKey: 'rage',
          skillRequirement: 2
        },
        beserker: {
          key: 'beserker',
          name: 'Beserker',
          description:
            'After landing a melee attack with Rage, you can use your second action to make another.',
          attributeKey: 'strength',
          skillKey: 'rage',
          skillRequirement: 3
        }
      }
    },
    monk: {
      label: 'Monk',
      attributeKey: 'dexterity',
      skillKey: 'chi',
      classItemLabel: 'Spiritual Talisman',
      perks: {
        zen: {
          key: 'zen',
          name: 'Zen',
          description:
            'With a successful Chi check, you can expend a Chi Point to calm a group of people, giving advantage on Speech checks against them equal to your Chi.',
          attributeKey: 'dexterity',
          skillKey: 'chi',
          skillRequirement: 1
        },
        reflexive: {
          key: 'reflexive',
          name: 'Reflexive',
          description: 'You get a second reaction during combat.',
          attributeKey: 'dexterity',
          skillKey: 'chi',
          skillRequirement: 2
        },
        return_to_sender: {
          key: 'return_to_sender',
          name: 'Return to Sender',
          description:
            'After deflecting an attack, you can spend a Chi Point to deal the intended damage back on the enemy.',
          attributeKey: 'dexterity',
          skillKey: 'chi',
          skillRequirement: 3
        }
      },
      computed: {
        maxClassPoints: '3 + [classItemBonus] * 3'
      }
    },
    ranger: {
      label: 'Ranger',
      attributeKey: 'dexterity',
      skillKey: 'survival',
      classItemLabel: 'Survival Toolkit',
      perks: {
        scouting_lens: {
          key: 'scouting_lens',
          name: 'Scouting Lens',
          description:
            'When rolling Detection to scout from an elevated vantage point, add your Survival bonus.',
          attributeKey: 'dexterity',
          skillKey: 'survival',
          skillRequirement: 1
        },
        field_notes: {
          key: 'field_notes',
          name: 'Field Notes',
          description: 'When rolling Insight against natural phenomena, add your Survival bonus.',
          attributeKey: 'dexterity',
          skillKey: 'survival',
          skillRequirement: 1
        },
        tripwire: {
          key: 'tripwire',
          name: 'Tripwire',
          description:
            'When rolling Detection to watch for enemies during a rest, add your Survival bonus.',
          attributeKey: 'dexterity',
          skillKey: 'survival',
          skillRequirement: 2
        },
        survival_shelter: {
          key: 'survival_shelter',
          name: 'Survival Shelter',
          description: 'You get the bonus of Simple Lodging when resting in an Adventuring Camp.',
          attributeKey: 'dexterity',
          skillKey: 'survival',
          skillRequirement: 2
        },
        trauma_kit: {
          key: 'trauma_kit',
          name: 'Trauma Kit',
          description: 'When rolling Medicine to heal or stabilize, add your Survival bonus.',
          attributeKey: 'dexterity',
          skillKey: 'survival',
          skillRequirement: 3
        },
        camouflage: {
          key: 'camouflage',
          name: 'Camouflage',
          description: 'When rolling Stealth to launch a surprise attack, add your Survival bonus.',
          attributeKey: 'dexterity',
          skillKey: 'survival',
          skillRequirement: 3
        }
      },
      computed: {
        speed: '3 + [attribute.dexterity] + [skill.agility] + [skill.survival]'
      }
    },
    mage: {
      label: 'Mage',
      attributeKey: 'intelligence',
      skillKey: 'magic',
      classItemLabel: 'Magical Channel',
      perks: {
        prestidigitation: {
          key: 'prestidigitation',
          name: 'Prestidigitation',
          description:
            'Unlock spells from the School of Prestidigitation, giving the ability to cast minor illusions and tricks.',
          attributeKey: 'intelligence',
          skillKey: 'magic',
          skillRequirement: 0
        },
        abjuration: {
          key: 'abjuration',
          name: 'Abjuration',
          description:
            'Unlock spells from the School of Abjuration, giving the ability to protect and defend.',
          attributeKey: 'intelligence',
          skillKey: 'magic',
          skillRequirement: 1
        },
        elementalism: {
          key: 'elementalism',
          name: 'Elementalism',
          description:
            'Unlock spells from the School of Elementalism, giving the ability to wield the natural elements.',
          attributeKey: 'intelligence',
          skillKey: 'magic',
          skillRequirement: 2
        },
        necromancy: {
          key: 'necromancy',
          name: 'Necromancy',
          description:
            'Unlock spells from the School of Necromancy, giving the ability to wield vitality and death.',
          attributeKey: 'intelligence',
          skillKey: 'magic',
          skillRequirement: 3
        },
        chronomancy: {
          key: 'chronomancy',
          name: 'Chronomancy',
          description:
            'Unlock spells from the School of Chronomancy, giving the ability to bend the flow of time.',
          attributeKey: 'intelligence',
          skillKey: 'magic',
          skillRequirement: 3
        }
      },
      computed: {
        maxClassPoints: '[level]'
      }
    },
    forge: {
      label: 'Forge',
      attributeKey: 'intelligence',
      skillKey: 'smithing',
      classItemLabel: 'Smithing Hammer',
      perks: {
        metallurgic_processing: {
          key: 'metallurgic_processing',
          name: 'Metallurgic Processing',
          description:
            'Unlock metallurgical enhancements, forging steel into its strongest and hardest form.',
          attributeKey: 'intelligence',
          skillKey: 'smithing',
          skillRequirement: 1
        },
        magical_channeling: {
          key: 'magical_channeling',
          name: 'Magical Channeling',
          description:
            "Unlock magical enhancements, channeling magical forces into an item's very structure.",
          attributeKey: 'intelligence',
          skillKey: 'smithing',
          skillRequirement: 2
        },
        runic_infusion: {
          key: 'runic_infusion',
          name: 'Runic Infusion',
          description:
            'Unlock runic enhancements, infusing the supernatural power of runes into an item.',
          attributeKey: 'intelligence',
          skillKey: 'smithing',
          skillRequirement: 3
        }
      },
      computed: {
        maxClassPoints: '3 + [classItemBonus] * 3'
      }
    },
    herald: {
      label: 'Herald',
      attributeKey: 'charisma',
      skillKey: 'influence',
      classItemLabel: 'Beacon of Influence',
      perks: {
        whisper: {
          key: 'whisper',
          name: 'Whisper',
          description: 'You go unnoticed when influencing others.',
          attributeKey: 'charisma',
          skillKey: 'influence',
          skillRequirement: 1
        },
        rallying_cry: {
          key: 'rallying_cry',
          name: 'Rallying Cry',
          description:
            'You can make an Influence check to rally your allies in combat. On a success, you spend IP equal to the number of allies rallied and they all get +1 advantage on attacks for three turns.',
          attributeKey: 'charisma',
          skillKey: 'influence',
          skillRequirement: 2
        },
        turncoat: {
          key: 'turncoat',
          name: 'Turncoat',
          description:
            "You can make an Influence check against an enemy's Intuition to convince them to join your cause. On a success, you spend IP equal to the enemy's level and they change sides.",
          attributeKey: 'charisma',
          skillKey: 'influence',
          skillRequirement: 3
        }
      },
      computed: {
        maxClassPoints: '[level]'
      }
    },
    enchanter: {
      label: 'Enchanter',
      attributeKey: 'charisma',
      skillKey: 'enchantment',
      classItemLabel: 'Enchantment Charm',
      perks: {
        enchantment_of_hallucination: {
          key: 'enchantment_of_hallucination',
          name: 'Enchantment of Hallucination',
          description: 'The target sees a small illusion of your making, equivalent to Murmur.',
          attributeKey: 'charisma',
          skillKey: 'enchantment',
          skillRequirement: 1
        },
        enchantment_of_fear: {
          key: 'enchantment_of_fear',
          name: 'Enchantment of Fear',
          description: 'The target cannot move within 10 feet of you or make attacks against you.',
          attributeKey: 'charisma',
          skillKey: 'enchantment',
          skillRequirement: 1
        },
        enchantment_of_exhaustion: {
          key: 'enchantment_of_exhaustion',
          name: 'Enchantment of Exhaustion',
          description: "The target's movement speed is reduced by half.",
          attributeKey: 'charisma',
          skillKey: 'enchantment',
          skillRequirement: 2
        },
        enchantment_of_weakness: {
          key: 'enchantment_of_weakness',
          name: 'Enchantment of Weakness',
          description: 'The target makes all attack checks with -2 disadvantage.',
          attributeKey: 'charisma',
          skillKey: 'enchantment',
          skillRequirement: 3
        }
      }
    },
    sage: {
      label: 'Sage',
      attributeKey: 'perception',
      skillKey: 'nature',
      classItemLabel: 'Ritual Totem',
      perks: {
        ritual_of_the_shield_guardian: {
          key: 'ritual_of_the_shield_guardian',
          name: 'Ritual of the Shield Guardian',
          description:
            'Unlock the Ritual of the Shield Guardian, giving the ability to shield allies from enemies.',
          attributeKey: 'perception',
          skillKey: 'nature',
          skillRequirement: 1
        },
        ritual_of_the_spirit_path: {
          key: 'ritual_of_the_spirit_path',
          name: 'Ritual of the Spirit Path',
          description:
            'Unlock the Ritual of the Spirit Path, giving the ability to navigate difficult situations.',
          attributeKey: 'perception',
          skillKey: 'nature',
          skillRequirement: 2
        },
        ritual_of_the_stormcaller: {
          key: 'ritual_of_the_stormcaller',
          name: 'Ritual of the Stormcaller',
          description:
            "Unlock the Ritual of the Stormcaller, giving the ability to call down nature's fury from the clouds.",
          attributeKey: 'perception',
          skillKey: 'nature',
          skillRequirement: 3
        }
      },
      computed: {
        maxClassPoints: '[level]'
      }
    },
    druid: {
      label: 'Druid',
      attributeKey: 'perception',
      skillKey: 'beast',
      classItemLabel: 'Tamed Beast',
      perks: {
        swarm_of_bees: {
          key: 'swarm_of_bees',
          name: 'Swarm of Bees',
          description:
            'Spend 1 BP to summon a swarm of bees to attack a target, dealing 2D6 damage.',
          attributeKey: 'perception',
          skillKey: 'beast',
          skillRequirement: 1
        },
        vengeful_eagle: {
          key: 'vengeful_eagle',
          name: 'Vengeful Eagle',
          description: 'Spend 2 BP to summon an eagle to attack a target, dealing 4D6 damage.',
          attributeKey: 'perception',
          skillKey: 'beast',
          skillRequirement: 2
        },
        rushing_bear: {
          key: 'rushing_bear',
          name: 'Rushing Bear',
          description: 'Spend 3 BP to summon a bear to attack a target, dealing 6D6 damage.',
          attributeKey: 'perception',
          skillKey: 'beast',
          skillRequirement: 3
        },
        pack_of_wolves: {
          key: 'pack_of_wolves',
          name: 'Pack of Wolves',
          description:
            'Spend 3 BP to summon a pack of wolves to attack up to three targets. Each target takes 2D6 damage.',
          attributeKey: 'perception',
          skillKey: 'beast',
          skillRequirement: 3
        }
      },
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
