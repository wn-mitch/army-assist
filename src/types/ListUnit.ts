interface ListUnit {
  id: number;
  name: string;
  count: number | null;
  points: number | null;
  details: string | undefined;
  toggled: boolean; 
  children?: ListUnit[];
}

export default ListUnit;