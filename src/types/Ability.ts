import Phase from "./Phase";

export default interface Ability {
    datasheet_id: string;
    line: string;
    ability_id: string;
    model: string;
    name: string;
    description: string;
    type: string | null;
    parameter: string;
    phases: Phase[] | string[];
}