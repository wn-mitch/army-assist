import useStore from "@/store/store";
import StoredList from "@/types/StoredList";
import React, { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import ShareListModal from "./ListCardComponents/ShareListModal";
import EditListModal from "./ListCardComponents/EditListModal";
import DeleteListButton from "./ListCardComponents/DeleteListButton";
import RefreshArmyButton from "./ListCardComponents/RefreshArmyButton";
import { formatDate} from "@/utils/ListHelper";

const ListRow = ({ list, index }: { list: StoredList; index: number }) => {
  const setActiveList = useStore((state) => state.setActiveList);

  const listName = () => {
    if (list.name && list.name !== "") {
      return list.name;
    } else {
      if (list.faction) {
        return `${list.faction} - ${list.detachment}`;
      } else {
        return `Unprocessed List - Refresh`;
      }
    }
  };

  const [isDropdown, setIsDropdown] = useState(window.innerWidth <= 840);

  const handleResize = () => {
    setIsDropdown(window.innerWidth <= 840);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <tr
      key={index}
      className="hover:bg-gray-100 hover:dark:bg-gray-900 cursor-pointer"
      onClick={() => setActiveList(list.uuid)}
    >
      <td className="whitespace-nowrap px-3 text-md font-semibold text-gray-900 dark:text-gray-100">
        {listName()}
      </td>
      <td className="whitespace-nowrap px-3 text-gray-500 dark:text-gray-300">
        {list.faction ? list.faction : "-"}
      </td>
      <td className="whitespace-nowrap px-3 text-gray-500 dark:text-gray-300">
        {list.detachment ? list.detachment : "-"}
      </td>
      <td className="whitespace-nowrap px-3 text-gray-500 dark:text-gray-300">
        {formatDate(list.created)}
      </td>
      <td className="whitespace-nowrap px-3 text-gray-500 dark:text-gray-300">
        {formatDate(list.updated)}
      </td>
      <td
        className="relative whitespace-nowrap py-1.5 text-center text-sm sm:pr-0"
        onClick={(e) => e.stopPropagation()}
      >
        {!isDropdown ? (
          <>
            <EditListModal list={list} isDropdown={isDropdown} />
            <ShareListModal
              list={list}
              isDropdown={isDropdown}
            />
            <RefreshArmyButton uuid={list.uuid} isDropdown={isDropdown} />
            <DeleteListButton uuid={list.uuid} isDropdown={isDropdown} />
          </>
        ) : (
          <div className="">
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-30 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu>
                      {() => (
                        <EditListModal
                          list={list}
                          isDropdown={isDropdown}
                        />
                      )}
                    </Menu>
                    <Menu>
                      {() => (
                        <ShareListModal
                          list={list}
                          isDropdown={isDropdown}
                        />
                      )}
                    </Menu>
                    <Menu>
                      {() => (
                        <RefreshArmyButton
                          uuid={list.uuid}
                          isDropdown={isDropdown}
                        />
                      )}
                    </Menu>
                    <Menu>
                      {() => (
                        <DeleteListButton
                          uuid={list.uuid}
                          isDropdown={isDropdown}
                        />
                      )}
                    </Menu>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        )}
      </td>
    </tr>
  );
};

export default ListRow;
