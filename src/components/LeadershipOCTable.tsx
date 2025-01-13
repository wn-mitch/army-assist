import React from "react";

function LeadershipOCTable({
    leadership,
    oc,
}: {
    leadership: string;
    oc: string;
}) {
    return (
        <table className="table-auto bg-slate-800 mt-1 mb-0.5 py-1 px-1 rounded-lg border-separate border-spacing-0 max-w-full overflow-auto">
            <thead>
                <tr>
                    <TableHeaderCell className="w-1/2">Leadership</TableHeaderCell>
                    <TableHeaderCell className="w-1/2">OC</TableHeaderCell>
                </tr>
            </thead>
            <tbody>
                <tr className="bg-slate-600 text-sm">
                    <TableCell className="w-1/2">{leadership}</TableCell>
                    <TableCell className="w-1/2">{oc}</TableCell>
                </tr>
            </tbody>
        </table>
    );
}

const TableHeaderCell: React.FC<{ className?: string; children: React.ReactNode }> = ({ children, className }) => (
    <th className={`px-2 py-1 text-center text-md font-bold text-gray-300 ${className}`}>
        {children}
    </th>
);

const TableCell: React.FC<{ className?: string; children: React.ReactNode }> = ({ children, className }) => (
    <td className={`px-2 py-1 text-center text-md font-semibold ${className}`}>
        {children}
    </td>
);

export default LeadershipOCTable;