import TagDetail from "@/types/TagDetail";
import React from "react";
import {
  GiBirdClaw,
  GiAntiAircraftGun,
  GiBrainstorm,
  GiCrosshair,
  GiWeight,
  GiBloodyStash,
  GiMinigun,
  GiFlamer,
  GiOverhead,
  GiBrightExplosion,
  GiDoubled,
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

} from "react-icons/gi";

const tagDetails: { [key: string]: TagDetail } = {
  Precision: {
    icon: <GiCrosshair className="h-5 w-5" />,
    bgColor: "bg-zinc-700",
    ringColor: "ring-zinc-800",
  },
  "Lethal Hits": {
    icon: <GiPoisonBottle className="h-5 w-5" />,
    bgColor: "bg-lime-700",
    ringColor: "ring-lime-800",
  },
  "Devastating Wounds": {
    icon: <GiBloodyStash className="h-5 w-5" />,
    bgColor: "bg-red-700",
    ringColor: "ring-red-800",
  },
  Assault: {
    icon: <GiRun className="h-5 w-5" />,
    bgColor: "bg-amber-700",
    ringColor: "ring-amber-800",
  },
  Pistol: {
    icon: <GiPistolGun className="h-5 w-5" />,
    bgColor: "bg-yellow-700",
    ringColor: "ring-yellow-800",
  },
  "One-shot": {
    icon: <GiAmmoBox className="h-5 w-5" />,
    bgColor: "bg-green-700",
    ringColor: "ring-green-800",
  },
  Melta: {
    icon: <GiFlamer className="h-5 w-5" />,
    bgColor: "bg-orange-700",
    ringColor: "ring-orange-800",
  },
  "Rapid Fire": {
    icon: <GiMinigun className="h-5 w-5" />,
    bgColor: "bg-purple-700",
    ringColor: "ring-purple-800",
  },
  "Ignores Cover": {
    icon: <GiOverhead className="h-5 w-5" />,
    bgColor: "bg-emerald-700",
    ringColor: "ring-emerald-800",
  },
  "Indirect Fire": {
    icon: <GiOverhead className="h-5 w-5" />,
    bgColor: "bg-emerald-700",
    ringColor: "ring-emerald-800",
  },
  Heavy: {
    icon: <GiWeight className="h-5 w-5" />,
    bgColor: "bg-red-800",
    ringColor: "ring-red-900",
  },
  Blast: {
    icon: <GiBrightExplosion className="h-5 w-5" />,
    bgColor: "bg-cyan-700",
    ringColor: "ring-cyan-800",
  },
  "Twin-linked": {
    icon: <GiDoubled className="h-5 w-5" />,
    bgColor: "bg-sky-700",
    ringColor: "ring-sky-800",
  },
  Torrent: {
    icon: <GiFlameSpin className="h-5 w-5" />,
    bgColor: "bg-fuchsia-700",
    ringColor: "ring-fuchsia-800",
  },
  Hazardous: {
    icon: <GiRadioactive className="h-5 w-5" />,
    bgColor: "bg-pink-700",
    ringColor: "ring-pink-800",
  },
  "Anti-infantry": {
    icon: <GiMeeple className="h-5 w-5" />,
    bgColor: "bg-rose-700",
    ringColor: "ring-rose-800",
  },
  "Anti-tyranid": {
    icon: <GiMeeple className="h-5 w-5" />,
    bgColor: "bg-indigo-700",
    ringColor: "ring-indigo-800",
  },
  "Anti-fly": {
    icon: <GiAntiAircraftGun className="h-5 w-5" />,
    bgColor: "bg-indigo-700",
    ringColor: "ring-indigo-800",
  },
  "Anti-character": {
    icon: <GiHoodedAssassin className="h-5 w-5" />,
    bgColor: "bg-rose-700",
    ringColor: "ring-rose-800",
  },
  "Anti-monster": {
    icon: <GiFishMonster className="h-5 w-5" />,
    bgColor: "bg-rose-700",
    ringColor: "ring-rose-800",
  },
  "Anti-vehicle": {
    icon: <GiTank className="h-5 w-5" />,
    bgColor: "bg-indigo-700",
    ringColor: "ring-indigo-800",
  },
  Lance: {
    icon: <GiSpearHook className="h-5 w-5" />,
    bgColor: "bg-pink-800",
    ringColor: "ring-pink-900",
  },
  "Extra Attacks": {
    icon: <GiSwordArray className="h-5 w-5" />,
    bgColor: "bg-indigo-700",
    ringColor: "ring-indigo-800",
  },
  "Sustained Hits d": {
    icon: <GiSwordArray className="h-5 w-5" />,
    bgColor: "bg-rose-800",
    ringColor: "ring-rose-900",
  },
  "Sustained Hits": {
    icon: <GiSwordArray className="h-5 w-5" />,
    bgColor: "bg-rose-800",
    ringColor: "ring-rose-900",
  },
  Psychic: {
    icon: <GiBrainstorm className="h-5 w-5" />,
    bgColor: "bg-purple-800",
    ringColor: "ring-purple-900",
  },
  "snagged": {
    icon: <GiCatch className="h-5 w-5" />,
    bgColor: "bg-green-800",
    ringColor: "ring-green-900",
  },
  "linked fire": {
    icon: <GiLinkedRings className="h-5 w-5" />,
    bgColor: "bg-lime-800",
    ringColor: "ring-lime-900",
  },
  "dead choppy": {
    icon: <GiBirdClaw className="h-5 w-5" />,
    bgColor: "bg-cyan-800",
    ringColor: "ring-cyan-900",
  },
};

function KeywordTags({ keywords }: { keywords: string[] | undefined }) {
  if (!keywords) {
    return null;
  } else {
    return (
      <td className="gap-1 items-center align-middle overflow-clip">
        <div className="flex flex-wrap gap-1 overflow-hidden">
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

              return (
                <div
                  key={keyword}
                  className={`inline-flex font-semibold items-center gap-1 px-1 py-0.5 first:mt-0.5 last:mb-0.5 mx-0.5 rounded text-white ${tagDetail.bgColor} ring-2 ${tagDetail.ringColor} ring-inset truncate`}
                >
                  {tagDetail.icon}
                  <span className="font-bold whitespace-nowrap">
                    {baseTag} {count}
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
