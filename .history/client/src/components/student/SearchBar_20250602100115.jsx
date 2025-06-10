import React, { useState } from 'react';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ data = '' }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data);

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate('/course-list/' + input.trim());
    }
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded'
    >
      <img src={assets.search_icon} alt='search_icon' className='md:w-auto w-10 px-3' />
      <input
        name="search"
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type='text'
        placeholder='Search for courses'
        className='w-full h-full outline-none text-gray-500/80'
      />
      <button
        type='submit'
        disabled={!input.trim()}
        className={`bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1 ${!input.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
