import Phase from "./Phase";
import SortOptions from "./SortOptions";

interface Settings {
  listSort: SortOptions;
  cardsCollapse: boolean;
  showKeywords: boolean;
  isDarkMode: boolean;
  cardsGroup: boolean;
  weaponsFilter: boolean;
  activePhases: {
    [Phase.Pregame]: boolean;
    [Phase.Command]: boolean;
    [Phase.Movement]: boolean;
    [Phase.Shooting]: boolean;
    [Phase.Charge]: boolean;
    [Phase.Fight]: boolean;
    [Phase.Saves]: boolean;
  };
  truncateCoreRules: boolean;
  listDisplaySetting: boolean;
  editForceMode: boolean;
}

export default Settings;
