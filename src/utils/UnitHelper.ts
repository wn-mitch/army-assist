import Datasheet from "@/types/Datasheet";
import ListUnit from "@/types/ListUnit";

const getSelectionsFromUnit = (unit: ListUnit, datasheet:Datasheet): string[] => {
  if (unit.children && unit.children.length > 0) {
    const details = unit.children.map((child) => child.details).join(", ");
    unit.details = unit.details
      ? [...unit.details.split(", "), details].join(", ")
      : details;
    unit.children = [];
  }

  let weapons = unit.details
    ?.split(/,(?![^(]*\))/)
    .filter((name) => name !== "Warlord" && name !== "")
    .map((name) => name.replace(/^\d+x?\s*/, "").trim())
    .flatMap((name) => {
      const cleanedName = name.replace(/\s*\((.*?)\)\s*/g, ", $1").trim();
      return cleanedName.split(",").map((part) => part.trim());
    });

  if (datasheet.id === "000000613") {
    weapons = weapons ? [...weapons, "Wraithbone fists"] : ["Wraithbone fists"];
  }

  if (datasheet.id === "000002565") {
    weapons = weapons ? [...weapons, "Armoured limbs"] : ["Armoured limbs"];
  }

  weapons = weapons?.flatMap((weapon) => {
    const match = weapon.match(/(\d+)x\s+([A-Za-z\s-]+)/);
    if (match) {
      const count = parseInt(match[1], 10);
      const weaponName = match[2];
      return Array(count).fill(weaponName);
    }
    return weapon;
  });

  if (weapons) {
    return weapons
  } else {
    return []
  }
}

export { getSelectionsFromUnit };