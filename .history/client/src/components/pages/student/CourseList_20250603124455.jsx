import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SearchBar from '../../student/SearchBar';
import { AppContext } from '../../../context/AppContext';
import CourseCard from '../../student/CourseCard';
import assets from '../../../assets/assets'; // Ensure this contains `cross_icon`

function CourseList() {
  const navigate = useNavigate();
  const { allCourses } = useContext(AppContext);
  const { input: inputParam } = useParams(); // renamed for clarity
  const [input, setInput] = useState('');
  const [filteredCourse, setFilteredCourse] = useState([]);

  // Sync the input state with the URL parameter
  useEffect(() => {
    if (inputParam) setInput(inputParam);
    else setInput('');
  }, [inputParam]);

  // Filter courses based on the current input
  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      if (input) {
        const lowerInput = input.toLowerCase();
        setFilteredCourse(
          tempCourses.filter(course =>
            course.courseTitle.toLowerCase().includes(lowerInput)
          )
        );
      } else {
        setFilteredCourse(tempCourses);
      }
    }
  }, [allCourses, input]);

  const clearInput = () => {
    setInput('');
    navigate('/course-list'); // clear URL param too
  };

  return (
    <div className='relative md:px-36 px-8 pt-20 text-left'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-6 w-full'>
        <div>
          <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
          <p className='text-gray-500'>
            <span className='text-blue-600 cursor-pointer' onClick={() => navigate('/')}>Home</span>
            / <span>Course List</span>
          </p>
        </div>
        <SearchBar input={input} setInput={setInput} />
      </div>

      {/* Removable input pill */}
      {input && (
        <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600 rounded-full w-fit'>
          <p className='text-sm'>{input}</p>
          <img
            src={assets.cross_icon}
            alt="Clear search"
            className='cursor-pointer w-4 h-4'
            onClick={clearInput}
          />
        </div>
      )}

      <div className='grid grid-cols-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 my-16 px-2 md:p-0'>
        {filteredCourse.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
}

export default CourseList;
