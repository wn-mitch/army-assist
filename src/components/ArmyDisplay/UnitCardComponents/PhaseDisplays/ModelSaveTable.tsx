import React from "react";
import TableCell from "./TableComponents.tsx/TableCell";
import TableHeaderCell from "./TableComponents.tsx/TableHeaderCell";

function ModelSaveTable({
  save,
  invSave,
  invSaveDescr,
  fnp,
  toughness,
  wounds,
  leadership,
}: {
  save: string;
  invSave: string;
  invSaveDescr?: string;
  fnp: string;
  toughness: string;
  wounds: string;
  leadership: string;
}) {
  return (
    <table className="table-auto w-full overflow-auto">
      <thead className="border border-border">
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
        <tr className="text-sm border border-border">
          <TableCell className="w-1/6 pl-1 font-semibold">{save}</TableCell>
          <TableCell className="w-1/6 font-semibold">
            {invSave !== "-" ? `${invSave}` : "-"}
            {invSaveDescr ? <div className="text-xs text-text-muted">({invSaveDescr})</div> : null}
          </TableCell>
          <TableCell className="w-1/6 font-semibold">{fnp ? `${fnp}` : "-"}</TableCell>
          <TableCell className="w-1/6 font-semibold">{toughness}</TableCell>
          <TableCell className="w-1/6 font-semibold">{wounds}</TableCell>
          <TableCell className="w-1/6 font-semibold">{leadership}</TableCell>
        </tr>
      </tbody>
    </table>
  );
}

export default ModelSaveTable;