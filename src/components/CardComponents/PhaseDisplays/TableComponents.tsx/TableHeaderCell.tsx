import React from "react";

const TableHeaderCell: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ children, className }) => (
  <th className={`bg-gray-100 dark:bg-gray-700 text-left font-thin text-xs text-gray-800 dark:text-gray-200 dark:font-normal ${className}`}>{children}</th>
);

export default TableHeaderCell;
