import TagDetail from "@/types/TagDetail";
import React from "react";
import {
  GiPentacle,
  GiBirdClaw,
  GiBrainTentacle,
  GiAntiAircraftGun,
  GiBrainstorm,
  GiCrosshair,
  GiWeight,
  GiBloodyStash,
  GiMinigun,
  GiFlamer,
  GiOverhead,
  GiBrightExplosion,
  GiFlameSpin,
  GiRadioactive,
  GiMeeple,
  GiPoisonBottle,
  GiRun,
  GiAmmoBox,
  GiPistolGun,
  GiSpearHook,
  GiSwordArray,
  GiHoodedAssassin,
  GiFishMonster,
  GiTank,
  GiLinkedRings,
  GiCatch,
  GiAlienBug,
  GiMissileMech,
  GiHelmet,
  GiGiant,
  GiGunshot,
  GiHood,
  GiWhaleTail,
  GiPlasmaBolt,
  GiBodySwapping,
  GiDoubleShot,
  GiGhost,
} from "react-icons/gi";

const tagDetails: { [key: string]: TagDetail } = {
  Precision: {
    name: "Precision",
    icon: <GiCrosshair className="h-5 w-5" />,
    bgColor: "bg-zinc-200 dark:bg-zinc-900",
    ringColor: "ring-zinc-900 dark:ring-zinc-500",
    textColor: "text-zinc-800 dark:text-zinc-200",
  },
  "Lethal Hits": {
    name: "Lethal Hits",
    icon: <GiPoisonBottle className="h-5 w-5" />,
    bgColor: "bg-lime-200 dark:bg-lime-900",
    ringColor: "ring-lime-900 dark:ring-lime-500",
    textColor: "text-lime-800 dark:text-lime-200",
  },
  "Devastating Wounds": {
    name: "Devastating Wounds",
    icon: <GiBloodyStash className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  Assault: {
    name: "Assault",
    icon: <GiRun className="h-5 w-5" />,
    bgColor: "bg-amber-200 dark:bg-amber-900",
    ringColor: "ring-amber-900 dark:ring-amber-500",
    textColor: "text-amber-800 dark:text-amber-200",
  },
  Pistol: {
    name: "Pistol",
    icon: <GiPistolGun className="h-5 w-5" />,
    bgColor: "bg-yellow-200 dark:bg-yellow-900",
    ringColor: "ring-yellow-900 dark:ring-yellow-500",
    textColor: "text-yellow-800 dark:text-yellow-200",
  },
  "One shot": {
    name: "One Shot",
    icon: <GiAmmoBox className="h-5 w-5" />,
    bgColor: "bg-green-200 dark:bg-green-900",
    ringColor: "ring-green-900 dark:ring-green-500",
    textColor: "text-green-800 dark:text-green-200",
  },
  Melta: {
    name: "Melta",
    icon: <GiFlamer className="h-5 w-5" />,
    bgColor: "bg-orange-200 dark:bg-orange-900",
    ringColor: "ring-orange-900 dark:ring-orange-500",
    textColor: "text-orange-800 dark:text-orange-200",
  },
  "Melta d": {
    name: "Melta d",
    icon: <GiFlamer className="h-5 w-5" />,
    bgColor: "bg-orange-200 dark:bg-orange-900",
    ringColor: "ring-orange-900 dark:ring-orange-500",
    textColor: "text-orange-800 dark:text-orange-200",
  },
  "Rapid Fire": {
    name: "Rapid Fire",
    icon: <GiMinigun className="h-5 w-5" />,
    bgColor: "bg-purple-200 dark:bg-purple-900",
    ringColor: "ring-purple-900 dark:ring-purple-500",
    textColor: "text-purple-800 dark:text-purple-200",
  },
  "Rapid Fire d": {
    name: "Rapid Fire d",
    icon: <GiMinigun className="h-5 w-5" />,
    bgColor: "bg-purple-200 dark:bg-purple-900",
    ringColor: "ring-purple-900 dark:ring-purple-500",
    textColor: "text-purple-800 dark:text-purple-200",
  },
  "Ignores Cover": {
    name: "Ignores Cover",
    icon: <GiOverhead className="h-5 w-5" />,
    bgColor: "bg-emerald-200 dark:bg-emerald-900",
    ringColor: "ring-emerald-900 dark:ring-emerald-500",
    textColor: "text-emerald-800 dark:text-emerald-200",
  },
  "Indirect Fire": {
    name: "Indirect Fire",
    icon: <GiOverhead className="h-5 w-5" />,
    bgColor: "bg-emerald-200 dark:bg-emerald-900",
    ringColor: "ring-emerald-900 dark:ring-emerald-500",
    textColor: "text-emerald-800 dark:text-emerald-200",
  },
  Heavy: {
    name: "Heavy",
    icon: <GiWeight className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  Blast: {
    name: "Blast",
    icon: <GiBrightExplosion className="h-5 w-5" />,
    bgColor: "bg-orange-200 dark:bg-orange-900",
    ringColor: "ring-orange-900 dark:ring-orange-500",
    textColor: "text-orange-800 dark:text-orange-200",
  },
  "Twin-linked": {
    name: "Twin-Linked",
    icon: <GiDoubleShot className="h-5 w-5" />,
    bgColor: "bg-sky-200 dark:bg-sky-900",
    ringColor: "ring-sky-900 dark:ring-sky-500",
    textColor: "text-sky-800 dark:text-sky-200",
  },
  Torrent: {
    name: "Torrent",
    icon: <GiFlameSpin className="h-5 w-5" />,
    bgColor: "bg-orange-200 dark:bg-orange-900",
    ringColor: "ring-orange-900 dark:ring-orange-500",
    textColor: "text-orange-800 dark:text-orange-200",
  },
  Hazardous: {
    name: "Hazardous",
    icon: <GiRadioactive className="h-5 w-5" />,
    bgColor: "bg-lime-200 dark:bg-lime-900",
    ringColor: "ring-lime-900 dark:ring-lime-500",
    textColor: "text-lime-800 dark:text-lime-200",
  },
  "Anti-infantry": {
    name: "Anti-Infantry",
    icon: <GiMeeple className="h-5 w-5" />,
    bgColor: "bg-rose-200 dark:bg-rose-900",
    ringColor: "ring-rose-900 dark:ring-rose-500",
    textColor: "text-rose-800 dark:text-rose-200",
  },
  "Anti-tyranid": {
    name: "Anti-Tyranid",
    icon: <GiAlienBug className="h-5 w-5" />,
    bgColor: "bg-purple-200 dark:bg-purple-900",
    ringColor: "ring-purple-900 dark:ring-purple-500",
    textColor: "text-purple-800 dark:text-purple-200",
  },
  "Anti-walker": {
    name: "Anti-Walker",
    icon: <GiMissileMech className="h-5 w-5" />,
    bgColor: "bg-indigo-200 dark:bg-indigo-900",
    ringColor: "ring-indigo-900 dark:ring-indigo-500",
    textColor: "text-indigo-800 dark:text-indigo-200",
  },
  "Anti-fly": {
    name: "Anti-Fly",
    icon: <GiAntiAircraftGun className="h-5 w-5" />,
    bgColor: "bg-indigo-200 dark:bg-indigo-900",
    ringColor: "ring-indigo-900 dark:ring-indigo-500",
    textColor: "text-indigo-800 dark:text-indigo-200",
  },
  "Anti-character": {
    name: "Anti-Character",
    icon: <GiHoodedAssassin className="h-5 w-5" />,
    bgColor: "bg-rose-200 dark:bg-rose-900",
    ringColor: "ring-rose-900 dark:ring-rose-500",
    textColor: "text-rose-800 dark:text-rose-200",
  },
  "Anti-monster": {
    name: "Anti-Monster",
    icon: <GiFishMonster className="h-5 w-5" />,
    bgColor: "bg-rose-200 dark:bg-rose-900",
    ringColor: "ring-rose-900 dark:ring-rose-500",
    textColor: "text-rose-800 dark:text-rose-200",
  },
  "Anti-vehicle": {
    name: "Anti-Vehicle",
    icon: <GiTank className="h-5 w-5" />,
    bgColor: "bg-indigo-200 dark:bg-indigo-900",
    ringColor: "ring-indigo-900 dark:ring-indigo-500",
    textColor: "text-indigo-800 dark:text-indigo-200",
  },
  "Anti-titanic": {
    name: "Anti-Titanic",
    icon: <GiGiant className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  "Anti-daemon": {
    name: "Anti-Daemon",
    icon: <GiPentacle className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  "Anti-chaos": {
    name: "Anti-Chaos",
    icon: <GiPentacle className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  "Anti-psyker": {
    name: "Anti-Psyker",
    icon: <GiBrainTentacle className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  "Anti-Epic hero": {
    name: "Anti-Epic Hero",
    icon: <GiHelmet className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  Lance: {
    name: "Lance",
    icon: <GiSpearHook className="h-5 w-5" />,
    bgColor: "bg-pink-200 dark:bg-pink-900",
    ringColor: "ring-pink-900 dark:ring-pink-500",
    textColor: "text-pink-800 dark:text-pink-200",
  },
  "Extra Attacks": {
    name: "Extra Attacks",
    icon: <GiSwordArray className="h-5 w-5" />,
    bgColor: "bg-indigo-200 dark:bg-indigo-900",
    ringColor: "ring-indigo-900 dark:ring-indigo-500",
    textColor: "text-indigo-800 dark:text-indigo-200",
  },
  "Sustained Hits d": {
    name: "Sustained Hits d",
    icon: <GiGunshot className="h-5 w-5" />,
    bgColor: "bg-rose-200 dark:bg-rose-900",
    ringColor: "ring-rose-900 dark:ring-rose-500",
    textColor: "text-rose-800 dark:text-rose-200",
  },
  "Sustained Hits": {
    name: "Sustained Hits",
    icon: <GiGunshot className="h-5 w-5" />,
    bgColor: "bg-rose-200 dark:bg-rose-900",
    ringColor: "ring-rose-900 dark:ring-rose-500",
    textColor: "text-rose-800 dark:text-rose-200",
  },
  Psychic: {
    name: "Psychic",
    icon: <GiBrainstorm className="h-5 w-5" />,
    bgColor: "bg-purple-200 dark:bg-purple-900",
    ringColor: "ring-purple-900 dark:ring-purple-500",
    textColor: "text-purple-800 dark:text-purple-200",
  },
  snagged: {
    name: "Snagged",
    icon: <GiCatch className="h-5 w-5" />,
    bgColor: "bg-green-200 dark:bg-green-900",
    ringColor: "ring-green-900 dark:ring-green-500",
    textColor: "text-green-800 dark:text-green-200",
  },
  "linked fire": {
    name: "Linked Fire",
    icon: <GiLinkedRings className="h-5 w-5" />,
    bgColor: "bg-lime-200 dark:bg-lime-900",
    ringColor: "ring-lime-900 dark:ring-lime-500",
    textColor: "text-lime-800 dark:text-lime-200",
  },
  "dead choppy": {
    name: "Dead Choppy",
    icon: <GiBirdClaw className="h-5 w-5" />,
    bgColor: "bg-cyan-200 dark:bg-cyan-900",
    ringColor: "ring-cyan-900 dark:ring-cyan-500",
    textColor: "text-cyan-800 dark:text-cyan-200",
  },
  conversion: {
    name: "Conversion",
    icon: <GiBodySwapping className="h-5 w-5" />,
    bgColor: "bg-purple-200 dark:bg-purple-900",
    ringColor: "ring-purple-900 dark:ring-purple-500",
    textColor: "text-purple-800 dark:text-purple-200",
  },
  "plasma warhead": {
    name: "Plasma Warhead",
    icon: <GiPlasmaBolt className="h-5 w-5" />,
    bgColor: "bg-orange-200 dark:bg-orange-900",
    ringColor: "ring-orange-900 dark:ring-orange-400",
    textColor: "text-orange-800 dark:text-orange-200",
  },
  "psychic assassin": {
    name: "Psychic Assassin",
    icon: <GiHood className="h-5 w-5" />,
    bgColor: "bg-indigo-200 dark:bg-indigo-900",
    ringColor: "ring-indigo-900 dark:ring-indigo-500",
    textColor: "text-indigo-800 dark:text-indigo-200",
  },
  harpooned: {
    name: "Harpooned",
    icon: <GiWhaleTail className="h-5 w-5" />,
    bgColor: "bg-indigo-200 dark:bg-indigo-900",
    ringColor: "ring-indigo-900 dark:ring-indigo-500",
    textColor: "text-indigo-800 dark:text-indigo-200",
  },
  "reverberating summons": {
    name: "Reverberating Summons",
    icon: <GiGhost className="h-5 w-5" />,
    bgColor: "bg-zinc-200 dark:bg-zinc-900",
    ringColor: "ring-zinc-900 dark:ring-zinc-500",
    textColor: "text-zinc-800 dark:text-zinc-200",
  },
};

function getParameterCaseInsensitive(
  object: { [key: string]: TagDetail },
  key: string
) {
  const asLowercase = key.toLowerCase();
  if (!object) {
    return;
  } else {
    return object[
      Object.keys(object).find(
        (k: string) => k.toLowerCase() === asLowercase
      ) || ""
    ];
  }
}

const KeywordTags = ({ keywords }: { keywords: string[] | undefined }) => {
  const compArray = [""];
  if (JSON.stringify(keywords) == JSON.stringify(compArray)) {
    return <td className="w-1/4 overflow-clip text-gray-800 dark:text-white">-</td>;
  } else {
    return (
      <td className="w-1/4 pr-0.5">
        <div className="gap-0.5 flex flex-wrap overflow-hidden last:pb-0.5">
          {keywords &&
            keywords
              .filter((keyword) => keyword !== "")
              .map((keyword) => {
                const match = keyword.match(/([A-Za-z\s-]+)([\d+]+)?/);

                if (!match) {
                  window.alert(`Unknown keyword format: ${keyword}`);
                  return null;
                }

                const baseTag = match[1].trim();
                const count = match[2] ? match[2] : "";

                const tagDetail = getParameterCaseInsensitive(
                  tagDetails,
                  baseTag
                );
                // const tagDetail = tagDetails[baseTag];

                if (!tagDetail) {
                  window.alert(`Unknown tag: ${baseTag}`);
                  return null;
                }

                let dice = false;
                if (baseTag.charAt(baseTag.length - 1) === "d") {
                  dice = true;
                }

                return (
                  <>
                    <div
                      key={crypto.randomUUID()}
                      data-tooltip-target={`keyword-tooltip-${baseTag}`}
                      className={`first:mt-0.5 last:mb-0.5 my-0.25 inline-flex font-semibold items-center px-1 rounded ${tagDetail.textColor} ${tagDetail.bgColor} ring-2 dark:ring-1 ${tagDetail.ringColor} ring-inset truncate`}
                    >
                      {tagDetail.icon}
                      <span className="font-semibold whitespace-nowrap">
                        {dice
                          ? ` ${tagDetail.name}${count}`
                          : ` ${tagDetail.name} ${count}`}
                      </span>
                    </div>
                    <div
                      id={`keyword-tooltip-${baseTag}`}
                      role="tooltip"
                      className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
                    >
                      {tagDetail.name}
                      <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                  </>
                );
              })}
        </div>
      </td>
    );
  }
};

export default KeywordTags;
