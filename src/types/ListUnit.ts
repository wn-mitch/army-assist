import Ability from "@/types/Ability"
import DatasheetModel from "./DatasheetModel";
import Enhancement from "./Enhancement";
import Datasheet from "./Datasheet";

interface ListUnit {
  id: number;
  datasheet_id: string | null;
  name: string;
  count: number | null;
  points: number | null;
  details: string | undefined;
  toggled: boolean; 
  children: ListUnit[];
  weapons: string[] | undefined;
  abilities: Ability[];
  enhancements: Enhancement[];
  datasheetModel: DatasheetModel | null;
  keywords: string;
  datasheet: Datasheet | null;
}

export default ListUnit;