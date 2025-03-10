import React from "react";

const CardValue = (label: string, value: string | undefined) => (
  <span className="flex-1 text-center">
    <span className="font-medium">{label}: </span>
    {value}
  </span>
);

export default CardValue