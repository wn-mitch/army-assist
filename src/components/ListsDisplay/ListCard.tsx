import useStore from "@/store/store";
import StoredRoster from "@/types/StoredRoster";
import {
  rosterFactionName,
  rosterDetachmentName,
} from "@/data/rosterSelectors";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import React from "react";
import ShareListModal from "./ListCardComponents/ShareListModal";
import EditListModal from "./ListCardComponents/EditListModal";
import DeleteListButton from "./ListCardComponents/DeleteListButton";
import RefreshArmyButton from "./ListCardComponents/RefreshArmyButton";
import { formatDate } from "@/utils/ListHelper";

const ListCard = ({ list }: { list: StoredRoster; index: number }) => {
  const setActiveList = useStore((state) => state.setActiveList);

  const listName = () => {
    if (list.name && list.name !== "") {
      return list.name;
    }
    const faction = rosterFactionName(list);
    if (faction) {
      return `${faction} - ${rosterDetachmentName(list)}`;
    }
    return `Unprocessed List - Refresh`;
  };

  return (
    <ul
      tabIndex={0}
      className={`group mx-3 my-3 p-3 rounded border border-border col-span-1 flex flex-col break-inside-avoid cursor-pointer shadow-sm bg-surface focus:outline-accent focus:outline focus:outline-2 focus:-outline-offset-2 `}
    >
      <div
        className="flex flex-row pb-1"
        onClick={() => setActiveList(list.uuid)}
      >
        <div
          className={`px-2 py-1 rounded flex flex-row font-heading font-bold uppercase tracking-wider text-2xl align-middle items-center flex-grow cursor-pointer bg-panel hover:bg-panel-hover shadow-sm`}
        >
          <div className="flex-1 flex-row flex-grow text-text">
            {listName()}
          </div>
          <div className="flex flex-col gap-1 text-text">
            <ArrowRightEndOnRectangleIcon className="h-8 w-8" />
          </div>
        </div>
      </div>
      <div className="flex flex-row p-1 mb-1 text-text-muted font-semibold text-sm">
        <span className="flex-1 text-center">
          Created: {formatDate(list.created)}
        </span>
        <span className="flex-1 text-center">
          Updated: {formatDate(list.updated)}
        </span>
      </div>
      <div className="flex flex-row text-text align-middle justify-center gap-2">
        <EditListModal list={list} isDropdown={false} />
        <ShareListModal list={list} isDropdown={false} />
        <RefreshArmyButton uuid={list.uuid} isDropdown={false} />
        <DeleteListButton uuid={list.uuid} isDropdown={false} />
      </div>
    </ul>
  );
};

export default ListCard;
