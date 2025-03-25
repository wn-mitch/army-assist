import React, { useEffect } from "react";
import useStore from "@/store/store";
import Pastebox from "./Pastebox";
import ListDisplay from "./ListDisplay";

const SingleListDisplay = ({
  activeListIndex,
}: {
  activeListIndex: number;
}) => {
  const activeList = useStore((state) => state.storedLists[activeListIndex]);
  const parseText = useStore((state) => state.parseText);
  const hasUnits = activeList.units.length > 0;
  const hasText = activeList.text;

  useEffect(() => {
    if (!hasUnits && hasText) {
      parseText(activeList.text, activeList.name ?? "");
    }
  }, [hasUnits, hasText, activeList.text, activeList.name, parseText]);

  if (!hasUnits && !hasText) {
    return <Pastebox />;
  } else {
    return <ListDisplay />;
  }
};

export default SingleListDisplay;
