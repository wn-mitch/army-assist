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
} from "react-icons/gi";

const tagDetails: { [key: string]: TagDetail } = {
  Precision: {
    icon: <GiCrosshair className="h-5 w-5" />,
    bgColor: "bg-zinc-200 dark:bg-zinc-900",
    ringColor: "ring-zinc-900 dark:ring-zinc-500",
    textColor: "text-zinc-800 dark:text-zinc-200",
  },
  "Lethal Hits": {
    icon: <GiPoisonBottle className="h-5 w-5" />,
    bgColor: "bg-lime-200 dark:bg-lime-900",
    ringColor: "ring-lime-900 dark:ring-lime-500",
    textColor: "text-lime-800 dark:text-lime-200",
  },
  "Devastating Wounds": {
    icon: <GiBloodyStash className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  Assault: {
    icon: <GiRun className="h-5 w-5" />,
    bgColor: "bg-amber-200 dark:bg-amber-900",
    ringColor: "ring-amber-900 dark:ring-amber-500",
    textColor: "text-amber-800 dark:text-amber-200",
  },
  Pistol: {
    icon: <GiPistolGun className="h-5 w-5" />,
    bgColor: "bg-yellow-200 dark:bg-yellow-900",
    ringColor: "ring-yellow-900 dark:ring-yellow-500",
    textColor: "text-yellow-800 dark:text-yellow-200",
  },
  "One-shot": {
    icon: <GiAmmoBox className="h-5 w-5" />,
    bgColor: "bg-green-200 dark:bg-green-900",
    ringColor: "ring-green-900 dark:ring-green-500",
    textColor: "text-green-800 dark:text-green-200",
  },
  Melta: {
    icon: <GiFlamer className="h-5 w-5" />,
    bgColor: "bg-orange-200 dark:bg-orange-900",
    ringColor: "ring-orange-900 dark:ring-orange-500",
    textColor: "text-orange-800 dark:text-orange-200",
  },
  "Melta d": {
    icon: <GiFlamer className="h-5 w-5" />,
    bgColor: "bg-orange-200 dark:bg-orange-900",
    ringColor: "ring-orange-900 dark:ring-orange-500",
    textColor: "text-orange-800 dark:text-orange-200",
  },
  "Rapid Fire": {
    icon: <GiMinigun className="h-5 w-5" />,
    bgColor: "bg-purple-200 dark:bg-purple-900",
    ringColor: "ring-purple-900 dark:ring-purple-500",
    textColor: "text-purple-800 dark:text-purple-200",
  },
  "Rapid Fire d": {
    icon: <GiMinigun className="h-5 w-5" />,
    bgColor: "bg-purple-200 dark:bg-purple-900",
    ringColor: "ring-purple-900 dark:ring-purple-500",
    textColor: "text-purple-800 dark:text-purple-200",
  },
  "Ignores Cover": {
    icon: <GiOverhead className="h-5 w-5" />,
    bgColor: "bg-emerald-200 dark:bg-emerald-900",
    ringColor: "ring-emerald-900 dark:ring-emerald-500",
    textColor: "text-emerald-800 dark:text-emerald-200",
  },
  "Indirect Fire": {
    icon: <GiOverhead className="h-5 w-5" />,
    bgColor: "bg-emerald-200 dark:bg-emerald-900",
    ringColor: "ring-emerald-900 dark:ring-emerald-500",
    textColor: "text-emerald-800 dark:text-emerald-200",
  },
  Heavy: {
    icon: <GiWeight className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  Blast: {
    icon: <GiBrightExplosion className="h-5 w-5" />,
    bgColor: "bg-orange-200 dark:bg-orange-900",
    ringColor: "ring-orange-900 dark:ring-orange-500",
    textColor: "text-orange-800 dark:text-orange-200",
  },
  "Twin-linked": {
    icon: <GiDoubleShot className="h-5 w-5" />,
    bgColor: "bg-sky-200 dark:bg-sky-900",
    ringColor: "ring-sky-900 dark:ring-sky-500",
    textColor: "text-sky-800 dark:text-sky-200",
  },
  Torrent: {
    icon: <GiFlameSpin className="h-5 w-5" />,
    bgColor: "bg-orange-200 dark:bg-orange-900",
    ringColor: "ring-orange-900 dark:ring-orange-500",
    textColor: "text-orange-800 dark:text-orange-200",
  },
  Hazardous: {
    icon: <GiRadioactive className="h-5 w-5" />,
    bgColor: "bg-lime-200 dark:bg-lime-900",
    ringColor: "ring-lime-900 dark:ring-lime-500",
    textColor: "text-lime-800 dark:text-lime-200",
  },
  "Anti-infantry": {
    icon: <GiMeeple className="h-5 w-5" />,
    bgColor: "bg-rose-200 dark:bg-rose-900",
    ringColor: "ring-rose-900 dark:ring-rose-500",
    textColor: "text-rose-800 dark:text-rose-200",
  },
  "Anti-tyranid": {
    icon: <GiAlienBug className="h-5 w-5" />,
    bgColor: "bg-purple-200 dark:bg-purple-900",
    ringColor: "ring-purple-900 dark:ring-purple-500",
    textColor: "text-purple-800 dark:text-purple-200",
  },
  "Anti-walker": {
    icon: <GiMissileMech className="h-5 w-5" />,
    bgColor: "bg-indigo-200 dark:bg-indigo-900",
    ringColor: "ring-indigo-900 dark:ring-indigo-500",
    textColor: "text-indigo-800 dark:text-indigo-200",
  },
  "Anti-fly": {
    icon: <GiAntiAircraftGun className="h-5 w-5" />,
    bgColor: "bg-indigo-200 dark:bg-indigo-900",
    ringColor: "ring-indigo-900 dark:ring-indigo-500",
    textColor: "text-indigo-800 dark:text-indigo-200",
  },
  "Anti-character": {
    icon: <GiHoodedAssassin className="h-5 w-5" />,
    bgColor: "bg-rose-200 dark:bg-rose-900",
    ringColor: "ring-rose-900 dark:ring-rose-500",
    textColor: "text-rose-800 dark:text-rose-200",
  },
  "Anti-monster": {
    icon: <GiFishMonster className="h-5 w-5" />,
    bgColor: "bg-rose-200 dark:bg-rose-900",
    ringColor: "ring-rose-900 dark:ring-rose-500",
    textColor: "text-rose-800 dark:text-rose-200",
  },
  "Anti-vehicle": {
    icon: <GiTank className="h-5 w-5" />,
    bgColor: "bg-indigo-200 dark:bg-indigo-900",
    ringColor: "ring-indigo-900 dark:ring-indigo-500",
    textColor: "text-indigo-800 dark:text-indigo-200",
  },
  "Anti-titanic": {
    icon: <GiGiant className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  "Anti-daemon": {
    icon: <GiPentacle className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  "Anti-chaos": {
    icon: <GiPentacle className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  "Anti-psyker": {
    icon: <GiBrainTentacle className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  "Anti-Epic hero": {
    icon: <GiHelmet className="h-5 w-5" />,
    bgColor: "bg-red-200 dark:bg-red-900",
    ringColor: "ring-red-900 dark:ring-red-500",
    textColor: "text-red-800 dark:text-red-200",
  },
  Lance: {
    icon: <GiSpearHook className="h-5 w-5" />,
    bgColor: "bg-pink-200 dark:bg-pink-900",
    ringColor: "ring-pink-900 dark:ring-pink-500",
    textColor: "text-pink-800 dark:text-pink-200",
  },
  "Extra Attacks": {
    icon: <GiSwordArray className="h-5 w-5" />,
    bgColor: "bg-indigo-200 dark:bg-indigo-900",
    ringColor: "ring-indigo-900 dark:ring-indigo-500",
    textColor: "text-indigo-800 dark:text-indigo-200",
  },
  "Sustained Hits d": {
    icon: <GiGunshot className="h-5 w-5" />,
    bgColor: "bg-rose-200 dark:bg-rose-900",
    ringColor: "ring-rose-900 dark:ring-rose-500",
    textColor: "text-rose-800 dark:text-rose-200",
  },
  "Sustained Hits": {
    icon: <GiGunshot className="h-5 w-5" />,
    bgColor: "bg-rose-200 dark:bg-rose-900",
    ringColor: "ring-rose-900 dark:ring-rose-500",
    textColor: "text-rose-800 dark:text-rose-200",
  },
  Psychic: {
    icon: <GiBrainstorm className="h-5 w-5" />,
    bgColor: "bg-purple-200 dark:bg-purple-900",
    ringColor: "ring-purple-900 dark:ring-purple-500",
    textColor: "text-purple-800 dark:text-purple-200",
  },
  "snagged": {
    icon: <GiCatch className="h-5 w-5" />,
    bgColor: "bg-green-200 dark:bg-green-900",
    ringColor: "ring-green-900 dark:ring-green-500",
    textColor: "text-green-800 dark:text-green-200",
  },
  "linked fire": {
    icon: <GiLinkedRings className="h-5 w-5" />,
    bgColor: "bg-lime-200 dark:bg-lime-900",
    ringColor: "ring-lime-900 dark:ring-lime-500",
    textColor: "text-lime-800 dark:text-lime-200",
  },
  "dead choppy": {
    icon: <GiBirdClaw className="h-5 w-5" />,
    bgColor: "bg-cyan-200 dark:bg-cyan-900",
    ringColor: "ring-cyan-900 dark:ring-cyan-500",
    textColor: "text-cyan-800 dark:text-cyan-200",
  },
  "conversion": {
    icon: <GiBodySwapping className="h-5 w-5" />,
    bgColor: "bg-purple-200 dark:bg-purple-900",
    ringColor: "ring-purple-900 dark:ring-purple-500",
    textColor: "text-purple-800 dark:text-purple-200",
  },
  "plasma warhead": {
    icon: <GiPlasmaBolt className="h-5 w-5" />,
    bgColor: "bg-orange-200 dark:bg-orange-900",
    ringColor: "ring-orange-900 dark:ring-orange-400",
    textColor: "text-orange-800 dark:text-orange-200",
  },
  "psychic assassin": {
    icon: <GiHood className="h-5 w-5" />,
    bgColor: "bg-indigo-200 dark:bg-indigo-900",
    ringColor: "ring-indigo-900 dark:ring-indigo-500",
    textColor: "text-indigo-800 dark:text-indigo-200",
  },
  "harpooned": {
    icon: <GiWhaleTail className="h-5 w-5" />,
    bgColor: "bg-indigo-200 dark:bg-indigo-900",
    ringColor: "ring-indigo-900 dark:ring-indigo-500",
    textColor: "text-indigo-800 dark:text-indigo-200",
  },
};

function KeywordTags({ keywords }: { keywords: string[] | undefined }) {
  if (!keywords) {
    return null;
  } else {
    return (
      <td className="w-1/4 overflow-clip">
        <div className="gap-0.5 flex flex-wrap overflow-hidden">
          {keywords
            .filter((keyword) => keyword !== "")
            .map((keyword) => {
              const match = keyword.match(/([A-Za-z\s-]+)([\d+]+)?/);

              if (!match) {
                window.alert(`Unknown keyword format: ${keyword}`);
                return null;
              }

              const baseTag = match[1].trim();
              const count = match[2] ? match[2] : "";

              const tagDetail = tagDetails[baseTag];

              if (!tagDetail) {
                window.alert(`Unknown tag: ${baseTag}`);
                return null;
              }

              let dice = false;
              if (baseTag.charAt(baseTag.length - 1) === "d") {
                dice = true;
              }

              return (
                <div
                  key={keyword}
                  className={`first:mt-0.5 last:mb-0.5 my-0.25 inline-flex font-semibold items-center px-1 rounded ${tagDetail.textColor} ${tagDetail.bgColor} ring-2 dark:ring-1 ${tagDetail.ringColor} ring-inset truncate`}
                >
                  {tagDetail.icon}
                  <span className="font-semibold whitespace-nowrap">
                    {dice ? `${baseTag}${count}` : `${baseTag} ${count}`}
                  </span>
                </div>
              );
            })}
        </div>
      </td>
    );
  }
}

export default KeywordTags;
