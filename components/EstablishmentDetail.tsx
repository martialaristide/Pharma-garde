import React, { useContext, useState, useEffect } from 'react';
import type { Establishment, Review } from '../types';
import StarRating from './StarRating';
import { AuthContext } from '../contexts/AuthContext';
import AddReviewForm from './AddReviewForm';
import { updateEstablishmentStatus } from '../services/api';

interface EstablishmentDetailProps {
  establishment: Establishment;
  onClose: () => void;
  onDataRefetch: () => void;
}

const EstablishmentDetail: React.FC<EstablishmentDetailProps> = ({ establishment, onClose, onDataRefetch }) => {
    const { user } = useContext(AuthContext);
    const [optimisticReviews, setOptimisticReviews] = useState<Review[]>(establishment.reviews);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    // Sync local state with props when server data changes
    useEffect(() => {
        setOptimisticReviews(establishment.reviews);
    }, [establishment.reviews]);

    const handleReviewSubmitted = (newReview: Review) => {
        // Optimistically add the new review to the list
        setOptimisticReviews(prevReviews => [newReview, ...prevReviews]);
        // Trigger a full refetch in the background to sync with the server
        onDataRefetch();
    };

    const handleStatusChange = async () => {
        setIsUpdatingStatus(true);
        try {
            await updateEstablishmentStatus(establishment.id, !establishment.onDuty);
            alert("Le statut a été mis à jour et une notification a été envoyée aux abonnés.");
            onDataRefetch(); // Refresh data to show new status
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Erreur lors de la mise à jour du statut.");
        } finally {
            setIsUpdatingStatus(false);
        }
    }


    const formatHours = (hours: Record<string, string>) => {
        return Object.entries(hours).map(([day, time]) => (
            <div key={day} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{day}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{time}</span>
            </div>
        ));
    };
    
    const avgRating = establishment.avgRating;
    const reviewCount = optimisticReviews.length;

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            ></div>
            <div className="fixed bottom-0 left-0 right-0 max-h-[95vh] bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
                <header className="p-4 border-b dark:border-gray-700 flex items-center gap-4 flex-shrink-0 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 p-2 rounded-full leading-none h-10 w-10 flex items-center justify-center">
                        <i className="fa-solid fa-arrow-left text-xl"></i>
                    </button>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">{establishment.name}</h2>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700">
                        <img src={establishment.photoUrl} alt={`Photo de ${establishment.name}`} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="p-5">
                         <div className="flex items-center space-x-4 mb-4">
                             {establishment.onDuty && (
                                <span className="bg-yellow-100 text-yellow-800 font-bold py-1 px-2.5 rounded-full inline-flex items-center text-sm">
                                  <i className="fa-solid fa-moon mr-1.5"></i>DE GARDE
                                </span>
                              )}
                              {establishment.open24h && (
                                 <span className="bg-blue-100 text-blue-800 font-semibold py-1 px-2.5 rounded-full inline-flex items-center text-sm">
                                  <i className="fa-solid fa-clock mr-1.5"></i>24h/24
                                </span>
                              )}
                         </div>

                        <p className="text-gray-600 dark:text-gray-300"><i className="fa-solid fa-location-dot mr-2 text-gray-400 dark:text-gray-500"></i>{establishment.address}</p>
                        
                        <div className="grid grid-cols-2 gap-4 my-5">
                            <a href={`tel:${establishment.phone}`} className="bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-bold py-3 px-4 rounded-lg text-center transition-colors hover:bg-teal-100 dark:hover:bg-teal-900">
                                <i className="fa-solid fa-phone mr-2"></i>Appeler
                            </a>
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${establishment.lat},${establishment.lon}`} target="_blank" rel="noopener noreferrer" className="bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-bold py-3 px-4 rounded-lg text-center transition-colors hover:bg-teal-100 dark:hover:bg-teal-900">
                                <i className="fa-solid fa-route mr-2"></i>Itinéraire
                            </a>
                        </div>

                         {user && (
                            <div className="my-5">
                                <button 
                                    onClick={handleStatusChange}
                                    disabled={isUpdatingStatus}
                                    className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors hover:bg-yellow-600 disabled:bg-yellow-300"
                                >
                                    {isUpdatingStatus ? 'Mise à jour...' : (establishment.onDuty ? 'Retirer de la garde' : 'Mettre de garde (Test Notif)')}
                                </button>
                            </div>
                        )}

                        <div className="mt-6 border-t dark:border-gray-700 pt-5">
                            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Horaires d'ouverture</h3>
                            <div className="space-y-1">{formatHours(establishment.hours)}</div>
                        </div>

                        <div className="mt-6 border-t dark:border-gray-700 pt-5">
                             <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 dark:text-gray-100">Avis ({reviewCount})</h3>
                                {avgRating > 0 && 
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-700 dark:text-gray-300">{avgRating.toFixed(1)}</span>
                                        <StarRating rating={avgRating} />
                                    </div>
                                }
                            </div>
                            
                            {user && <AddReviewForm establishmentId={establishment.id} onReviewSubmitted={handleReviewSubmitted} />}
                            
                            <div className="space-y-4 mt-4">
                                {optimisticReviews.length > 0 ? (
                                    optimisticReviews.map(review => (
                                        <div key={review.id} className="border-b dark:border-gray-700 pb-4">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{review.userName}</p>
                                                <StarRating rating={review.rating} />
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{review.comment}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{new Date(review.created_at).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Aucun avis pour le moment. Soyez le premier à en laisser un !</p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default EstablishmentDetail;