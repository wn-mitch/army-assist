import StoredList from "@/types/StoredList";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import ListRow from "./ListRow";
import AddListRow from "./AddListRow";

const TableLayout = ({ storedLists }: { storedLists: StoredList[] }) => {
  const [sortField, setSortField] = useState<keyof StoredList>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof StoredList) => {
    if (sortField === field) {
      // Toggle sort order if the same field is clicked
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending order
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedLists = [...storedLists].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg lg:m-2">
      <div className="inline-block min-w-full align-middle sm:px-6">
        <table className="min-w-full divide-y divide-gray-200 my-2">
          <thead>
            <tr>
              {["name", "faction", "detachment", "created", "updated"].map(
                (field) => (
                  <th
                    key={field}
                    scope="col"
                    className="px-3 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer"
                    onClick={() => handleSort(field as keyof StoredList)}
                  >
                    <div className="group inline-flex items-center">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortField === field && (
                        <span className="ml-2">
                          {sortOrder === "asc" ? (
                            <ChevronUpIcon
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-500 dark:text-gray-300"
                            />
                          ) : (
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-500 dark:text-gray-300"
                            />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                )
              )}
              <th scope="col" className="relative py-3.5 pl-3 pr-0">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-gray-50 dark:bg-gray-800">
            {sortedLists.map((list, index) => (
              <ListRow key={index} list={list} index={index} />
            ))}
            <AddListRow />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableLayout;
