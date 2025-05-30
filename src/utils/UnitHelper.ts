import Ability from "@/types/Ability";
import ListUnit from "@/types/ListUnit";
import Phase from "@/types/Phase";

const getPhasedAbilities = (unit: ListUnit, phase: Phase) =>
  unit.abilities.filter((ability: Ability) => ability.phases.includes(phase));

const getPhasedNotes = (unit: ListUnit, phase: Phase) =>
  unit.notes?.filter((note) => note.phases.includes(phase));

export { getPhasedAbilities, getPhasedNotes };