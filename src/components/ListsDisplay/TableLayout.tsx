import StoredRoster from "@/types/StoredRoster";
import {
  rosterFactionName,
  rosterDetachmentName,
} from "@/data/rosterSelectors";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import ListRow from "./ListRow";
import AddListRow from "./AddListRow";

type SortField = "name" | "faction" | "detachment" | "created" | "updated";

/** Derived string used to sort a roster by the clicked column. */
const sortValue = (stored: StoredRoster, field: SortField): string => {
  switch (field) {
    case "name":
      return stored.name ?? "";
    case "faction":
      return rosterFactionName(stored);
    case "detachment":
      return rosterDetachmentName(stored);
    case "created":
      return stored.created ?? "";
    case "updated":
      return stored.updated ?? "";
  }
};

const TableLayout = ({
  storedRosters,
}: {
  storedRosters: StoredRoster[];
}) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort order if the same field is clicked
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending order
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedLists = [...storedRosters].sort((a, b) => {
    const aValue = sortValue(a, sortField);
    const bValue = sortValue(b, sortField);
    return sortOrder === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  return (
    <div className="bg-surface border border-border rounded lg:m-2">
      <div className="block min-w-full align-middle overflow-x-auto sm:px-6">
        <table className="min-w-full divide-y divide-border my-2">
          <thead>
            <tr>
              {(
                [
                  "name",
                  "faction",
                  "detachment",
                  "created",
                  "updated",
                ] as SortField[]
              ).map((field) => (
                <th
                  key={field}
                  scope="col"
                  className="px-3 py-2 text-left text-sm font-heading font-semibold uppercase tracking-wider text-text-muted cursor-pointer"
                  onClick={() => handleSort(field)}
                >
                  <div className="group inline-flex items-center">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortField === field && (
                      <span className="ml-2">
                        {sortOrder === "asc" ? (
                          <ChevronUpIcon
                            aria-hidden="true"
                            className="h-5 w-5 text-text-muted"
                          />
                        ) : (
                          <ChevronDownIcon
                            aria-hidden="true"
                            className="h-5 w-5 text-text-muted"
                          />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th scope="col" className="relative py-3.5 pl-3 pr-0">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
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
