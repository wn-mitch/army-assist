import changelogData from "@/assets/json/Changelog.json";

const getCurrentVersion = () => changelogData[0].version;
const getCurrentStateVersion = () => changelogData[0].stateVersion;

export {getCurrentVersion, getCurrentStateVersion}