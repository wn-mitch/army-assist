import React from "react";

import TableHeaderCell from "./TableComponents.tsx/TableHeaderCell";
import TableCell from "./TableComponents.tsx/TableCell";

function LeadershipOCTable({
  leadership,
  oc,
}: {
  leadership: string;
  oc: string;
}) {
  return (
    <table className="table-auto max-w-full overflow-auto w-full">
      <thead className="border dark:border-gray-600">
        <tr>
          <TableHeaderCell className="w-1/2 text-center">Ld</TableHeaderCell>
          <TableHeaderCell className="w-1/2 text-center">OC</TableHeaderCell>
        </tr>
      </thead>
      <tbody>
        <tr className="border text-center dark:border-gray-600">
          <TableCell className="w-1/2">{leadership}</TableCell>
          <TableCell className="w-1/2">{oc}</TableCell>
        </tr>
      </tbody>
    </table>
  );
}

export default LeadershipOCTable;
