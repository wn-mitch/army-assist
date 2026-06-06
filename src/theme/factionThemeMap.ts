/**
 * Resolve a 40kdc `faction_id` to a faction theme palette.
 *
 * Twelve dataset factions have a same-id palette; the rest map to the
 * nearest visual fit (livery color, not lore allegiance). Unmapped factions
 * walk `parent_faction_id` (so Space Marine successor chapters inherit a
 * sensible palette) and finally fall back to Neutral.
 */

import { factions } from "@/data/dataset";
import {
    allFactions,
    defaultTheme,
    type FactionTheme,
} from "@/theme/palettes";

const themesById = new Map(allFactions.map((theme) => [theme.id, theme]));

/** dataset faction_id → palette id (visual nearest-fit where no exact match) */
const factionToTheme: Record<string, string> = {
    // Exact id matches
    "space-wolves": "space-wolves",
    "blood-angels": "blood-angels",
    "dark-angels": "dark-angels",
    ultramarines: "ultramarines",
    necrons: "necrons",
    "tau-empire": "tau-empire",
    "imperial-fists": "imperial-fists",
    "white-scars": "white-scars",
    aeldari: "aeldari",
    drukhari: "drukhari",
    "world-eaters": "world-eaters",
    "death-guard": "death-guard",
    // Nearest visual fit
    "adepta-sororitas": "sisters-of-battle",
    "adeptus-astartes": "ultramarines", // codex-standard cobalt
    "black-templars": "sisters-of-battle", // black livery
    deathwatch: "sisters-of-battle",
    "iron-hands": "sisters-of-battle",
    "raven-guard": "sisters-of-battle",
    salamanders: "dark-angels", // green livery
    "adeptus-custodes": "imperial-fists", // auric gold
    "adeptus-mechanicus": "world-eaters", // Mars red
    "astra-militarum": "death-guard", // olive drab
    "chaos-space-marines": "world-eaters", // chaos crimson
    "chaos-daemons": "world-eaters",
    "chaos-knights": "sisters-of-battle", // black iron
    "emperors-children": "aeldari", // magenta
    "thousand-sons": "space-wolves", // turquoise (color, not allegiance)
    "genestealer-cults": "drukhari", // cult purple
    tyranids: "drukhari", // Leviathan purple
    "grey-knights": "white-scars", // bare steel
    orks: "dark-angels", // ork green
};

/**
 * Theme for a roster's faction. Walks `parent_faction_id` for unmapped
 * factions (successor chapters), Neutral when nothing matches.
 */
export function themeForFactionId(
    factionId: string | undefined | null,
): FactionTheme {
    let currentId = factionId ?? undefined;
    const visited = new Set<string>();
    while (currentId && !visited.has(currentId)) {
        visited.add(currentId);
        const themeId = factionToTheme[currentId];
        if (themeId) {
            return themesById.get(themeId) ?? defaultTheme;
        }
        currentId = factions.get(currentId)?.raw.parent_faction_id ?? undefined;
    }
    return defaultTheme;
}

/** Explicit picker lookup; undefined for unknown/empty ("auto") ids. */
export function themeById(themeId: string): FactionTheme | undefined {
    return themesById.get(themeId);
}
