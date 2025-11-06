import React from 'react';
import type { FilterType } from '../types';

interface FilterBarProps {
  activeFilters: FilterType[];
  onFilterToggle: (filter: FilterType) => void;
}

const filters: { id: FilterType; label: string; icon: string }[] = [
  { id: 'onDuty', label: 'De Garde', icon: 'fa-moon' },
  { id: 'open24h', label: 'Ouvert 24h/24', icon: 'fa-clock' },
  { id: 'pharmacy', label: 'Pharmacies', icon: 'fa-pills' },
  { id: 'hospital', label: 'Hôpitaux', icon: 'fa-hospital' },
  { id: 'healthCenter', label: 'Centres de Santé', icon: 'fa-clinic-medical' },
];

const FilterButton: React.FC<{
  filter: { id: FilterType; label: string; icon: string };
  isActive: boolean;
  onClick: (filter: FilterType) => void;
}> = ({ filter, isActive, onClick }) => {
  const baseClasses = "px-3.5 py-1.5 rounded-full text-sm font-medium flex items-center transition-all duration-200 ease-in-out shadow-sm border";
  const activeClasses = "bg-teal-600 text-white border-teal-600";
  const inactiveClasses = "bg-white text-gray-700 hover:bg-gray-100 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600";

  return (
    <button
      onClick={() => onClick(filter.id)}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <i className={`fa-solid ${filter.icon} mr-2 text-xs`}></i>
      {filter.label}
    </button>
  );
};


const FilterBar: React.FC<FilterBarProps> = ({ activeFilters, onFilterToggle }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-2 overflow-x-auto border-b border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
      <div className="flex space-x-2 pb-2">
        {filters.map(filter => (
          <FilterButton
            key={filter.id}
            filter={filter}
            isActive={activeFilters.includes(filter.id)}
            onClick={onFilterToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterBar;