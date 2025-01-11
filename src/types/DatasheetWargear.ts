export default interface DatasheetWargear {
    datasheet_id: string;
    line: string | null;
    line_in_wargear?: string | null;
    dice: string | null;
    name: string | null;
    description?: string | null;
    range: string | null;
    type: string | null;
    A: string | null;
    BS_WS: string | null;
    S: string | null;
    AP: string | null;
    D: string | null;
}