import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SearchBar from '../../student/SearchBar';
import { AppContext } from '../../../context/AppContext';
import CourseCard from '../../student/CourseCard';

function CourseList() {
  const navigate = useNavigate();
  const { allCourses } = useContext(AppContext);
  const { input } = useParams();  // destructure the input param from URL
  const [filteredCourse, setFilteredCourse] = useState([]);

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
        <SearchBar data={input} />
      </div>

      <div className='grid grid-cols-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 my-16 px-2 md:p-0'>
        {filteredCourse.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
}

export default CourseList;
