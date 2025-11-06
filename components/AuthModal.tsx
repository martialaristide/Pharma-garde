import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue s'est produite.");
      }
    } finally {
        setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <i className="fa-solid fa-times text-xl"></i>
        </button>
        
        <div className="flex border-b mb-6">
          <button 
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`w-1/2 py-3 font-semibold text-center ${activeTab === 'login' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
          >
            Se connecter
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setError(null); }}
            className={`w-1/2 py-3 font-semibold text-center ${activeTab === 'signup' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
          >
            S'inscrire
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-center mb-1 text-gray-800">
            {activeTab === 'login' ? 'Content de vous revoir !' : 'Créer votre compte'}
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            {activeTab === 'login' ? 'Connectez-vous pour accéder à vos services.' : 'Rejoignez-nous pour une meilleure expérience.'}
          </p>

          {error && <p className="bg-red-100 text-red-700 text-sm text-center p-3 rounded-md mb-4">{error}</p>}

          {activeTab === 'signup' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Nom complet</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Adresse e-mail</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Mot de passe</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed flex items-center justify-center">
            {isLoading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>}
            {isLoading ? 'Chargement...' : (activeTab === 'login' ? 'Se connecter' : 'Créer mon compte')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
