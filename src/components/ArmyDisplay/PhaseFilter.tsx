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
  const phase = useStore(
    (state) => state.storedRosters[state.activeList]?.phase ?? Phase.Pregame,
  );
  const activePhases = useStore((state) => state.settings.activePhases);
  const setPhase = useStore((state) => state.setPhase);
  // Mobile shows a Listbox dropdown, desktop a radio row. Drive the choice from
  // a media query, not a one-shot innerWidth read: on first mount a mobile
  // browser can report a still-settling (wide) layout viewport, and no resize
  // event necessarily follows to correct it. matchMedia re-syncs on mount and
  // fires whenever the breakpoint is crossed.
  const [isDropdown, setIsDropdown] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches,
  );

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsDropdown(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="w-full">
      {isDropdown ? (
        <div className="px-3 mt-2 mb-1" id="collapsed-phases">
          <Listbox value={phase} onChange={setPhase}>
            <ListboxButton className="cursor-pointer grid w-full grid-cols-1 rounded bg-panel py-1.5 pl-3 pr-2 text-left text-text outline outline-1 -outline-offset-1 outline-panel-border focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-accent sm:text-sm shadow-sm">
              <span className="col-start-1 row-start-1 truncate pr-6">
                {phase}
              </span>
              <ChevronUpDownIcon
                aria-hidden="true"
                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-text-muted sm:size-4"
              />
            </ListboxButton>

            <ListboxOptions
              transition
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-panel-surface text-text py-1 text-xl shadow-lg ring-1 ring-panel-border focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm left-0 right-0"
            >
              {Object.values(Phase).map(
                (currentPhase) =>
                  activePhases[currentPhase] && (
                    <ListboxOption
                      key={currentPhase}
                      value={currentPhase}
                      id={`${currentPhase}-button`}
                      className="group relative cursor-pointer select-none py-2 pl-3 pr-9 text-text data-[focus]:bg-panel-hover data-[focus]:text-text data-[focus]:outline-none"
                    >
                      <span className="block truncate font-normal group-data-[selected]:font-semibold">
                        {currentPhase}
                      </span>

                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-accent group-[&:not([data-selected])]:hidden group-data-[focus]:text-text">
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
                  id={`${currentPhase}-button`}
                  value={currentPhase}
                  className={({ checked }) =>
                    classNames(
                      "flex flex-grow items-center justify-center rounded px-3 py-3 text-sm font-heading uppercase tracking-wider font-bold shadow-sm cursor-pointer focus:outline-none outline outline-2 -outline-offset-1 focus:outline-accent",
                      checked
                        ? "bg-accent text-accent-foreground hover:bg-accent-hover"
                        : "text-text-muted hover:bg-panel-hover hover:text-text"
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
