import React, { useState } from "react";
import useStore from "@/store/store";
import Phase from "@/types/Phase";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  RadioGroup,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

function PhaseFilter() {
  const phase = useStore((state) => state.phase);
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
        <div className="px-3 mt-2 mb-1">
          <Listbox value={phase} onChange={setPhase}>
            <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm shadow-sm">
              <span className="col-start-1 row-start-1 truncate pr-6">
                {phase}
              </span>
              <ChevronUpDownIcon
                aria-hidden="true"
                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </ListboxButton>

            <ListboxOptions
              transition
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xl shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm left-0 right-0"
            >
              {Object.values(Phase).map((currentPhase) => (
                <ListboxOption
                  key={currentPhase}
                  value={currentPhase}
                  className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-gray-600 data-[focus]:text-white data-[focus]:outline-none"
                >
                  <span className="block truncate font-normal group-data-[selected]:font-semibold">
                    {currentPhase}
                  </span>

                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                    <CheckIcon aria-hidden="true" className="size-5" />
                  </span>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </div>
      ) : (
        <RadioGroup
          value={phase}
          onChange={setPhase}
          className="mx-4 mt-2 grid grid-cols-3 gap-3 sm:grid-cols-6"
        >
          {Object.values(Phase).map((currentPhase) => (
            <RadioGroup.Option
              key={currentPhase}
              value={currentPhase}
              className={({ checked }) =>
                classNames(
                  "flex items-center justify-center rounded-md px-3 py-3 text-sm font-semibold uppercase text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50",
                  checked
                    ? "bg-gray-600 text-white ring-0"
                    : "bg-white text-gray-900",
                  "cursor-pointer focus:outline-none"
                )
              }
            >
              {currentPhase}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}

export default PhaseFilter;
