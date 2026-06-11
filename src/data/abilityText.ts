import abilityText from "@/assets/json/abilityText.json";

/**
 * Verbatim GW raw text each Ability DSL entry was authored from, keyed by the
 * same `ability_id` slug the dataset uses. Vendored from the companion repo
 * `bmerrill17/40kdc-abilities` (`index.json`) via the `vendor:abilities` script
 * — re-run it when bumping `@alpaca-software/40kdc-data` so ids stay in sync.
 *
 * This is the displayable stand-in while the DSL describer (`describe()`) is
 * still being authored: prefer this prose, fall back to `describe()`.
 */
const rawText: Record<string, string | null> = abilityText;

/**
 * Original GW text for an ability, or `undefined` when none is vendored yet.
 * Treats missing keys and empty/whitespace entries alike as "no text", so a
 * `gwAbilityText(id) ?? view.describe()` fallback fires in both cases.
 */
export function gwAbilityText(id: string): string | undefined {
  const text = rawText[id]?.trim();
  return text ? text : undefined;
}
