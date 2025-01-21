import React from "react";

import DatasheetWargear from "@/types/DatasheetWargear";

import KeywordTags from "@/components/CardComponents/KeywordTags";

function WeaponPhaseTable({
  weaponDatasheets,
}: {
  weaponDatasheets: DatasheetWargear[];
}) {

  return (
    <table className="table-auto bg-slate-800 mt-1 mb-0.5 pb-1 px-1 rounded-lg border-separate border-spacing-0 max-w-full overflow-auto">
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
        {weaponDatasheets.map((weapon, index) => (
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
