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
      className={`group mx-3 my-3 p-3 rounded-lg border col-span-1 flex flex-col break-inside-avoid cursor-pointer shadow-sm bg-gray-50 dark:bg-gray-800 border-gray-50 dark:border-gray-700 focus:outline-gray-800 focus:outline focus:outline-2 focus:-outline-offset-2 dark:focus:outline-gray-800 dark:focus:outline dark:focus:outline-2 dark:focus:-outline-offset-2 `}
    >
      <div
        className="flex flex-row pb-1"
        onClick={() => setActiveList(list.uuid)}
      >
        <div
          className={`px-2 py-1 rounded-lg flex flex-row font-bold text-2xl align-middle items-center flex-grow cursor-pointer bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-800 shadow-sm shadow-gray-700`}
        >
          <div className="flex-1 flex-row flex-grow text-black dark:text-gray-50">
            {listName()}
          </div>
          <div className="flex flex-col gap-1 text-black dark:text-gray-50">
            <ArrowRightEndOnRectangleIcon className="h-8 w-8" />
          </div>
        </div>
      </div>
      <div className="flex flex-row p-1 mb-1 text-gray-700 dark:text-gray-300 font-semibold text-sm">
        <span className="flex-1 text-center">
          Created: {formatDate(list.created)}
        </span>
        <span className="flex-1 text-center">
          Updated: {formatDate(list.updated)}
        </span>
      </div>
      <div className="flex flex-row text-black dark:text-gray-50 align-middle justify-center gap-2">
        <EditListModal list={list} isDropdown={false} />
        <ShareListModal list={list} isDropdown={false} />
        <RefreshArmyButton uuid={list.uuid} isDropdown={false} />
        <DeleteListButton uuid={list.uuid} isDropdown={false} />
      </div>
    </ul>
  );
};

export default ListCard;
