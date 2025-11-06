import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Settings, Theme, SettingsContextType } from '../types';

const defaultSettings: Settings = {
    theme: 'light',
    searchRadius: 10, // Default 10km
};

const getInitialSettings = (): Settings => {
    try {
        const storedSettings = localStorage.getItem('pharmaGardeSettings');
        if (storedSettings) {
            const parsed = JSON.parse(storedSettings);
            // Ensure all keys from defaultSettings are present
            return { ...defaultSettings, ...parsed };
        }
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
    }
    return defaultSettings;
};

export const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    setTheme: () => {},
    setSearchRadius: () => {},
    isSettingsModalOpen: false,
    openSettingsModal: () => {},
    closeSettingsModal: () => {},
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(getInitialSettings);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    useEffect(() => {
        // Apply theme to the root element
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(settings.theme);

        // Save settings to localStorage whenever they change
        try {
            localStorage.setItem('pharmaGardeSettings', JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save settings to localStorage", error);
        }
    }, [settings]);

    const setTheme = useCallback((theme: Theme) => {
        setSettings(s => ({ ...s, theme }));
    }, []);

    const setSearchRadius = useCallback((radius: number) => {
        setSettings(s => ({ ...s, searchRadius: radius }));
    }, []);
    
    const openSettingsModal = useCallback(() => setIsSettingsModalOpen(true), []);
    const closeSettingsModal = useCallback(() => setIsSettingsModalOpen(false), []);

    const value = {
        settings,
        setTheme,
        setSearchRadius,
        isSettingsModalOpen,
        openSettingsModal,
        closeSettingsModal
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};