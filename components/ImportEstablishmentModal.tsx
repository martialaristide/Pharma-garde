import React, { useState } from 'react';
import { addEstablishment } from '../services/api';
import type { NewEstablishmentPayload, EstablishmentType } from '../types';

interface ImportEstablishmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ImportEstablishmentModal: React.FC<ImportEstablishmentModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<EstablishmentType>('pharmacy');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [phone, setPhone] = useState('');
    const [openingDays, setOpeningDays] = useState('');
    const [openingHours, setOpeningHours] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [onDuty, setOnDuty] = useState(false);
    const [open24h, setOpen24h] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setName('');
        setType('pharmacy');
        setAddress('');
        setLat('');
        setLon('');
        setPhone('');
        setOpeningDays('');
        setOpeningHours('');
        setPhotoUrl('');
        setOnDuty(false);
        setOpen24h(false);
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!openingDays || !openingHours) {
            setError("Les jours et heures d'ouverture sont requis.");
            return;
        }

        setIsLoading(true);

        const payload: NewEstablishmentPayload = {
            name,
            type,
            address,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            phone,
            hours: { [openingDays]: openingHours },
            photoUrl,
            onDuty,
            open24h,
        };

        try {
            await addEstablishment(payload);
            resetForm();
            onSuccess();
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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative max-h-[90vh] flex flex-col">
                <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
                    <h2 className="text-xl font-bold text-gray-800">Ajouter un établissement</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-700">
                        <i className="fa-solid fa-times text-xl"></i>
                    </button>
                </header>
                
                <form id="import-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    {error && <p className="bg-red-100 text-red-700 text-sm text-center p-3 rounded-md mb-4">{error}</p>}
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Nom de l'établissement</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="type">Type</label>
                            <select id="type" value={type} onChange={(e) => setType(e.target.value as EstablishmentType)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                                <option value="pharmacy">Pharmacie</option>
                                <option value="hospital">Hôpital</option>
                                <option value="healthCenter">Centre de Santé</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">Adresse</label>
                            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lat">Latitude</label>
                                <input type="number" step="any" id="lat" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="ex: 4.0483" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lon">Longitude</label>
                                <input type="number" step="any" id="lon" value={lon} onChange={(e) => setLon(e.target.value)} placeholder="ex: 9.7043" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                            </div>
                        </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="openingDays">Jours d'ouverture</label>
                                <input type="text" id="openingDays" value={openingDays} onChange={(e) => setOpeningDays(e.target.value)} placeholder="ex: Lundi-Samedi" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="openingHours">Heures d'ouverture</label>
                                <input type="text" id="openingHours" value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} placeholder="ex: 08:00 - 20:00" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">Téléphone</label>
                            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="photoUrl">URL de la photo (Optionnel)</label>
                            <input type="url" id="photoUrl" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>

                        <div className="flex items-center space-x-6">
                            <label htmlFor="onDuty" className="flex items-center cursor-pointer">
                                <input type="checkbox" id="onDuty" checked={onDuty} onChange={(e) => setOnDuty(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                                <span className="ml-2 text-sm text-gray-700">De Garde</span>
                            </label>
                            <label htmlFor="open24h" className="flex items-center cursor-pointer">
                                <input type="checkbox" id="open24h" checked={open24h} onChange={(e) => setOpen24h(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                                <span className="ml-2 text-sm text-gray-700">Ouvert 24h/24</span>
                            </label>
                        </div>
                    </div>
                </form>

                <footer className="p-4 border-t sticky bottom-0 bg-white">
                     <button type="submit" form="import-form" disabled={isLoading} className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed flex items-center justify-center">
                        {isLoading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>}
                        {isLoading ? 'Ajout en cours...' : 'Ajouter l'établissement'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ImportEstablishmentModal;