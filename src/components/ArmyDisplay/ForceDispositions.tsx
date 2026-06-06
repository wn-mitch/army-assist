import React from "react";
import useStore from "@/store/store";
import { Disclosure, DisclosureButton } from "@headlessui/react";

import { dataset, detachments, type ForceDisposition } from "@/data/dataset";
import Phase from "@/types/Phase";

/**
 * Pre-game force dispositions, surfaced from the 40kdc dataset. When the
 * detachment grants specific dispositions those are shown; until that data
 * lands upstream (most 11e-seed detachments carry none yet) the five
 * archetypes render as a reference. The dataset is authoritative — nothing
 * here is derived from the list.
 */
const ForceDispositions = () => {
  const stored = useStore((state) => state.storedRosters[state.activeList]);
  const phase = stored?.phase ?? Phase.Pregame;

  if (phase !== Phase.Pregame) return null;

  const detachment = stored?.roster?.detachment_id
    ? detachments.get(stored.roster.detachment_id)
    : undefined;
  const granted = (detachment?.force_dispositions ?? [])
    .map((id) => dataset.forceDispositions.get(id))
    .filter((d): d is ForceDisposition => d !== undefined);

  const dispositions = granted.length
    ? granted
    : dataset.forceDispositions.all;
  const label = granted.length
    ? "Force Dispositions"
    : "Force Dispositions (all five — detachment grants not yet published)";

  if (dispositions.length === 0) return null;

  return (
    <div className="mx-2 px-2" id="force-dispositions">
      <Disclosure as="div">
        {({ open }) => (
          <>
            <DisclosureButton
              id="force-dispositions-button"
              className={`font-heading uppercase tracking-wider font-bold py-2 rounded w-full shadow-sm ${
                open
                  ? "bg-accent text-accent-foreground hover:bg-accent-hover"
                  : "text-text-muted hover:bg-panel-hover hover:text-text"
              }`}
            >
              {open ? `Hide ${label}` : `Show ${label}`}
            </DisclosureButton>
            <Disclosure.Panel>
              <div className="min-[400px]:columns-2 columns-1 my-1 -mx-1">
                {dispositions.map((disposition) => (
                  <li
                    key={disposition.id}
                    className="flex flex-col break-inside-avoid first:mt-0 m-1 p-1 bg-surface rounded"
                  >
                    <div className="text-md text-text">
                      {disposition.name}
                    </div>
                    <div className="text-sm font-normal text-text">
                      {disposition.text}
                    </div>
                  </li>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default ForceDispositions;
