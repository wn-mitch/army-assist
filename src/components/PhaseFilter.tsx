import React, { useState } from "react";
import useStore from "@/store/store";
import Phase from "@/types/Phase";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

function PhaseFilter() {
  const phase = useStore((state) => state.phase);
  const activePhases = useStore((state) => state.activePhases);
  const setPhase = useStore((state) => state.setPhase);
  const [isDropdown, setIsDropdown] = useState(window.innerWidth <= 768);

  const handleResize = () => {
    setIsDropdown(window.innerWidth <= 768);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="w-full">
      {isDropdown ? (
        <div className="px-3 mt-2 mb-1" id="collapsed-phases">
          <Listbox value={phase} onChange={setPhase}>
            <ListboxButton className="cursor-pointer grid w-full grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm shadow-sm dark:bg-gray-800 dark:text-gray-300 dark:outline-gray-600 dark:focus:outline-gray-600 dark:shadow-md">
              <span className="col-start-1 row-start-1 truncate pr-6">
                {phase}
              </span>
              <ChevronUpDownIcon
                aria-hidden="true"
                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-300"
              />
            </ListboxButton>

            <ListboxOptions
              transition
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xl shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm left-0 right-0 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600"
            >
              {Object.values(Phase).map(
                (currentPhase) =>
                  activePhases[currentPhase] && (
                    <ListboxOption
                      key={currentPhase}
                      value={currentPhase}
                      className="group relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-gray-600 data-[focus]:text-white data-[focus]:outline-none dark:text-gray-100"
                    >
                      <span className="block truncate font-normal group-data-[selected]:font-semibold">
                        {currentPhase}
                      </span>

                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                        <CheckIcon aria-hidden="true" className="size-5" />
                      </span>
                    </ListboxOption>
                  )
              )}
            </ListboxOptions>
          </Listbox>
        </div>
      ) : (
        <RadioGroup
          value={phase}
          onChange={setPhase}
          className="mx-4 mt-2 flex flex-row gap-2"
        >
          {Object.values(Phase).map(
            (currentPhase) =>
              activePhases[currentPhase] && (
                <Radio
                  key={currentPhase}
                  value={currentPhase}
                  className={({ checked }) =>
                    classNames(
                      "flex flex-grow items-center justify-center rounded-md px-3 py-3 text-sm font-semibold uppercase ring-gray-800 dark:ring-gray-200 shadow-sm dark:font-bold cursor-pointer focus:outline-none outline outline-2 -outline-offset-1 focus:outline-gray-800 dark:outline-gray-600",
                      checked
                        ? "bg-gray-500  hover:bg-gray-600 dark:hover:bg-gray-600 dark:bg-gray-500 dark:text-gray-200 dark:hover:text-gray-100 text-white"
                        : "bg-gray-100 hover:bg-gray-600 text-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-white"
                    )
                  }
                >
                  {currentPhase}
                </Radio>
              )
          )}
        </RadioGroup>
      )}
    </div>
  );
}

export default PhaseFilter;
