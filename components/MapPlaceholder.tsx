
import React from 'react';

const MapPlaceholder: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-200 flex items-center justify-center text-gray-500">
      <div className="text-center">
        <i className="fas fa-map-marked-alt text-4xl mb-2"></i>
        <p>La vue carte est en cours de développement.</p>
      </div>
    </div>
  );
};

export default MapPlaceholder;
