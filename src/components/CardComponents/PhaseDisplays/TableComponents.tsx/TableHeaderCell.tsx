import React from "react";

const TableHeaderCell: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ children, className }) => (
  <th className={`text-left font-thin text-xs text-gray-800 ${className}`}>{children}</th>
);

export default TableHeaderCell;
