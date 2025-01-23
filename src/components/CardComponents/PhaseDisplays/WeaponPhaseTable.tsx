import React from "react";

import DatasheetWargear from "@/types/DatasheetWargear";

import KeywordTags from "@/components/CardComponents/KeywordTags";
import TableCell from "./TableComponents.tsx/TableCell";
import TableHeaderCell from "./TableComponents.tsx/TableHeaderCell";

function WeaponPhaseTable({
  weaponDatasheets,
}: {
  weaponDatasheets: DatasheetWargear[];
}) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="table-auto w-full">
        <thead className="border">
          <tr>
            <TableHeaderCell className="w-1/4 pl-1">Name</TableHeaderCell>
            <TableHeaderCell className="w-1/12">R"</TableHeaderCell>
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
              className={`border ${
                index % 2 === 0 ? "" : "bg-gray-100"
              } `}
            >
              <TableCell className="w-1/4 pl-1 font-semibold">{weapon.name}</TableCell>
              <TableCell className="w-1/12">
                {weapon.range === "Melee" ? weapon.range : `${weapon.range}"`}
              </TableCell>
              <TableCell className="w-1/12">{weapon.BS_WS}+</TableCell>
              <TableCell className="w-1/12">{weapon.A}</TableCell>
              <TableCell className="w-1/12">{weapon.S}</TableCell>
              <TableCell className="w-1/12">{weapon.AP}</TableCell>
              <TableCell className="w-1/12">{weapon.D}</TableCell>
              <KeywordTags keywords={weapon.description?.split(", ")} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeaponPhaseTable;
