import React  from "react";
import useStore from "@/store/store";
import { Disclosure, DisclosureButton } from "@headlessui/react";

const ArmyRuleDisplay = () => {
  const faction = useStore((state) => state.faction);
  const detachment =
    useStore((state) => state.detachment) || "No Detachment Provided";
  const phase = useStore((state) => state.phase);
  const getArmyAbilities = useStore((state) => state.getArmyAbilities);
  const abilities = getArmyAbilities().filter((ability) =>
    ability.phases.includes(phase)
  );

  const abilitiesInPhase = abilities.length !== 0;

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="mx-2 px-2">
      <Disclosure as="div">
        {({ open }) => (
          <>
            <DisclosureButton
              className={({ open }) =>
                classNames(
                  "font-semibold py-2 rounded-lg w-full shadow-sm dark:font-bold",
                  open
                    ? "bg-gray-500  hover:bg-gray-600 dark:hover:bg-gray-600 dark:bg-gray-500 dark:text-gray-200 dark:hover:text-gray-100 text-white"
                    : "bg-gray-100 hover:bg-gray-600 text-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-white"
                )
              }
            >
              {open
                ? `${faction} - ${detachment} - Hide Detachment Rules`
                : `${faction} - ${detachment} - Show Detachment Rules`}
            </DisclosureButton>
            <Disclosure.Panel>
              {abilitiesInPhase ? (
                <div
                  className={`${
                    abilities.length > 1
                      ? "min-[400px]:columns-2 columns-1"
                      : "columns-1"
                  } my-1 -mx-1`}
                >
                  {abilities.map((ability, index) => (
                    <li
                      key={index}
                      className={`flex flex-col break-inside-avoid first:mt-0 m-1 p-1 bg-white dark:bg-gray-800 rounded-lg`}
                    >
                      <div className="text-md text-gray-900 dark:text-gray-100">
                        {ability.name} - {ability.type} Rule
                      </div>
                      <div className="text-sm font-thin text-gray-800 dark:text-gray-200 dark:font-normal">
                        {ability.description}
                      </div>
                    </li>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-thin text-gray-800 text-center dark:text-gray-200 dark:font-normal">
                  No Army or Detachment Rule in Phase
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default ArmyRuleDisplay;
