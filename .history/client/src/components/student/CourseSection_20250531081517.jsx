import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

function CourseSection() {
    const {allCourses}=useContext(AppContext);
  return (
    <div className='py-16 md:px-40 px-8'>
    <h2 className="text-3xl  font-medium text-gray-800 ">
        Learn from the best educators
    </h2>
    <p className='text-sm ms:text-base text-gray-500 mt-3'>
              Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.
    </p>
    

    <Link to={'/course-list'} onClick={()=>scrollTo(0,0)} className='text-gray-500 border border-gray-500 px-10 py-3 rounded'>Show all courses</Link>
    </div>
  )
}

export default CourseSection