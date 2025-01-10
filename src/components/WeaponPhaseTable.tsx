import React from "react";

import Datasheet from "@/types/Datasheet";
import useStore from "@/store/store";
import ListUnit from "@/types/ListUnit";

import datasheetWargear from "@/assets/json/Datasheets_wargear.json";
import KeywordTags from "./KeywordTags";

function WeaponPhaseTable({
  unit,
  datasheet,
}: {
  unit: ListUnit;
  datasheet: Datasheet;
}) {
  const phase = useStore((state) => state.phase);

  if (unit.children && unit.children.length > 0) {
    const details = unit.children.map((child) => child.details).join(", ");
    unit.details = [unit.details, details].join(", ");
    unit.children = [];
  }

  const weapons = unit.details
    ?.split(", ")
    .filter((name) => name === "Warlord")
    .map((name) => name.replace(/^\d+x?\s*/, "").trim());

  const availableWeaponDatasheets = datasheetWargear
    .filter((wargear) =>
      phase === "Shooting"
        ? wargear.type === "Ranged"
        : wargear.type === "Melee"
    )
    .filter((wargear) => datasheet.id === wargear.datasheet_id)
    .filter((weapon) =>
      (weapons ?? []).some((name) => {
        return weapon.name?.toLowerCase().includes(name.toLowerCase());
      })
    );

  return (
    <table className="table-auto bg-slate-800 mt-1 mb-0.5 py-1 px-1 rounded-lg border-separate border-spacing-0 w-full">
      <thead>
        <tr>
          <TableHeaderCell className="w-1/4">Name</TableHeaderCell>
          <TableHeaderCell className="w-1/12">WS</TableHeaderCell>
          <TableHeaderCell className="w-1/12">R"</TableHeaderCell>
          <TableHeaderCell className="w-1/12">A</TableHeaderCell>
          <TableHeaderCell className="w-1/12">S</TableHeaderCell>
          <TableHeaderCell className="w-1/12">AP</TableHeaderCell>
          <TableHeaderCell className="w-1/12">D</TableHeaderCell>
          <TableHeaderCell className="w-1/4">KW</TableHeaderCell>
        </tr>
      </thead>
      <tbody>
        {availableWeaponDatasheets.map((weapon, index) => (
          <tr
            key={index}
            className={`${
              index % 2 === 0 ? "bg-slate-600" : "bg-slate-700"
            } text-sm`}
          >
            <TableCell className="w-1/4">{weapon.name}</TableCell>
            <TableCell className="w-1/12">{weapon.BS_WS}+</TableCell>
            <TableCell className="w-1/12">
              {weapon.range === "Melee" ? weapon.range : `${weapon.range}"`}
            </TableCell>
            <TableCell className="w-1/12">{weapon.A}</TableCell>
            <TableCell className="w-1/12">{weapon.S}</TableCell>
            <TableCell className="w-1/12">{weapon.AP}</TableCell>
            <TableCell className="w-1/12">{weapon.D}</TableCell>
            <KeywordTags keywords={weapon.description?.split(", ")} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TableHeaderCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`uppercase font-bold text-left text-gray-200 px-2 py-1 ${className}`}
    >
      {children}
    </th>
  );
}

function TableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-2 py-1 ${className}`}>{children}</td>;
}

export default WeaponPhaseTable;
