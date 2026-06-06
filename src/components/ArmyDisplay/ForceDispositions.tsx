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
              className={`font-semibold py-2 rounded-lg w-full shadow-sm dark:font-bold ${
                open
                  ? "bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-600 dark:bg-gray-500 dark:text-gray-200 dark:hover:text-gray-100 text-white"
                  : "bg-gray-100 hover:bg-gray-600 text-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-white"
              }`}
            >
              {open ? `Hide ${label}` : `Show ${label}`}
            </DisclosureButton>
            <Disclosure.Panel>
              <div className="min-[400px]:columns-2 columns-1 my-1 -mx-1">
                {dispositions.map((disposition) => (
                  <li
                    key={disposition.id}
                    className="flex flex-col break-inside-avoid first:mt-0 m-1 p-1 bg-white dark:bg-gray-800 rounded-lg"
                  >
                    <div className="text-md text-gray-900 dark:text-gray-100">
                      {disposition.name}
                    </div>
                    <div className="text-sm font-thin text-gray-800 dark:text-gray-200 dark:font-normal">
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
