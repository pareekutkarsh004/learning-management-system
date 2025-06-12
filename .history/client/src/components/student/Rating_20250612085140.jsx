import React from 'react';

function Rating({ initialRating = 0, onRate = () => { } }) {
  const [rating, setRating] = React.useState(initialRating);

  const handleRate = (value) => {
    setRating(value);
    onRate(value); // trigger callback
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`text-xl sm:text-2xl cursor-pointer transition-colors ${starValue <= rating
                ? 'text-yellow-500'
                : 'text-gray-300 hover:text-yellow-400'
              }`}
            onClick={() => handleRate(starValue)}
          >
            &#9733; {/* Unicode star character */}
          </span>
        );
      })}
    </div>
  );
}

export default Rating;
