import Phase from "./Phase";

export default interface Ability {
    datasheet_id: string | undefined;
    line: string;
    ability_id: string | undefined;
    model: string |undefined;
    name: string;
    description: string;
    type: string | undefined;
    parameter: string |undefined;
    phases: Phase[] | string[];
}