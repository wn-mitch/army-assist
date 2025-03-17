import Ability from "@/types/Ability";
import Datasheet from "@/types/Datasheet";
import DatasheetWargear from "@/types/DatasheetWargear";
import Faction from "@/types/Faction";
import ListUnit from "@/types/ListUnit";
import Phase from "@/types/Phase";

const applyFactionOverrides = (factions: Faction[]) => {
  const extraFactions = [
    {
      id: "AE",
      name: "Ynnari",
      link: "https://wahapedia.ru/wh40k10ed/factions/aeldari",
    },
  ];

  return [...factions, ...extraFactions];
};

const applyNameOverrides = (unit: ListUnit) => {
  switch (unit.name) {
    case "Vyper":
      unit.name = "Vypers";
      break;
    case "Ancient in Terminator Armor":
      unit.name = "Ancient in Terminator Armour";
      break;
    case "Wraithblade":
      unit.name = "Wraithblades";
      break;
    case "Piranha":
      unit.name = "Piranhas";
      break;
    case "Nurgle Soul Grinder":
    case "Khorne Soul Grinder":
      unit.name = "Soul Grinder";
      break;
    case "Ratling Snipers":
      unit.name = "Ratlings";
      break;
    case "Khorne Berserkers":
      unit.name = "Khorne Berzerkers";
      break;
    case "Transcendant C'tan":
      unit.name = "Transcendent C'tan";
      break;
    case "Tarantula Air Defense Battery":
      unit.name = "Tarantula Air Defence Battery";
      break;
    case "Gaunt’s Ghosts":
      unit.name = "Gaunt's Ghosts";
      break;
  }

  return unit;
};

const applyAbilityOverrides = (ability: Ability) => {
  switch (ability.ability_id) {
    case "000008344":
      return {
        ...ability,
        name: `Scout ${ability.parameter}`,
        description: `At the start of the first battle round, before the first turn begins, you can move this unit up to ${ability.parameter} as if it were the Movement phase.`,
      };
    case "000008334":
      return {
        ...ability,
        name: `Firing Deck`,
        description:
          "Some transports have firing hatches, ports or platforms from which embarked passengers can shoot.Some TRANSPORT models have 'Firing Deck x' listed in their abilities. Each time such a model is selected to shoot in the Shooting phase, you can select up to 'x' models embarked within it whose units have not already shot this phase. Then, for each of those embarked models, you can select one ranged weapon that embarked model is equipped with (excluding weapons with the [ONE SHOT] ability). Until that TRANSPORT model has resolved all of its attacks, it counts as being equipped with all of the weapons you selected in this way, in addition to its other weapons. Until the end of the phase, those selected models' units are not eligible to shoot.Firing Deck 'x': Each time this TRANSPORT shoots, select one weapon (excluding weapons with the [ONE SHOT] ability) from up to 'x' models embarked within it whose units have not shot this phase; this TRANSPORT counts as being equipped with those weapons as well. Until the end of the phase, those selected models' units are not eligible to shoot.",
      };
    case "000008345":
      return {
        ...ability,
        name: `Infiltrators`,
        description:
          'During deployment, if every model in a unit has this ability, then when you set it up, it can be set up anywhere on the battlefield that is more than 9" horizontally away from the enemy deployment zone and all enemy models.',
      };
    case "000008339":
      return {
        ...ability,
        name: `Deadly Demise ${ability.parameter}`,
        description:
          "Some models have 'Deadly Demise x' listed in their abilities. When such a model is destroyed, roll one D6 before removing it from play (if such a model is a TRANSPORT, roll before any embarked models disembark). On a 6, each unit within 6\" of that model suffers a number of mortal wounds denoted by 'x' (if this is a random number, roll separately for each unit within 6\").",
      };
    case "000008340":
      return {
        ...ability,
        name: `Fights First`,
        description:
          "Units with this ability that are eligible to fight do so in the Fights First step, provided every model in the unit has this ability.",
      };
    case "000008336":
      return {
        ...ability,
        name: "Lone Operative",
        description:
          'Unless part of an Attached unit (see Leader), this unit can only be selected as the target of a ranged attack if the attacking model is within 12".',
      };
    case "000008342":
      return {
        ...ability,
        name: "Hover",
        description:
          "Some AIRCRAFT models have 'Hover' listed in their abilities. When you are instructed to Declare Battle Formations, before doing anything else, you must first declare which models from your army with this ability will be in Hover mode. If a model is in Hover mode, then until the end of the battle, its Move characteristic is changed to 20\", it loses the AIRCRAFT keyword and it loses all associated rules for being an AIRCRAFT model. Models in Hover mode do not start the battle in Reserves, but you can choose to place them into Strategic Reserves following the normal rules if you wish",
      };
    case "000008343":
      return {
        ...ability,
        name: "Deep Strike",
        description:
          'During the Declare Battle Formations step, if every model in a unit has this ability, you can set it up in Reserves instead of setting it up on the battlefield. If you do, in the Reinforcements step of one of your Movement phases you can set up this unit anywhere on the battlefield that is more than 9" horizontally away from all enemy models. If a unit with the Deep Strike ability arrives from Strategic Reserves, the controlling player can choose for that unit to be set up either using the rules for Strategic Reserves or using the Deep Strike ability. Unit can be set up in Reserves instead of on the battlefield.Unit can be set up in your Reinforcements step, more than 9" horizontally away from all enemy models.',
      };
    case "000008337":
      return {
        ...ability,
        name: "Stealth",
        description:
          "If every model in a unit has this ability, then each time a ranged attack is made against it, subtract 1 from that attack's Hit roll.",
      };
    default:
      if (ability.name === "") {
        return {
          ...ability,
          name: `Unknown Ability ${ability.ability_id}`,
          description:
            "No description provided, please contact the dev for a fix",
        };
      } else {
        return ability;
      }
  }
};

