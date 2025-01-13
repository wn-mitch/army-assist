import React from 'react';
import useStore from '@/store/store';
import ListUnitCard from './ListUnitCard';
import FilterPanel from './FilterPanel';

function ListDisplay() {
  const units = useStore((state) => state.units);

  return (
    <div className='flex flex-col gap-2 w-full'>
      <FilterPanel />
      {/* // TODO: Army Rule Panel */}
      {/* // TODO: Stratagem Panel */}
      <ul role="list" className='columns-1 xl:columns-3 lg:columns-2 md:columns-1 gap-2 auto-rows-min'>
        {units.map((unit) => (
          <ListUnitCard key={unit.id} unit={unit} />
        ))}
      </ul>
    </div>
  );
}

export default ListDisplay;