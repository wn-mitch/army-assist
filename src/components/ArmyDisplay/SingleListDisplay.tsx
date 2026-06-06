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
  const hasRoster = !!stored?.roster;
  const hasText = rawText.length > 0;
  // A failed import records importFailure with the rawText preserved. Don't
  // auto-retry those (it would loop on unparseable text) — surface the Pastebox.
  const importFailed = !!stored?.importFailure;

  // Reparse on demand: a list with text but no parsed roster and no recorded
  // failure was never imported (e.g. a legacy/url add). Parse it once.
  useEffect(() => {
    if (!hasRoster && hasText && !importFailed) {
      parseText(rawText, name ?? "", uuid);
    }
  }, [hasRoster, hasText, importFailed, rawText, name, uuid, parseText]);

  if (!hasRoster) {
    return <Pastebox />;
  } else {
    return <ListDisplay />;
  }
};

export default SingleListDisplay;
