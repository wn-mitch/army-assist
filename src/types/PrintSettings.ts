import ContentOption from "./ContentOption";
import PhaseOption from "./PhaseOption";

export default interface PrintSettings {
  phaseOptionSetting: PhaseOption;
  contentOptionSetting: ContentOption;
  filterCoreStratagems: boolean;
  truncateCoreAbilities: boolean;
  weaponsFilter: boolean;
}