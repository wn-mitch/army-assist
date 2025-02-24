import React from "react";

const TableCell: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ children, className }) => (
  <td className={`text-sm dark:text-gray-100 ${className}`}>{children}</td>
  );

export default TableCell;