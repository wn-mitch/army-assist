import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import useStore from "@/store/store";
import { dataset } from "@/data/dataset";
import {
  unitName,
  effectiveLeaderIndex,
  type RosterUnitRow,
} from "@/data/rosterSelectors";

interface LeaderAttachmentModalProps {
  visible: boolean;
  onClose: () => void;
  /** The unit whose attachments are being managed. */
  row: RosterUnitRow;
  /** Every row in the active roster (for resolving partners by index). */
  rows: RosterUnitRow[];
  /** True when `row` is a leader (manages its bodyguards); false otherwise. */
  isLeader: boolean;
}

/** Ids of units this leader can attach to, from the dataset attachment graph. */
function bodyguardIdSet(row: RosterUnitRow): Set<string> {
  const id = row.view?.id;
  if (!id) return new Set();
  return new Set(dataset.bodyguardsAttachableFrom(id).map((u) => u.id));
}

/** Ids of leaders that can attach to this unit, from the attachment graph. */
function leaderIdSet(row: RosterUnitRow): Set<string> {
  const id = row.view?.id;
  if (!id) return new Set();
  return new Set(dataset.leadersAttachableTo(id).map((u) => u.id));
}

const LeaderAttachmentModal: React.FC<LeaderAttachmentModalProps> = ({
  visible,
  onClose,
  row,
  rows,
  isLeader,
}) => {
  const attachRosterUnit = useStore((state) => state.attachRosterUnit);
  const detachRosterUnit = useStore((state) => state.detachRosterUnit);
  const [selectedIndex, setSelectedIndex] = useState<string>("");

  const dialogShell = (title: string, body: React.ReactNode) => (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-panel-surface border border-panel-border p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="font-heading font-bold uppercase tracking-wider text-lg leading-6 text-text flex justify-between items-center"
                >
                  <span>{title}</span>
                  <button
                    type="button"
                    className="rounded text-text-dim hover:text-text-muted"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>
                <div className="mt-4">{body}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  if (isLeader) {
    // Units currently attached to this leader.
    const attached = rows.filter(
      (r) => effectiveLeaderIndex(rows, r.index) === row.index,
    );
    // Units that can be attached: eligible bodyguards not already under a leader.
    const eligible = bodyguardIdSet(row);
    const attachable = rows.filter((r) => {
      if (r.index === row.index) return false;
      if (!r.view) return false;
      if (!eligible.has(r.view.id)) return false;
      const current = effectiveLeaderIndex(rows, r.index);
      return current === null || current === row.index;
    });

    return dialogShell(
      "Manage Attached Units",
      <>
        <div className="mb-4">
          <h4 className="text-md font-heading uppercase tracking-wider text-text-muted mb-2">
            Currently Attached Units
          </h4>
          {attached.length === 0 ? (
            <p className="text-sm text-text-muted">
              No units attached to this leader
            </p>
          ) : (
            <ul className="divide-y divide-panel-border">
              {attached.map((r) => (
                <li
                  key={r.index}
                  className="py-2 flex justify-between items-center"
                >
                  <span className="text-sm text-text">
                    {unitName(r)}
                  </span>
                  <button
                    className="ml-2 p-1 text-danger bg-danger/10 hover:bg-danger/20 rounded"
                    onClick={() => detachRosterUnit(r.index)}
                    title="Detach unit"
                  >
                    <UserMinusIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4 className="text-md font-heading uppercase tracking-wider text-text-muted mb-2">
            Available Units
          </h4>
          {attachable.length === 0 ? (
            <p className="text-sm text-text-muted">
              No units available to attach
            </p>
          ) : (
            <ul className="divide-y divide-panel-border">
              {attachable
                .filter((r) => effectiveLeaderIndex(rows, r.index) !== row.index)
                .map((r) => (
                  <li
                    key={r.index}
                    className="py-2 flex justify-between items-center"
                  >
                    <span className="text-sm text-text">
                      {unitName(r)}
                    </span>
                    <button
                      className="ml-2 p-1 text-success bg-success/10 hover:bg-success/20 rounded"
                      onClick={() => attachRosterUnit(r.index, row.index)}
                      disabled={attached.length >= 1}
                      title="Attach unit to leader"
                    >
                      <UserPlusIcon className="h-5 w-5" />
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </>,
    );
  }

  // This unit can be attached to a leader.
  const leaderIds = leaderIdSet(row);
  const availableLeaders = rows.filter(
    (r) => r.index !== row.index && r.view && leaderIds.has(r.view.id),
  );
  const currentLeaderIndex = effectiveLeaderIndex(rows, row.index);
  const currentLeader =
    currentLeaderIndex !== null ? rows[currentLeaderIndex] : null;

  const handleAttach = () => {
    if (selectedIndex === "") return;
    attachRosterUnit(row.index, Number(selectedIndex));
    onClose();
  };

  const handleDetach = () => {
    detachRosterUnit(row.index);
    onClose();
  };

  return dialogShell(
    "Attach to Leader",
    <>
      {currentLeader && (
        <div className="mb-4">
          <h4 className="text-md font-heading uppercase tracking-wider text-text-muted mb-2">
            Currently Attached To
          </h4>
          <div className="flex items-center justify-between bg-panel p-3 rounded">
            <span className="text-sm font-semibold text-text">
              {unitName(currentLeader)}
            </span>
            <button
              className="ml-2 p-1 text-danger bg-danger/10 hover:bg-danger/20 rounded"
              onClick={handleDetach}
              title="Detach from leader"
            >
              <UserMinusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-md font-heading uppercase tracking-wider text-text-muted mb-2">
          Available Leaders
        </h4>
        {availableLeaders.length === 0 ? (
          <p className="text-sm text-text-muted">
            No leaders available
          </p>
        ) : (
          <>
            <div className="mb-4">
              <select
                className="mt-1 block w-full rounded border border-panel-border shadow-sm focus:border-accent focus:ring-accent bg-panel text-text p-2"
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(e.target.value)}
              >
                <option value="">-- Select a Leader --</option>
                {availableLeaders.map((r) => (
                  <option key={r.index} value={r.index}>
                    {unitName(r)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                className="inline-flex justify-center rounded border border-transparent bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:bg-accent/50"
                onClick={handleAttach}
                disabled={selectedIndex === ""}
              >
                Attach to Leader
              </button>
            </div>
          </>
        )}
      </div>
    </>,
  );
};

export default LeaderAttachmentModal;
