import React from 'react'
import assets from "../../assets/assets";
function SearchBar() {
  return (
    <div>
        <form>
            <img src={assets.search_icon} alt="search_icon" className="md:w-auto w-10 px-3  " />
        </form>
    </div>
  )
}

export default SearchBar