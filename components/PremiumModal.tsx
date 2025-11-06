import React from 'react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative text-center p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <i className="fa-solid fa-times text-xl"></i>
        </button>

        <div className="text-yellow-500 text-4xl mb-4">
          <i className="fa-solid fa-star"></i>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Passez à Pharma-Conseil Premium</h2>
        <p className="text-gray-600 mt-2">Débloquez notre assistant IA et d'autres fonctionnalités exclusives pour une expérience de santé optimisée.</p>

        <ul className="text-left space-y-3 mt-6 text-gray-700">
          <li className="flex items-center">
            <i className="fa-solid fa-check-circle text-teal-500 mr-3"></i>
            <strong>Assistant IA illimité :</strong> Posez toutes vos questions.
          </li>
          <li className="flex items-center">
            <i className="fa-solid fa-check-circle text-teal-500 mr-3"></i>
            <strong>Historique de conversations :</strong> Retrouvez vos échanges.
          </li>
          <li className="flex items-center">
            <i className="fa-solid fa-check-circle text-teal-500 mr-3"></i>
            <strong>Support prioritaire :</strong> Obtenez de l'aide plus rapidement.
          </li>
        </ul>
        
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="border-2 border-teal-500 rounded-lg p-4">
                <h3 className="font-semibold">Mensuel</h3>
                <p className="text-2xl font-bold my-1">1.500 FCFA</p>
                <p className="text-xs text-gray-500">par mois</p>
            </div>
             <div className="border border-gray-200 rounded-lg p-4 relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">ÉCONOMISEZ 20%</span>
                <h3 className="font-semibold">Annuel</h3>
                <p className="text-2xl font-bold my-1">14.400 FCFA</p>
                <p className="text-xs text-gray-500">par an</p>
            </div>
        </div>

        <a 
            href="https://payment-link.example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors hover:bg-teal-700 block"
        >
            Choisir un plan et continuer
        </a>
      </div>
    </div>
  );
};

export default PremiumModal;