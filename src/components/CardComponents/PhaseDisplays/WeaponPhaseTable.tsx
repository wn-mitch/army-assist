import React from "react";

import DatasheetWargear from "@/types/DatasheetWargear";

import KeywordTags from "@/components/CardComponents/KeywordTags";
import TableCell from "./TableComponents.tsx/TableCell";
import TableHeaderCell from "./TableComponents.tsx/TableHeaderCell";
import Phase from "@/types/Phase";

const WeaponPhaseTable = ({
  counts,
  weaponDatasheets,
  phase,
}: {
  counts: Record<string, number>;
  weaponDatasheets: DatasheetWargear[];
  phase: Phase;
}) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="table-auto w-full">
        <thead className="border dark:border-gray-600">
          <tr>
            <TableHeaderCell className="w-1/5 pl-1">Name</TableHeaderCell>
            <TableHeaderCell className="w-1/12">#</TableHeaderCell>
            {phase !== Phase.Fight && (
              <TableHeaderCell className="w-1/12">R"</TableHeaderCell>
            )}
            <TableHeaderCell className="w-1/12">WS</TableHeaderCell>
            <TableHeaderCell className="w-1/12">A</TableHeaderCell>
            <TableHeaderCell className="w-1/12">S</TableHeaderCell>
            <TableHeaderCell className="w-1/12">AP</TableHeaderCell>
            <TableHeaderCell className="w-1/12">D</TableHeaderCell>
            <TableHeaderCell className="w-1/5">KW</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {weaponDatasheets.map((weapon, index) => (
            <tr
              key={index}
              className={`border dark:border-gray-600 ${
                index % 2 === 0
                  ? ""
                  : "bg-gray-100 group-hover:bg-gray-200 dark:bg-gray-900 dark:group-hover:bg-gray-800"
              } `}
            >
              <TableCell className="w-1/4 px-1 font-semibold dark:font-bold">
                {weapon.name}
              </TableCell>
              <TableCell className="w-1/12 dark:font-semibold">
                {weapon.name ? counts[weapon.name] : 0}
              </TableCell>
              {phase !== Phase.Fight && (
                <TableCell className="w-1/12 dark:font-semibold">
                  {weapon.range === "Melee" ? weapon.range : `${weapon.range}"`}
                </TableCell>
              )}
              <TableCell className="w-1/12 dark:font-semibold">
                {weapon.BS_WS === "N/A" ? weapon.BS_WS : `${weapon.BS_WS}+`}
              </TableCell>
              <TableCell className="w-1/12 dark:font-semibold">
                {weapon.A}
              </TableCell>
              <TableCell className="w-1/12 dark:font-semibold">
                {weapon.S}
              </TableCell>
              <TableCell className="w-1/12 dark:font-semibold">
                {weapon.AP}
              </TableCell>
              <TableCell className="w-1/12 dark:font-semibold">
                {weapon.D}
              </TableCell>
              <KeywordTags
                key={index}
                keywords={weapon.description?.split(", ")}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeaponPhaseTable;
