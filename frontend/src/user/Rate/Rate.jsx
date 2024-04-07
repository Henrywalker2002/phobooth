import React, { useState } from 'react';
import RatingDialog from './RatingDialog';

const Rate = () => {
  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  return (
    <div>
      {/* <h2>Rate this product</h2>
      <div>
        {[...Array(5)].map((_, index) => (
          <button
            key={index}
            onClick={() => handleRatingChange(index + 1)}
            style={{ color: index < rating ? 'gold' : 'gray' }}
          >
            ★
          </button>
        ))}
      </div>
      <p>You rated this product: {rating}</p> */}
      
    </div>
  );
};

export default Rate;
