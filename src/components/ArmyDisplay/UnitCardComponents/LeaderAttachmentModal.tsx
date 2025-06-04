import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import useStore from '@/store/store';
import Datasheets from '@/assets/json/Datasheets.json';
import ListUnit from '@/types/ListUnit';

interface LeaderAttachmentModalProps {
  visible: boolean;
  onClose: () => void;
  unit: ListUnit;
  isLeader: boolean;
}

const LeaderAttachmentModal: React.FC<LeaderAttachmentModalProps> = ({
  visible,
  onClose,
  unit,
  isLeader,
}) => {
  const { getAttachableUnits, getLeadersForUnit, attachUnitToLeader, detachUnitFromLeader } = useStore();
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const getActiveList = useStore((state) => state.getActiveList);
  const activeListId = useStore((state) => state.activeList);
  const activeList = getActiveList();
  
  if (!activeList) return null;
  
  // Handle the case where this unit is a leader
  if (isLeader) {
    // Get units already attached to this leader
    const attachedUnits = unit.attached_units 
      ? activeList.units.filter(u => unit.attached_units?.includes(String(u.id)))
      : [];
      
    // Get units that can be attached to this leader
    const attachableUnits = activeList.units.filter(u => {
      // Skip if it's the leader itself
      if (u.id === unit.id) return false;
      
      // Skip if it's already attached to another leader
      if (u.attached_to_leader_id && unit.datasheet && u.attached_to_leader_id !== String(unit.datasheet.id)) return false;
      
      // Check if this leader can lead this unit
      return u.datasheet && unit.datasheet && 
        getAttachableUnits(unit.datasheet.id).includes(u.datasheet.id);
    });
    
    // Handle attaching a unit to this leader
    const handleAttach = (unitId: number) => {
      // The order is correct here: leader ID, then unit ID
      attachUnitToLeader(activeListId, String(unit.id), String(unitId));
    };
    
    // Handle detaching a unit from this leader
    const handleDetach = (unitId: number) => {
      detachUnitFromLeader(activeListId, String(unitId));
    };
    
    // Get datasheet name for a unit
    const getUnitName = (unit: ListUnit): string => {
      const datasheet = Datasheets.find(sheet => sheet.id === unit.datasheet?.id);
      return unit.name || datasheet?.name || 'Unknown Unit';
    };
    
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex justify-between items-center"
                  >
                    <span>Manage Attached Units</span>
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>
                  
                  <div className="mt-4">
                    <div className="mb-4">
                      <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Currently Attached Units
                      </h4>
                      {attachedUnits.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No units attached to this leader
                        </p>
                      ) : (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                          {attachedUnits.map(attachedUnit => (
                            <li key={attachedUnit.id} className="py-2 flex justify-between items-center">
                              <span className="text-sm text-gray-800 dark:text-gray-200">
                                {getUnitName(attachedUnit)}
                              </span>
                              <button
                                className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded"
                                onClick={() => handleDetach(attachedUnit.id)}
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
                      <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Available Units
                      </h4>
                      {attachableUnits.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No units available to attach
                        </p>
                      ) : (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                          {attachableUnits.map(attachableUnit => (
                            <li key={attachableUnit.id} className="py-2 flex justify-between items-center">
                              <span className="text-sm text-gray-800 dark:text-gray-200">
                                {getUnitName(attachableUnit)}
                              </span>
                              <button
                                className="ml-2 p-1 text-green-600 hover:bg-green-100 rounded"
                                onClick={() => handleAttach(attachableUnit.id)}
                                disabled={(unit.attached_units?.length ?? 0) >= 1}
                                title="Attach unit to leader"
                              >
                                <UserPlusIcon className="h-5 w-5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  } 
  // Handle the case where this unit can be attached to a leader
  else {
    // Get leaders that this unit can be attached to
    const availableLeaders = activeList.units.filter(u => {
      // Skip if it's this unit
      if (u.datasheet && unit.datasheet && u.datasheet.id === unit.datasheet.id) return false;
      
      // Check if this unit can be attached to the leader
      return u.datasheet && unit.datasheet && 
        getLeadersForUnit(unit.datasheet.id).includes(u.datasheet.id);
    });
    
    // Find the current leader if this unit is attached
    const currentLeaderId = unit.attached_to_leader_id;
    const currentLeader = currentLeaderId 
      ? activeList.units.find(u => String(u.id) === currentLeaderId)
      : null;
    
    // Handle attaching this unit to a selected leader
    const handleAttach = () => {
      if (!selectedUnitId) return;
      attachUnitToLeader(activeListId, unit.id.toString(), selectedUnitId);
      onClose();
    };
    
    // Handle detaching this unit from its leader
    const handleDetach = () => {
      if (currentLeaderId) {
        detachUnitFromLeader(activeListId, String(unit.id));
      }
      onClose();
    };
    
    // Get datasheet name for a unit
    const getLeaderName = (leader: ListUnit): string => {
      const datasheet = Datasheets.find(sheet => sheet.id === leader.datasheet?.id);
      return leader.name || datasheet?.name || 'Unknown Leader';
    };
    
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex justify-between items-center"
                  >
                    <span>Attach to Leader</span>
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>
                  
                  <div className="mt-4">
                    {currentLeader && (
                      <div className="mb-4">
                        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Currently Attached To
                        </h4>
                        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {getLeaderName(currentLeader)}
                          </span>
                          <button
                            className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded"
                            onClick={handleDetach}
                            title="Detach from leader"
                          >
                            <UserMinusIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Available Leaders
                      </h4>
                      {availableLeaders.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No leaders available
                        </p>
                      ) : (
                        <>
                          <div className="mb-4">
                            <select
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white p-2"
                              value={selectedUnitId || ''}
                              onChange={(e) => setSelectedUnitId(e.target.value)}
                            >
                              <option value="">-- Select a Leader --</option>
                              {availableLeaders.map(leader => (
                                <option key={leader.id} value={leader.id}>
                                  {getLeaderName(leader)}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="flex justify-end">
                            <button
                              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                              onClick={handleAttach}
                              disabled={!selectedUnitId}
                            >
                              Attach to Leader
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }
};

export default LeaderAttachmentModal;
