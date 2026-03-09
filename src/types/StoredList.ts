import ListUnit from "./ListUnit";
import Phase from "./Phase";

interface StoredList {
  uuid: string;
  text: string;
  textFormat: "listforge" | "nrjson";
  name: string | undefined;
  units: ListUnit[];
  phase: Phase;
  faction: string | undefined;
  detachment: string | undefined;
  created: string;
  updated: string;
}

export default StoredList;