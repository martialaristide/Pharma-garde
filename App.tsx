import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import type { Establishment, FilterType, Coordinates } from './types';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import EstablishmentList from './components/EstablishmentList';
import EstablishmentDetail from './components/EstablishmentDetail';
import LoadingSpinner from './components/LoadingSpinner';
import GeolocationPrompt from './components/GeolocationPrompt';
import OfflineBanner from './components/OfflineBanner';
import ImportEstablishmentModal from './components/ImportEstablishmentModal';
import SettingsModal from './components/SettingsModal';
import { useGeolocation } from './hooks/useGeolocation';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { fetchEstablishments } from './services/api';
import { SettingsContext } from './contexts/SettingsContext';

const App: React.FC = () => {
    const [allEstablishments, setAllEstablishments] = useState<Establishment[]>([]);
    const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
    const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
    const [appError, setAppError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(() => localStorage.getItem('lastUpdated'));
    const [isImportModalOpen, setImportModalOpen] = useState(false);

    const { location, error: geoError, loading: geoLoading, requestLocation } = useGeolocation();
    const isOnline = useOnlineStatus();
    const { settings } = useContext(SettingsContext);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const loadData = useCallback(async (coords: Coordinates | null) => {
        setIsLoadingData(true);
        setAppError(null);
        try {
            const data = await fetchEstablishments(coords || undefined, settings.searchRadius);
            setAllEstablishments(data);
            if (isOnline) {
                localStorage.setItem('establishments', JSON.stringify(data));
                const now = new Date().toISOString();
                localStorage.setItem('lastUpdated', now);
                setLastUpdated(now);
            }
        } catch (err) {
            console.error('Failed to load data:', err);
            if (!isOnline) {
                const cachedData = localStorage.getItem('establishments');
                if (cachedData) {
                    setAllEstablishments(JSON.parse(cachedData));
                } else {
                    setAppError("Vous êtes hors ligne et aucune donnée n'est en cache.");
                }
            } else {
                // Online, but API request failed
                const message = err instanceof Error ? err.message : 'Une erreur inconnue est survenue.';
                setAppError(`Erreur de communication avec le serveur: ${message}`);
            }
        } finally {
            setIsLoadingData(false);
        }
    }, [isOnline, settings.searchRadius]);

    useEffect(() => {
        if (!geoLoading) {
            loadData(location);
        }
    }, [location, geoLoading, loadData]);
    
    // Refetch data when search radius changes
    useEffect(() => {
        if (location) {
             loadData(location);
        }
    }, [settings.searchRadius, location, loadData]);

    const handleFilterToggle = (filter: FilterType) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const filteredEstablishments = useMemo(() => {
        if (activeFilters.length === 0) return allEstablishments;
        return allEstablishments.filter(e => {
            return activeFilters.every(filter => {
                if (filter === 'onDuty') return e.onDuty;
                if (filter === 'open24h') return e.open24h;
                return e.type === filter;
            });
        });
    }, [allEstablishments, activeFilters]);

    const handleSelectEstablishment = (establishment: Establishment) => {
        setSelectedEstablishment(establishment);
    };

    const handleCloseDetail = () => {
        setSelectedEstablishment(null);
    };
    
    const handleDataRefetch = () => {
        loadData(location);
    };

    const handleImportSuccess = () => {
        setImportModalOpen(false);
        loadData(location);
    };

    const showGeolocationPrompt = !location && !geoLoading && !allEstablishments.length && !appError;

    const renderContent = () => {
        if (isLoadingData) {
            return <LoadingSpinner message="Recherche des établissements..." />;
        }
        if (appError) {
             return <div className="p-6 m-4 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-lg shadow-md text-center">{appError}</div>;
        }
        if (filteredEstablishments.length === 0 && allEstablishments.length > 0) {
            return <p className="text-center text-gray-500 dark:text-gray-400 p-8">Aucun établissement ne correspond à vos filtres.</p>;
        }
        if (filteredEstablishments.length === 0 && !isLoadingData) {
            return <p className="text-center text-gray-500 dark:text-gray-400 p-8">Aucun établissement trouvé à proximité.</p>;
        }
        return <EstablishmentList establishments={filteredEstablishments} onSelect={handleSelectEstablishment} />;
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {!isOnline && <OfflineBanner lastUpdated={lastUpdated} />}
            <Header onAddEstablishmentClick={() => setImportModalOpen(true)} />
            <div className="flex-1 flex overflow-hidden">
                <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    {showGeolocationPrompt ? (
                        <GeolocationPrompt error={geoError} onRequest={requestLocation} />
                    ) : (
                        <>
                            <div className="sticky top-0 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm z-20">
                                <FilterBar activeFilters={activeFilters} onFilterToggle={handleFilterToggle} />
                            </div>
                            <div className="py-4">
                                {renderContent()}
                            </div>
                        </>
                    )}
                </div>
                <div className="hidden md:flex flex-1 bg-gray-200 dark:bg-gray-700">
                     <div className="flex-1 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <i className="fas fa-map-marked-alt text-4xl mb-2"></i>
                        <p>La vue carte est en cours de développement.</p>
                      </div>
                    </div>
                </div>
            </div>
            {selectedEstablishment && (
                <EstablishmentDetail
                    establishment={selectedEstablishment}
                    onClose={handleCloseDetail}
                    onDataRefetch={handleDataRefetch}
                />
            )}
            <ImportEstablishmentModal
                isOpen={isImportModalOpen}
                onClose={() => setImportModalOpen(false)}
                onSuccess={handleImportSuccess}
            />
            <SettingsModal />
        </div>
    );
};

export default App;