import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { SettingsContext } from '../contexts/SettingsContext';
import AuthModal from './AuthModal';
import PremiumModal from './PremiumModal';
import AIAssistant from './AIAssistant';
import Logo from './Logo';

interface HeaderProps {
    onAddEstablishmentClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddEstablishmentClick }) => {
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isPremiumModalOpen, setPremiumModalOpen] = useState(false);
    const [isAiAssistantOpen, setAiAssistantOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { openSettingsModal } = useContext(SettingsContext);

    const handleOpenAIAssistant = () => {
        if (user) {
            setAiAssistantOpen(true);
        } else {
            setAuthModalOpen(true);
        }
    };

    return (
        <>
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm p-4 sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <Logo />
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleOpenAIAssistant}
                        className="bg-yellow-100 text-yellow-800 font-bold py-2 px-4 rounded-full text-sm inline-flex items-center transition-transform hover:scale-105"
                    >
                        <i className="fa-solid fa-robot mr-2"></i>
                        Pharma-Conseil
                    </button>
                    {user ? (
                        <div className="relative group">
                             <button className="h-10 w-10 bg-teal-600 text-white rounded-full font-bold flex items-center justify-center">
                                {user.name.charAt(0).toUpperCase()}
                            </button>
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible border dark:border-gray-700">
                                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                </div>
                                <a href="#" onClick={(e) => { e.preventDefault(); onAddEstablishmentClick(); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <i className="fa-solid fa-plus fa-fw text-gray-500 mr-2"></i>
                                    Ajouter un lieu
                                </a>
                                <a href="#" onClick={(e) => { e.preventDefault(); openSettingsModal(); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <i className="fa-solid fa-gear fa-fw text-gray-500 mr-2"></i>
                                    Paramètres
                                </a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setPremiumModalOpen(true); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <i className="fa-solid fa-star fa-fw text-yellow-500 mr-2"></i>
                                    Passer Premium
                                </a>
                                <a href="#" onClick={logout} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-t dark:border-gray-700">
                                    <i className="fa-solid fa-arrow-right-from-bracket fa-fw text-gray-500 mr-2"></i>
                                    Déconnexion
                                </a>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setAuthModalOpen(true)}
                            className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors hover:bg-teal-700"
                        >
                            Connexion
                        </button>
                    )}
                </div>
            </header>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
            <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setPremiumModalOpen(false)} />
            <AIAssistant isOpen={isAiAssistantOpen} onClose={() => setAiAssistantOpen(false)} />
        </>
    );
};

export default Header;