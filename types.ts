export interface Coordinates {
  lat: number;
  lon: number;
}

export type EstablishmentType = 'pharmacy' | 'hospital' | 'healthCenter';

export type FilterType = 'onDuty' | 'open24h' | EstablishmentType;

export interface Review {
  id: number;
  establishmentId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface NewReviewPayload {
    rating: number;
    comment: string;
}

export interface NewEstablishmentPayload {
  name: string;
  type: EstablishmentType;
  address: string;
  lat: number;
  lon: number;
  phone: string;
  hours: Record<string, string>;
  photoUrl?: string;
  onDuty: boolean;
  open24h: boolean;
}

export interface Establishment {
  id: number;
  name: string;
  type: EstablishmentType;
  address: string;
  lat: number;
  lon: number;
  phone: string;
  hours: Record<string, string>;
  onDuty: boolean;
  open24h: boolean;
  photoUrl: string;
  distance?: number | null;
  reviews: Review[];
  avgRating: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  membership: 'free' | 'premium';
}

export interface AuthenticatedUser {
    token: string;
    user: User;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// Types for Settings
export type Theme = 'light' | 'dark';

export interface Settings {
    theme: Theme;
    searchRadius: number; // in kilometers
}

export interface SettingsContextType {
    settings: Settings;
    setTheme: (theme: Theme) => void;
    setSearchRadius: (radius: number) => void;
    isSettingsModalOpen: boolean;
    openSettingsModal: () => void;
    closeSettingsModal: () => void;
}