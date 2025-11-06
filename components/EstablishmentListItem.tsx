import React from 'react';
import type { Establishment, EstablishmentType } from '../types';

interface EstablishmentListItemProps {
  establishment: Establishment;
  onSelect: (establishment: Establishment) => void;
}

const getIconForType = (type: EstablishmentType) => {
    switch (type) {
        case 'pharmacy': return { icon: 'fa-pills', color: 'text-teal-500', bgColor: 'bg-teal-50 dark:bg-teal-900/50' };
        case 'hospital': return { icon: 'fa-hospital', color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/50' };
        case 'healthCenter': return { icon: 'fa-clinic-medical', color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/50' };
        default: return { icon: 'fa-map-marker-alt', color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-700' };
    }
}

const EstablishmentListItem: React.FC<EstablishmentListItemProps> = ({ establishment, onSelect }) => {
  const { icon, color, bgColor } = getIconForType(establishment.type);

  return (
    <div
      onClick={() => onSelect(establishment)}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-start space-x-4 border border-gray-100 dark:border-gray-700"
    >
      <div className={`text-xl mt-1 h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg ${color} ${bgColor}`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 leading-tight">{establishment.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{establishment.address}</p>
        <div className="flex items-center flex-wrap gap-2 mt-3 text-xs">
          {establishment.onDuty && (
            <span className="bg-yellow-100 text-yellow-800 font-bold py-1 px-2.5 rounded-full inline-flex items-center">
              <i className="fa-solid fa-moon mr-1.5"></i>
              DE GARDE
            </span>
          )}
          {establishment.open24h && (
             <span className="bg-blue-100 text-blue-800 font-semibold py-1 px-2.5 rounded-full inline-flex items-center">
              <i className="fa-solid fa-clock mr-1.5"></i>
              24h/24
            </span>
          )}
          {establishment.distance && (
            <span className="text-gray-600 dark:text-gray-300 font-medium bg-gray-100 dark:bg-gray-700 py-1 px-2.5 rounded-full inline-flex items-center">
              <i className="fa-solid fa-location-arrow mr-1.5"></i>
              {establishment.distance.toFixed(1)} km
            </span>
          )}
        </div>
      </div>
       <div className="text-gray-300 dark:text-gray-600 self-center">
            <i className="fas fa-chevron-right"></i>
        </div>
    </div>
  );
};

export default EstablishmentListItem;