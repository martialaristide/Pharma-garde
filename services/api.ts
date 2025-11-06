import type { Establishment, Coordinates, NewReviewPayload, ChatMessage, User, NewEstablishmentPayload } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message: string, public status: number, public data: any) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthToken = () => localStorage.getItem('pharmaGardeToken');

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Le serveur a répondu avec le statut ${response.status}` }));
    throw new ApiError(errorData.message || 'La requête API a échoué', response.status, errorData);
  }
  
  // For 204 No Content, which has no body to parse.
  if (response.status === 204) {
      return undefined as T;
  }

  // Clone the response to allow reading the body twice in case of error.
  const responseClone = response.clone();
  try {
    return await response.json();
  } catch (error) {
    console.error('Erreur d\'analyse JSON:', error);
    const bodyText = await responseClone.text();
    console.error('Corps de la réponse:', bodyText);
    throw new ApiError(
        'Réponse invalide du serveur. Format JSON attendu mais non reçu.', 
        response.status, 
        { body: bodyText }
    );
  }
}

// Establishment services
export const fetchEstablishments = (userCoords?: Coordinates, radius?: number): Promise<Establishment[]> => {
    let url = '/establishments';
    const params = new URLSearchParams();
    if (userCoords) {
        params.set('lat', userCoords.lat.toString());
        params.set('lon', userCoords.lon.toString());
    }
    if (radius) {
        params.set('radius', radius.toString());
    }
    if (params.toString()) {
        url += `?${params.toString()}`;
    }
    return request<Establishment[]>(url);
};

export const addEstablishment = (establishment: NewEstablishmentPayload): Promise<Establishment> => {
    return request('/establishments', {
        method: 'POST',
        body: JSON.stringify(establishment),
    });
};

export const postReview = (establishmentId: number, review: NewReviewPayload): Promise<any> => {
    return request(`/establishments/${establishmentId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review),
    });
};

export const updateEstablishmentStatus = (establishmentId: number, onDuty: boolean): Promise<void> => {
    return request(`/establishments/${establishmentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ onDuty }),
    });
};


// AI services
export const postChatMessage = (history: ChatMessage[], prompt: string): Promise<{ text: string }> => {
    return request('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ history, prompt }),
    });
};

// User services
export const fetchUserProfile = (): Promise<User> => {
    return request<User>('/user/me');
};

// Auth services
export const loginUser = (email: string, password: string): Promise<{token: string; user: User}> => {
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const registerUser = (name: string, email: string, password: string): Promise<{token: string; user: User}> => {
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });
};

// Notification services
export const getVapidKey = async (): Promise<string> => {
    const { key } = await request<{ key: string }>('/notifications/vapid-key');
    return key;
};

export const subscribeToPush = (subscription: PushSubscription): Promise<void> => {
    return request('/notifications/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
    });
};

export const unsubscribeFromPush = (subscription: PushSubscription): Promise<void> => {
    return request('/notifications/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
};