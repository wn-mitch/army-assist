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
    <table className="table-auto bg-slate-800 mt-1 mb-0.5 pb-1 px-1 rounded-lg border-separate border-spacing-0 max-w-full overflow-auto">
      <thead>
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
        <tr className="bg-slate-600 text-sm">
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
  <th className={`px-2 py-1 text-left text-md font-bold text-gray-300 ${className}`}>
    {children}
  </th>
);

const TableCell: React.FC<{ className?: string; children: React.ReactNode }> = ({ children, className }) => (
  <td className={`px-2 py-1 text-md font-semibold ${className}`}>
    {children}
  </td>
);

export default ModelSaveTable;