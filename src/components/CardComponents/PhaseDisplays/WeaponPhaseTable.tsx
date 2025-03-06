import React from "react";

import DatasheetWargear from "@/types/DatasheetWargear";

import KeywordTags from "@/components/CardComponents/KeywordTags";
import TableCell from "./TableComponents.tsx/TableCell";
import TableHeaderCell from "./TableComponents.tsx/TableHeaderCell";
import useStore from "@/store/store";
import Phase from "@/types/Phase";

function WeaponPhaseTable({
  weaponDatasheets,
}: {
  weaponDatasheets: DatasheetWargear[];
}) {
  const phase = useStore((state) => state.phase);

  return (
    <div className="overflow-x-auto w-full">
      <table className="table-auto w-full">
        <thead className="border dark:border-gray-600">
          <tr>
            <TableHeaderCell className="w-1/4 pl-1">Name</TableHeaderCell>
            {phase !== Phase.Fight && <TableHeaderCell className="w-1/12">R"</TableHeaderCell>}
            <TableHeaderCell className="w-1/12">WS</TableHeaderCell>
            <TableHeaderCell className="w-1/12">A</TableHeaderCell>
            <TableHeaderCell className="w-1/12">S</TableHeaderCell>
            <TableHeaderCell className="w-1/12">AP</TableHeaderCell>
            <TableHeaderCell className="w-1/12">D</TableHeaderCell>
            <TableHeaderCell className="w-1/4">KW</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {weaponDatasheets.map((weapon, index) => (
            <tr
              key={index}
              className={`border dark:border-gray-600 ${
                index % 2 === 0 ? "" : "bg-gray-100 group-hover:bg-gray-200 dark:bg-gray-900 dark:group-hover:bg-gray-800"
              } `}
            >
              <TableCell className="w-1/4 pl-1 font-semibold dark:font-bold">{weapon.name}</TableCell>
              {phase !== Phase.Fight && (
                <TableCell className="w-1/12 dark:font-semibold">
                  {weapon.range === "Melee" ? weapon.range : `${weapon.range}"`}
                </TableCell>
              )}
              <TableCell className="w-1/12 dark:font-semibold">
              {weapon.BS_WS === "N/A" ? weapon.BS_WS : `${weapon.BS_WS}+`}</TableCell>
              <TableCell className="w-1/12 dark:font-semibold">{weapon.A}</TableCell>
              <TableCell className="w-1/12 dark:font-semibold">{weapon.S}</TableCell>
              <TableCell className="w-1/12 dark:font-semibold">{weapon.AP}</TableCell>
              <TableCell className="w-1/12 dark:font-semibold">{weapon.D}</TableCell>
              <KeywordTags keywords={weapon.description?.split(", ")} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeaponPhaseTable;
