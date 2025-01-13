interface ListUnit {
  id: number;
  datasheet_id: string | null;
  name: string;
  count: number | null;
  points: number | null;
  details: string | undefined;
  toggled: boolean; 
  children?: ListUnit[];
}

export default ListUnit;