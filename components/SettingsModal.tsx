import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { usePushNotifications } from '../hooks/usePushNotifications';

const SettingsModal: React.FC = () => {
    const { settings, setTheme, setSearchRadius, isSettingsModalOpen, closeSettingsModal } = useContext(SettingsContext);
    const pushNotifications = usePushNotifications();

    if (!isSettingsModalOpen) return null;

    const handleThemeToggle = () => {
        setTheme(settings.theme === 'light' ? 'dark' : 'light');
    };

    const renderNotificationSection = () => {
        if (!pushNotifications.isSupported) {
            return (
                <div className="opacity-50">
                    <p className="font-semibold">Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Votre navigateur n'est pas compatible avec les notifications.</p>
                </div>
            );
        }

        let statusText;
        let actionButton;

        if (pushNotifications.permission === 'denied') {
            statusText = <span className="text-red-500 font-semibold">Bloquées</span>;
            actionButton = <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Veuillez autoriser les notifications dans les paramètres de votre navigateur.</p>;
        } else if (pushNotifications.isSubscribed) {
            statusText = <span className="text-teal-500 font-semibold">Activées</span>;
            actionButton = <button onClick={pushNotifications.unsubscribe} className="text-sm text-red-500 hover:underline">Se désabonner</button>;
        } else {
            statusText = <span className="font-semibold">Désactivées</span>;
            actionButton = <button onClick={pushNotifications.subscribe} className="text-sm text-teal-600 dark:text-teal-400 hover:underline">S'abonner</button>;
        }

        return (
            <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">Notifications de garde</p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Statut: {statusText}</p>
                    {actionButton}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md relative flex flex-col max-h-[90vh]">
                <header className="p-4 border-b dark:border-gray-700 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Paramètres</h2>
                    <button onClick={closeSettingsModal} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <i className="fa-solid fa-times text-xl"></i>
                    </button>
                </header>

                <main className="p-6 overflow-y-auto space-y-6">
                    {/* Theme Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">Thème sombre</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Activez pour un confort visuel la nuit.</p>
                        </div>
                        <button onClick={handleThemeToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.theme === 'dark' ? 'bg-teal-600' : 'bg-gray-300'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {/* Search Radius Section */}
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">Rayon de recherche</p>
                            <span className="font-semibold text-teal-600 dark:text-teal-400">{settings.searchRadius} km</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Définissez la distance de recherche des établissements.</p>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            step="1"
                            value={settings.searchRadius}
                            onChange={(e) => setSearchRadius(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-teal-600"
                        />
                    </div>

                    {/* Notifications Section */}
                    {renderNotificationSection()}

                </main>
                <footer className="p-4 border-t dark:border-gray-700 flex-shrink-0 text-right">
                    <button
                        onClick={closeSettingsModal}
                        className="bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg text-sm transition-colors hover:bg-teal-700"
                    >
                        Fermer
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default SettingsModal;