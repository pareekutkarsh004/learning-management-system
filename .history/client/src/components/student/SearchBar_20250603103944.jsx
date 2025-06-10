import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../../assets/assets';

const mockCourses = ['React Basics', 'Node.js Mastery', 'Data Structures', 'Algorithms 101', 'Python for AI'];

const SearchBar = ({ data = '' }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(typeof data === 'string' ? data : '');

  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  const fetchSuggestions = (query) => {
    // Simulate filtering from a course list or backend
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = mockCourses.filter((course) =>
      course.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const onSearchHandler = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput) {
      navigate('/course-list/' + encodeURIComponent(trimmedInput));
    }
  };

  const onSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setSuggestions([]);
    navigate('/course-list/' + encodeURIComponent(suggestion));
  };

  useEffect(() => {
    // Debounce input
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(input);
    }, 300); // wait 300ms
    return () => clearTimeout(debounceRef.current);
  }, [input]);

  return (
    <div className="relative w-full max-w-xl">
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

      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-200 mt-1 w-full rounded shadow">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => onSuggestionClick(item)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
