import React from "react";

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
    <table className="table-auto w-full overflow-auto text-center">
      <thead className="border">
        <tr>
          <TableHeaderCell className="w-1/6">Sv</TableHeaderCell>
          <TableHeaderCell className="w-1/6">Inv</TableHeaderCell>
          <TableHeaderCell className="w-1/6">FNP</TableHeaderCell>
          <TableHeaderCell className="w-1/6">T</TableHeaderCell>
          <TableHeaderCell className="w-1/6">W</TableHeaderCell>
          <TableHeaderCell className="w-1/6">Ld</TableHeaderCell>
        </tr>
      </thead>
      <tbody>
        <tr className="text-sm border">
          <TableCell className="w-1/6">{save}</TableCell>
          <TableCell className="w-1/6">{invSave !== "-" ? `${invSave}` : "-"}</TableCell>
          <TableCell className="w-1/6">{fnp ? `${fnp}` : "-"}</TableCell>
          <TableCell className="w-1/6">{toughness}</TableCell>
          <TableCell className="w-1/6">{wounds}</TableCell>
          <TableCell className="w-1/6">{leadership}</TableCell>
        </tr>
      </tbody>
    </table>
  );
}

const TableHeaderCell: React.FC<{ className?: string; children: React.ReactNode }> = ({ children, className }) => (
    <th
      scope="col"
      className={`font-thin text-xs text-gray-700 ${className}`}
    >
    {children}
  </th>
);

const TableCell: React.FC<{ className?: string; children: React.ReactNode }> = ({ children, className }) => (
  <td className={`${className}`}>
    {children}
  </td>
);

export default ModelSaveTable;