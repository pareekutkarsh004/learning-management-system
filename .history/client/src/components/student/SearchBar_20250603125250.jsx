import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../../assets/assets';

const SearchBar = ({ data = '' }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(typeof data === 'string' ? data : '');

  const onSearchHandler = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput) {
      navigate('/course-list/' + encodeURIComponent(trimmedInput));
    }
  };

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={onSearchHandler}
        className='w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded'
      >
        <img src={assets.search_icon} alt='search icon' className='md:w-auto w-10 px-3' />
        <input
          type='text'
          name='search'
          aria-label='Search Courses'
          placeholder='Search for courses'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='w-full h-full outline-none text-gray-500/80'
        />
        <button
          type='submit'
          className='bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1'
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