const applyWeaponOverrides = (
  datasheet: Datasheet,
  weapons: string[] | undefined
) => {
  if (!weapons) {
    return;
  }

  switch (datasheet.id) {
    case "000000613":
      weapons = weapons
        ? [...weapons, "Wraithbone fists"]
        : ["Wraithbone fists"];
      break;
    case "000002565":
      weapons = weapons ? [...weapons, "Armoured limbs"] : ["Armoured limbs"];
      weapons = weapons
        ? [...weapons, "Psychic Shock Wave"]
        : ["Psychic Shock Wave"];
      break;
  }

  switch (datasheet.name) {
    case "Wraithblades":
      if (weapons) {
        if (weapons[0] === "Ghostaxe and Forceshield") {
          weapons = ["Ghostaxe", "Forceshield"];
        } else {
          weapons = ["Ghostswords", "Forceshield"];
        }
      }
      break;
    case "Flesh Hounds":
      weapons = findAndReplace(weapons, "Burning maw", "Burning roar");
      break;
    case "Exalted Flamer":
      weapons = [
        ...weapons,
        "Fire of Tzeentch – blue fire",
        "Fire of Tzeentch – pink fire",
      ];
      break;
    case "Rendmaster On Blood Throne":
      weapons = [...weapons, "Blade of blood", "Attendants' hellblades"];
      break;
    case "Seekers":
      weapons = [...weapons, "Lashing tongue", "Slashing claws"];
      break;
    case "Sicarian Ruststalkers":
      weapons = [...weapons, "Transonic razor and chordclaw"];
      break;
    case "Warp Spiders":
      weapons = [...weapons, "Death spinner"];
      break;
    case "Knight Tyrant":
      weapons = [
        ...weapons,
        "Ectoplasma decimator – standard",
        "Ectoplasma decimator – supercharged",
        "Brimstone volcano lance",
      ];
      break;
    case "Stormraven Gunship":
      weapons = [...weapons, "Stormstrike missile launcher"];
      break;
    case "Kataphron Destroyers":
      weapons = findAndReplace(
        weapons,
        "Heavy grav cannon",
        "Heavy grav-cannon"
      );
      break;
    case "Serberys Raiders":
      weapons = findAndReplace(
        weapons,
        "Cavalry sabre & clawed limbs",
        "Cavalry sabre and clawed limbs"
      );
      break;
    case "Valkyrie":
      weapons = findAndReplace(
        weapons,
        "Multiple rocket pods",
        "Multiple rocket pod"
      );
      break;
    case "Vulture Gunship":
      weapons = findAndReplace(
        weapons,
        "Multiple rocket pods",
        "Multiple rocket pod"
      );
      break;
    case "Asurmen":
      weapons = findAndReplace(weapons, "The Sword of Asur", "Sword of Asur");
      weapons = findAndReplace(weapons, "The Bloody Twins", "Bloody Twins");
      break;
    case "Baharroth":
      weapons = [...weapons, "Shining Blade"];
      break;
    case "Jain Zar":
      weapons = findAndReplace(
        weapons,
        "The Blade of Destruction",
        "Blade of Destruction"
      );
      break;
    case "Fuegan":
      weapons = findAndReplace(weapons, "The Fire Axe", "Fire Axe");
      break;
    case "Chronomancer":
      weapons = findAndReplace(weapons, "Chronomancer's stave", "Aeonstave");
      break;
    case "Armoured Sentinels":
      weapons = findAndReplace(weapons, "Militarum Multi-laser", "Multi-laser");
      break;
    case "Chimera":
      weapons = findAndReplace(weapons, "Chimera Multi-laser", "Multi-laser");
      break;
    case "Fire Dragons":
      weapons = [...weapons, "Firepike", "Exarch's Dragon fusion gun"];
      break;
    case "Psychophage":
      weapons = findAndReplace(
        weapons,
        "Psycholastic torrent",
        "Psychoclastic torrent"
      );
      break;
    case "Norn Assimilator":
      weapons = findAndReplace(
        weapons,
        "Toxinjecter harpoon",
        "Toxinjector Harpoon"
      );
      break;
    case "Genestealers":
      weapons = findAndReplace(
        weapons,
        "Genestealers claws and talons",
        "Genestealer claws and talons"
      );
      break;
    case "Kroot Farstalkers":
      weapons = findAndReplace(weapons, "T'au tech rifle", "T'au-tech rifle");
      break;
    case "Krootox Rampagers":
      weapons = findAndReplace(weapons, "Rampager fists", "Krootox Fists");
      weapons = findAndReplace(
        weapons,
        "Hunting Blades",
        "Close combat weapon"
      );
      break;
  }
  console.log(datasheet.name, weapons)

  return weapons;
};

