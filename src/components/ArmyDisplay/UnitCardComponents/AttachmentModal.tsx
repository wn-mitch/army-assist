import React, { Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  UserMinusIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import Button from "@/components/ui/Button";
import { dataset } from "@/data/dataset";
import {
  attachedCharacterRows,
  effectiveAttachments,
  unitName,
  type AttachmentRole,
  type RosterUnitRow,
} from "@/data/rosterSelectors";
import useStore from "@/store/store";

const AutoTag: React.FC = () => (
  <span
    className="ml-2 text-xs font-normal uppercase tracking-wide text-warning"
    title="Auto-detected on import — a guess, not from the source list."
  >
    auto-attached
  </span>
);

const RoleTag: React.FC<{ role: AttachmentRole }> = ({ role }) => (
  <span className="ml-2 text-xs font-normal uppercase tracking-wide text-text-muted">
    {role === "leader" ? "Leader" : "Support"}
  </span>
);

interface AttachmentModalProps {
  visible: boolean;
  onClose: () => void;
  onManageAttachments: (index: number) => void;
  row: RosterUnitRow;
  rows: RosterUnitRow[];
}


const AttachmentModal: React.FC<AttachmentModalProps> = ({
  visible,
  onClose,
  onManageAttachments,
  row,
  rows,
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const attachRosterUnit = useStore((state) => state.attachRosterUnit);
  const detachRosterUnit = useStore((state) => state.detachRosterUnit);

  useEffect(() => {
    if (visible) titleRef.current?.focus();
  }, [row.index, visible]);

  const characterIds = new Set(
    row.view
      ? dataset.leadersAttachableTo(row.view.id).map((unit) => unit.id)
      : [],
  );
  const bodyguardIds = new Set(
    row.view
      ? dataset.bodyguardsAttachableFrom(row.view.id).map((unit) => unit.id)
      : [],
  );
  const canHost = characterIds.size > 0;
  const canAttach = bodyguardIds.size > 0;
  const attachments = effectiveAttachments(rows);
  const attachment = attachments.get(row.index) ?? {
    bodyguardIndex: null,
    role: "leader",
    provisional: false,
  };
  const attachedCharacters = attachedCharacterRows(
    rows,
    row.index,
    attachments,
  );
  const availableCharacters = rows.filter((candidate) => {
    if (
      candidate.index === row.index ||
      !candidate.view ||
      !characterIds.has(candidate.view.id)
    ) {
      return false;
    }
    return attachments.get(candidate.index)?.bodyguardIndex === null;
  });
  const availableLeaders = availableCharacters.filter(
    (candidate) => attachments.get(candidate.index)?.role === "leader",
  );
  const availableSupports = availableCharacters.filter(
    (candidate) => attachments.get(candidate.index)?.role === "support",
  );
  const currentBodyguard =
    attachment.bodyguardIndex === null
      ? undefined
      : rows.find((candidate) => candidate.index === attachment.bodyguardIndex);
  const availableBodyguards = rows.filter(
    (candidate) =>
      candidate.index !== row.index &&
      candidate.view != null &&
      bodyguardIds.has(candidate.view.id) &&
      candidate.index !== attachment.bodyguardIndex,
  );
  const hasProvisionalLink =
    attachment.provisional ||
    attachedCharacters.some(
      (candidate) => attachments.get(candidate.index)?.provisional,
    );

  const attachToBodyguard = (bodyguardIndex: number) => {
    attachRosterUnit(row.index, bodyguardIndex);
    onManageAttachments(bodyguardIndex);
  };

  const characterList = (
    heading: string,
    id: string,
    candidates: RosterUnitRow[],
  ) => (
    <section aria-labelledby={id}>
      <h4
        id={id}
        className="mb-2 font-heading text-md uppercase tracking-wider text-text-muted"
      >
        {heading}
      </h4>
      <ul aria-labelledby={id} className="divide-y divide-panel-border">
        {candidates.map((candidate) => {
          const info = attachments.get(candidate.index)!;
          const name = unitName(candidate);
          return (
            <li
              key={candidate.index}
              className="flex items-center justify-between gap-2 py-2"
            >
              <span className="min-w-0 text-sm text-text">
                {name}
                <RoleTag role={info.role} />
              </span>
              <Button
                variant="standard"
                className="shrink-0"
                onClick={() => attachRosterUnit(candidate.index, row.index)}
              >
                <UserPlusIcon className="mr-1 inline h-4 w-4" aria-hidden />
                Attach {name}
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );

  return (
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg border border-panel-border bg-panel-surface p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  ref={titleRef}
                  as="h3"
                  tabIndex={-1}
                  className="flex items-center justify-between font-heading text-lg font-bold uppercase leading-6 tracking-wider text-text"
                >
                  <span>Attachments: {unitName(row)}</span>
                  <Button
                    variant="ghost-icon"
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden />
                  </Button>
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-text-muted">
                  Attach eligible characters from this roster. Support characters can
                  join a unit that already has a leader.
                </Dialog.Description>

                <div className="mt-4 space-y-5">
                  {canHost && (
                    <>
                      <section aria-labelledby="attached-characters-heading">
                        <h4
                          id="attached-characters-heading"
                          className="mb-2 font-heading text-md uppercase tracking-wider text-text-muted"
                        >
                          Attached characters
                        </h4>
                        {attachedCharacters.length === 0 ? (
                          <p className="text-sm text-text-muted">
                            No attached characters.
                          </p>
                        ) : (
                          <ul
                            aria-labelledby="attached-characters-heading"
                            className="divide-y divide-panel-border"
                          >
                            {attachedCharacters.map((candidate) => {
                              const info = attachments.get(candidate.index)!;
                              const name = unitName(candidate);
                              return (
                                <li
                                  key={candidate.index}
                                  className="flex items-center justify-between gap-2 py-2"
                                >
                                  <span className="min-w-0 text-sm text-text">
                                    {name}
                                    <RoleTag role={info.role} />
                                    {info.provisional && <AutoTag />}
                                  </span>
                                  <Button
                                    variant="danger"
                                    className="shrink-0"
                                    onClick={() => detachRosterUnit(candidate.index)}
                                  >
                                    <UserMinusIcon
                                      className="mr-1 inline h-4 w-4"
                                      aria-hidden
                                    />
                                    Detach {name}
                                  </Button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </section>

                      {availableLeaders.length > 0 &&
                        characterList(
                          "Leaders",
                          "available-leaders-heading",
                          availableLeaders,
                        )}
                      {availableSupports.length > 0 &&
                        characterList(
                          "Support characters",
                          "available-support-characters-heading",
                          availableSupports,
                        )}
                      {availableCharacters.length === 0 && (
                        <p className="text-sm text-text-muted">
                          No eligible unattached characters in this roster.
                        </p>
                      )}
                    </>
                  )}

                  {canAttach && (
                    <section aria-labelledby="join-a-unit-heading">
                      <h4
                        id="join-a-unit-heading"
                        className="mb-2 font-heading text-md uppercase tracking-wider text-text-muted"
                      >
                        Join a unit
                      </h4>
                      {currentBodyguard && (
                        <ul
                          aria-labelledby="join-a-unit-heading"
                          className="mb-2 divide-y divide-panel-border"
                        >
                          <li className="flex items-center justify-between gap-2 py-2">
                            <span className="min-w-0 text-sm text-text">
                              Currently attached to {unitName(currentBodyguard)}
                              <RoleTag role={attachment.role} />
                              {attachment.provisional && <AutoTag />}
                            </span>
                            <Button
                              variant="danger"
                              className="shrink-0"
                              onClick={() => detachRosterUnit(row.index)}
                            >
                              <UserMinusIcon
                                className="mr-1 inline h-4 w-4"
                                aria-hidden
                              />
                              Detach from {unitName(currentBodyguard)}
                            </Button>
                          </li>
                        </ul>
                      )}
                      {availableBodyguards.length === 0 ? (
                        <p className="text-sm text-text-muted">
                          No other eligible units in this roster.
                        </p>
                      ) : (
                        <ul
                          aria-labelledby="join-a-unit-heading"
                          className="divide-y divide-panel-border"
                        >
                          {availableBodyguards.map((candidate) => {
                            const name = unitName(candidate);
                            const action = currentBodyguard ? "Move to" : "Attach to";
                            return (
                              <li
                                key={candidate.index}
                                className="flex items-center justify-between gap-2 py-2"
                              >
                                <span className="min-w-0 text-sm text-text">
                                  {name}
                                </span>
                                <Button
                                  variant="standard"
                                  className="shrink-0"
                                  onClick={() => attachToBodyguard(candidate.index)}
                                >
                                  <UserPlusIcon
                                    className="mr-1 inline h-4 w-4"
                                    aria-hidden
                                  />
                                  {action} {name}
                                </Button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </section>
                  )}

                  {hasProvisionalLink && (
                    <p className="text-xs text-warning">
                      Imported attachment links are guesses. Review them before play.
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <Button size="md" className="w-full" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AttachmentModal;
