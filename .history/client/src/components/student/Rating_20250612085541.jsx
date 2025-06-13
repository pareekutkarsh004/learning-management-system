import React, { useEffect, useState } from 'react';

const Rating = ({ initialRating = 0, onRate }) => {
  const [rating, setRating] = useState(initialRating);
  const [clickedIndex, setClickedIndex] = useState(null);

  const handleRating = (value, index) => {
    setRating(value);
    setClickedIndex(index); // trigger animation
    if (onRate) onRate(value);

    // remove animation class after short time
    setTimeout(() => setClickedIndex(null), 150);
  };

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  return (
    <div className="select-none">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        const isClicked = clickedIndex === index;

        return (
          <span
            key={index}
            onClick={() => handleRating(starValue, index)}
            className={`text-2xl sm:text-3xl transition-transform duration-150 
              ${isFilled ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'} 
              ${isClicked ? 'scale-125' : ''} 
              cursor-pointer`}
            style={{ userSelect: 'none' }}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
