import React from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../../context/AppContext'
// import Loading from '../../Loading'
import 
function CDetails() {
  const {id}=useParams();
  const [course, setCourse] = React.useState(null);
  const {allCourses} = React.useContext(AppContext);
  const fetchCourseDetails = () => {
    const foundCourse = allCourses.find(course => course._id === id);
    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      console.error('Course not found');
    }

  };
  React.useEffect(() => {
    fetchCourseDetails();
  }, []);
  return course? (
    <>
    <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
      {/* Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>

      {/* Left Column */}
      <div className="w-full md:w-1/2">
        {/* Add course content or details */}
        <h1>{course.courseTitle}</h1>
        <p>{course.courseDescription}</p>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/2">
        {/* Add video, resources, etc */}
      </div>
    </div>
    </>
  ):<Loading/>
  
}

export default CDetails