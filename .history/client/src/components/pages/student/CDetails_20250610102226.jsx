import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import Loading from '../../student/Loading';
import assets
function CDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  const { allCourses, currency, calculateRating } = useContext(AppContext);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const foundCourse = allCourses.find(course => course._id === id);
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        console.error('Course not found');
      }
    }
  }, [allCourses, id]);

  if (!course) return <Loading />;

  return (
    <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
      {/* Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>

      {/* Left Column */}
      <div className="max-w-xl z-10 text-gray-500">
        <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-grey-800">
          {course.courseTitle}
        </h1>
        <p
          className="py-4 md:text-base text-sm"
          dangerouslySetInnerHTML={{
            __html: course.courseDescription?.slice(0, 200) || '',
          }}
        ></p>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-yellow-600">{calculateRating(course)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(calculateRating(course)) ? star : starBlank}
                alt="star"
                className="w-4 h-4"
              />
            ))}
          </div>
          <p className="text-gray-500">({course.courseRatings.length})</p>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/2">
        {/* Embed video, thumbnail, or preview content here */}
      </div>
    </div>
  );
}

export default CDetails;
