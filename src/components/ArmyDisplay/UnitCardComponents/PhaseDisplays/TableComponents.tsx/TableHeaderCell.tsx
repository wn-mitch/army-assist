import React from "react";

const TableHeaderCell: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ children, className }) => (
  <th className={`bg-surface text-left font-heading uppercase tracking-wider text-xs text-text-muted ${className}`}>{children}</th>
);

export default TableHeaderCell;
