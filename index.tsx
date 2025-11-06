import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Utiliser un chemin relatif pour éviter les problèmes de cross-origin
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('Service Worker enregistré avec succès:', registration.scope);
      })
      .catch(error => {
        console.log('Échec de l\'enregistrement du Service Worker:', error);
      });
  });
}


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);