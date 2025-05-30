import React from 'react'
import assets from "../../assets/assets";
function SearchBar() {
  return (
    <div>
        <form>
            <img src={assets.search_icon} alt="search_icon" className="md:w-auto w-10 px-3  " />
            {/* <input
                type="text"
                placeholder="Search for courses, instructors, or topics"
                className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/> */}
            <input
                
            />
        </form>
    </div>
  )
}

export default SearchBar