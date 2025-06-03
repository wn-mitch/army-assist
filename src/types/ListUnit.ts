import Ability from "@/types/Ability"
import DatasheetModel from "./DatasheetModel";
import Enhancement from "./Enhancement";
import Datasheet from "./Datasheet";
import DatasheetWargear from "./DatasheetWargear";
import Note from "./Note";

interface ListUnit {
  id: number;
  datasheet_id: string | null;
  name: string;
  count: Record<string, number> | null;
  groupCount: number | null;
  points: number | null;
  details: string | undefined;
  toggled: boolean; 
  children: ListUnit[];
  weapons: string[] | undefined;
  weaponsDatasheets: DatasheetWargear[];
  abilities: Ability[];
  enhancements: Enhancement[];
  datasheetModel: DatasheetModel | null;
  keywords: string;
  datasheet: Datasheet | null;
  notes: Note[] | null;
  attached_to_leader_id?: string; // ID of the leader this unit is attached to
  attached_units?: string[]; // IDs of units attached to this leader
}

export default ListUnit;