const applyMissingWeapons = (
  unit: ListUnit,
  weapons: string[],
  weaponDatasheets: DatasheetWargear[]
) => {
  switch (unit.name) {
    case "Broadside Battlesuits":
    case "Crisis Sunforge Battlesuits":
    case "Crisis Starscythe Battlesuits":
    case "Breacher Team": {
      const missilePod: DatasheetWargear = {
        datasheet_id: "999999999",
        line: null,
        line_in_wargear: null,
        name: "Missile pod",
        description: "",
        dice: "",
        range: "30",
        type: "Ranged",
        A: "2",
        BS_WS: "3",
        S: "7",
        AP: "-1",
        D: "2",
      };

      const gunDrone: DatasheetWargear = {
        datasheet_id: "000000403",
        line: "1",
        line_in_wargear: "1",
        dice: "",
        name: "Twin pulse carbine",
        description: "assault, twin-linked",
        range: "20",
        type: "Ranged",
        A: "2",
        BS_WS: "5",
        S: "5",
        AP: "0",
        D: "1",
      };

      weaponDatasheets = addWeaponIfFound(
        weapons,
        weaponDatasheets,
        missilePod
      );
      weaponDatasheets = addWeaponIfFound(weapons, weaponDatasheets, gunDrone);

      break;
    }
  }

  return weaponDatasheets;
};

const addWeaponIfFound = (
  weapons: string[],
  weaponDatasheets: DatasheetWargear[],
  weaponToAdd: DatasheetWargear
) => {
  if (weaponToAdd.name && weapons.includes(weaponToAdd.name)) {
    return [...weaponDatasheets, weaponToAdd];
  } else {
    return weaponDatasheets;
  }
};

const applyMissingAbilities = (
  unit: ListUnit,
  weapons: string[],
  abilities: Ability[]
) => {
  switch (unit.name) {
    case "Broadside Battlesuits":
    case "Crisis Sunforge Battlesuits":
    case "Crisis Starscythe Battlesuits":
    case "Breacher Team":
    case "Stealth Battlesuits": {
      const shieldDrone: Ability = {
        datasheet_id: "999999999",
        line: "",
        ability_id: "",
        model: undefined,
        name: "Shield Drone",
        description: "Add 1 to the bearer's Wounds characteristic",
        type: "Wargear",
        parameter: "",
        phases: [Phase.Saves],
      };

      const markerDrone: Ability = {
        datasheet_id: "999999999",
        line: "",
        ability_id: "",
        model: undefined,
        name: "Marker Drone",
        description:
          "The bearer’s unit has the MARKERLIGHT keyword and can act as an Observer unit for another unit even if it Advanced this turn.",
        type: "Wargear",
        parameter: "",
        phases: [Phase.Saves],
      };

      abilities = addAbilityIfFound(weapons, abilities, shieldDrone);
      abilities = addAbilityIfFound(weapons, abilities, markerDrone);
      break;
    }
  }

  return abilities;
};

const addAbilityIfFound = (
  weapons: string[],
  abilities: Ability[],
  ability: Ability
) => {
  if (ability.name && weapons.includes(ability.name)) {
    return [...abilities, ability];
  } else {
    return abilities;
  }
};

const findAndReplace = (
  array: string[],
  findValue: string,
  replaceValue: string
): string[] => {
  return array.map((item) => (item.toLowerCase()) === findValue.toLowerCase() ? replaceValue : item);
};

export {
  applyNameOverrides,
  applyAbilityOverrides,
  applyFactionOverrides,
  applyWeaponOverrides,
  applyMissingWeapons,
  applyMissingAbilities,
};
