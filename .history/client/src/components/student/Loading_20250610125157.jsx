import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div
        role="status"
        aria-label="Loading"
        className="w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-blue-400 rounded-full animate-spin"
      ></div>
    </div>
  );
};

export default Loading;
