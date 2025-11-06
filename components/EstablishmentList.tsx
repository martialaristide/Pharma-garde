
import React from 'react';
import type { Establishment } from '../types';
import EstablishmentListItem from './EstablishmentListItem';

interface EstablishmentListProps {
  establishments: Establishment[];
  onSelect: (establishment: Establishment) => void;
}

const EstablishmentList: React.FC<EstablishmentListProps> = ({ establishments, onSelect }) => {
  return (
    <div className="px-4 space-y-3">
      {establishments.map(establishment => (
        <EstablishmentListItem
          key={establishment.id}
          establishment={establishment}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default EstablishmentList;
