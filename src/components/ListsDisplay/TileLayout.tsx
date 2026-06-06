import React from "react";
import ListCard from "./ListCard";
import AddListButton from "./AddListButton";
import StoredRoster from "@/types/StoredRoster";

const TileLayout = ({
  storedRosters,
}: {
  storedRosters: StoredRoster[];
}) => {
  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-1 auto-rows-min">
      {storedRosters.map((list, index) => (
        <ListCard list={list} key={index} index={index} />
      ))}
      {AddListButton()}
    </ul>
  );
};

export default TileLayout;
