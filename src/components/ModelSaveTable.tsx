import React from "react";

function ModelSaveTable({
  save,
  invSave,
  fnp,
  toughness,
  wounds,
}: {
  save: string;
  invSave: string;
  fnp: string;
  toughness: string;
  wounds: string;
}) {
  return (
    <table className="table-auto bg-slate-800 mt-1 mb-0.5 py-1 px-1 rounded-lg border-separate border-spacing-0 max-w-full overflow-auto">
      <thead>
        <tr>
          <TableHeaderCell className="w-1/5">Sv</TableHeaderCell>
          <TableHeaderCell className="w-1/5">Inv</TableHeaderCell>
          <TableHeaderCell className="w-1/5">FNP</TableHeaderCell>
          <TableHeaderCell className="w-1/5">T</TableHeaderCell>
          <TableHeaderCell className="w-1/5">W</TableHeaderCell>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-slate-600 text-sm">
          <TableCell className="w-1/5">{save}</TableCell>
          <TableCell className="w-1/5">{invSave !== "-" ? `${invSave}` : "-"}</TableCell>
          <TableCell className="w-1/5">{fnp ? `${fnp}` : "-"}</TableCell>
          <TableCell className="w-1/5">{toughness}</TableCell>
          <TableCell className="w-1/5">{wounds}</TableCell>
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