import React, { useEffect } from "react";
import useStore from "@/store/store";
import Pastebox from "./Pastebox";
import ListDisplay from "./ListDisplay";

const SingleListDisplay = ({
  activeListIndex,
}: {
  activeListIndex: number;
}) => {
  const stored = useStore((state) => state.storedRosters[activeListIndex]);
  const parseText = useStore((state) => state.parseText);

  const rawText = stored?.rawText ?? "";
  const uuid = stored?.uuid;
  const name = stored?.name;
  const hasUnits = (stored?.roster?.units.length ?? 0) > 0;
  const hasText = rawText.length > 0;

  // Reparse on demand: parseText dual-writes the native roster at this index.
  useEffect(() => {
    if (!hasUnits && hasText) {
      parseText(rawText, name ?? "", uuid);
    }
  }, [hasUnits, hasText, rawText, name, uuid, parseText]);

  if (!hasUnits && !hasText) {
    return <Pastebox />;
  } else {
    return <ListDisplay />;
  }
};

export default SingleListDisplay;
