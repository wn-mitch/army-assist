import React from "react";

import useStore from "@/store/store";

import factions from "@/assets/json/Factions.json";

const ListDisplayHeader = () => {
  const faction = useStore((state) => state.faction);
  const detachment =
    useStore((state) => state.detachment) || "No Detachment Provided";

  const factionName = factions.find((x) => x.id === faction)?.name;

  return (
    <div className="flex flex-row w-full mb-2 text-gray-700 font-thin">
      {factionName} - {detachment}
    </div>
  );
};

export default ListDisplayHeader;
