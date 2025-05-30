import React from 'react'
import assets from "../../assets/assets";
function SearchBar() {
  return (
    <div>
        <form>
            <img src={assets.search_icon} alt="search_icon" className="w " />
        </form>
    </div>
  )
}

export default SearchBar