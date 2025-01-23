import React from "react";

const TableCell: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ children, className }) => (
  <td className={`text-sm ${className}`}>{children}</td>
  );

export default TableCell;