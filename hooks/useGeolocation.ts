
import { useState, useCallback } from 'react';
import type { Coordinates } from '../types';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  location: Coordinates | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    location: null,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: "La géolocalisation n'est pas supportée par votre navigateur.",
        location: null,
      });
      return;
    }

    setState({ loading: true, error: null, location: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          location: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
        });
      },
      (error) => {
        let errorMessage = "Impossible d'obtenir la position.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Vous avez refusé l'accès à la géolocalisation.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "L'information de localisation est indisponible.";
            break;
          case error.TIMEOUT:
            errorMessage = "La demande de localisation a expiré.";
            break;
        }
        setState({
          loading: false,
          error: errorMessage,
          location: null,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { ...state, requestLocation };
};
