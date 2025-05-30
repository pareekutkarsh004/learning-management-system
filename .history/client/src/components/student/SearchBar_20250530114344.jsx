import React from 'react';
import assets from "../../assets/assets";

function SearchBar() {
  return (
      <form className="flex items-center border border-gray-500/20 rounded max-w-xl w-full md:h-14">
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
          className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-7 rounded md:py-3 md:px-10 py-2 mx-1  "
        >
          Search
        </button>
      </form>

  );
}

export default SearchBar;
