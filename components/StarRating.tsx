import React from 'react';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5, className = '' }) => {
  const roundedRating = Math.round(rating);

  return (
    <div className={`flex items-center text-sm ${className}`}>
      {[...Array(totalStars)].map((_, i) => (
        <i key={i} className={`fa-solid fa-star ${i < roundedRating ? 'text-yellow-500' : 'text-gray-300'}`}></i>
      ))}
    </div>
  );
};

export default StarRating;