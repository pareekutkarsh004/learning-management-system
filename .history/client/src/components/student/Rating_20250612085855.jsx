import React, { useEffect, useState } from 'react';

const Rating = ({ initialRating = 0, onRate }) => {
  const [rating, setRating] = useState(initialRating);
  const [clickedIndex, setClickedIndex] = useState(null);

  const handleRating = (value, index) => {
    setRating(value);
    setClickedIndex(index);
    if (onRate) onRate(value);
    setTimeout(() => setClickedIndex(null), 150); // optional click effect reset
  };

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  return (
    <div className="select-none mt-2">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        const isClicked = clickedIndex === index;

        return (
          <span
            key={index}
            onClick={() => handleRating(starValue, index)}
            className={`text-3xl sm:text-4xl transition-transform duration-150 
              ${isFilled ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'} 
              ${isClicked ? 'scale-125' : ''} 
              cursor-pointer`}
            role="button"
            tabIndex={-1}
            style={{
              userSelect: 'none',
              outline: 'none',
            }}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default Rating;