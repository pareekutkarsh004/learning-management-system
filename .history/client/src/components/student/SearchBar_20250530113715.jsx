import React from 'react';
import assets from "../../assets/assets";

function SearchBar() {
  return (
    <div className="w-full max-w-3xl mx-auto my-4">
      <form className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm">
        <img
          src={assets.search_icon}
          alt="search_icon"
          className="w-5 h-5 mr-2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search for courses, instructors, or topics"
          className="flex-grow outline-none text-gray-700 placeholder-gray-400"
        />
        <button
          type="submit"
          className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded   "
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
