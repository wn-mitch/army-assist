import React from "react";
import TableCell from "./TableComponents.tsx/TableCell";
import TableHeaderCell from "./TableComponents.tsx/TableHeaderCell";

function ModelSaveTable({
  save,
  invSave,
  fnp,
  toughness,
  wounds,
  leadership,
}: {
  save: string;
  invSave: string;
  fnp: string;
  toughness: string;
  wounds: string;
  leadership: string;
}) {
  return (
    <table className="table-auto w-full overflow-auto">
      <thead className="border dark:border-gray-600">
        <tr>
          <TableHeaderCell className="w-1/6 pl-1">Sv</TableHeaderCell>
          <TableHeaderCell className="w-1/6">Inv</TableHeaderCell>
          <TableHeaderCell className="w-1/6">FNP</TableHeaderCell>
          <TableHeaderCell className="w-1/6">T</TableHeaderCell>
          <TableHeaderCell className="w-1/6">W</TableHeaderCell>
          <TableHeaderCell className="w-1/6">Ld</TableHeaderCell>
        </tr>
      </thead>
      <tbody>
        <tr className="text-sm border dark:border-gray-600">
          <TableCell className="w-1/6 pl-1 dark:font-semibold">{save}</TableCell>
          <TableCell className="w-1/6 dark:font-semibold">{invSave !== "-" ? `${invSave}` : "-"}</TableCell>
          <TableCell className="w-1/6 dark:font-semibold">{fnp ? `${fnp}` : "-"}</TableCell>
          <TableCell className="w-1/6 dark:font-semibold">{toughness}</TableCell>
          <TableCell className="w-1/6 dark:font-semibold">{wounds}</TableCell>
          <TableCell className="w-1/6 dark:font-semibold">{leadership}</TableCell>
        </tr>
      </tbody>
    </table>
  );
}

export default ModelSaveTable;