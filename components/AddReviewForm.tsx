import React, { useState, useContext } from 'react';
import { postReview } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import type { Review } from '../types';

interface AddReviewFormProps {
    establishmentId: number;
    onReviewSubmitted: (review: Review) => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ establishmentId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Veuillez sélectionner une note.");
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            const newReview = await postReview(establishmentId, { rating, comment });
            onReviewSubmitted(newReview);
            // Reset form
            setRating(0);
            setComment('');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Impossible de soumettre l'avis.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-600">
            <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Laissez votre avis</h4>
            <form onSubmit={handleSubmit}>
                <div className="flex items-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <i
                            key={star}
                            className={`fa-solid fa-star text-2xl cursor-pointer ${
                                (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'
                            }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        ></i>
                    ))}
                </div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={`Partagez votre expérience chez cet établissement, ${user?.name}...`}
                    className="w-full p-2 border rounded-md h-24 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                    disabled={isLoading}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-teal-600 text-white font-bold py-2.5 px-4 rounded-lg text-center transition-colors hover:bg-teal-700 disabled:bg-teal-400"
                >
                    {isLoading ? 'Publication...' : 'Publier'}
                </button>
            </form>
        </div>
    );
};

export default AddReviewForm;