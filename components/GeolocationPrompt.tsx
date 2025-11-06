import React from 'react';

interface GeolocationPromptProps {
  error: string | null;
  onRequest: () => void;
}

const GeolocationPrompt: React.FC<GeolocationPromptProps> = ({ error, onRequest }) => {
  return (
    <div className="p-6 m-4 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
      <div className="text-3xl text-teal-500 mb-3">
        <i className="fa-solid fa-location-crosshairs"></i>
      </div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Localisez-vous</h2>
      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
        Pour trouver les établissements les plus proches, veuillez autoriser l'accès à votre position.
      </p>
      {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
      <button
        onClick={onRequest}
        className="mt-4 w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors hover:bg-teal-700"
      >
        <i className="fa-solid fa-location-arrow mr-2"></i>
        Utiliser ma position
      </button>
    </div>
  );
};

export default GeolocationPrompt;