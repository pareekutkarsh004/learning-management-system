import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import Loading from '../../student/Loading';
import assets from '../../../assets/assets'; // Make sure this contains `star`, `starBlank`, and `down_arrow_icon`
import humanizeDuration from 'humanize-duration';

function CDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures
  } = useContext(AppContext);

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
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>

      {/* Left Content */}
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

        {/* Rating Section */}
        <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
          <p className="text-sm font-medium text-yellow-600">
            {calculateRating(course)}
          </p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(course))
                    ? assets.star
                    : assets.starBlank
                }
                alt="star"
                className="w-4 h-4"
              />
            ))}
          </div>
          <p className="text-gray-500">
            ({course.courseRatings.length}{' '}
            {course.courseRatings.length > 1 ? 'ratings' : 'rating'})
          </p>
          <p>
            {course.enrolledStudents.length}{' '}
            {course.enrolledStudents.length > 1
              ? 'students enrolled'
              : 'student enrolled'}
          </p>
        </div>

        {/* Instructor Info */}
        <p className="text-sm">
          Course by{' '}
          <span className="text-blue-600 underline">
            {course.instructorName || 'Unknown Instructor'}
          </span>
        </p>

        {/* Course Structure */}
        <div className="pt-8 text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="pt-5">
            {course.courseContent.map((chapter, index) => (
              <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                {/* Chapter header */}
                <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                  <div className="flex items-center gap-2">
                    <img src={assets.down_arrow_icon} alt="arrow icon" />
                    <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                  </div>
                  <p className="text-sm md:text-default">
                    {Array.isArray(chapter.chapterContent) ? chapter.chapterContent.length : 0} lectures - {calculateChapterTime(chapter)}
                  </p>
                </div>

                {/* List of lectures */}
                <div>
                {Array.isArray(chapter.chapterContent) && (
                  <ul className="pl-10 text-sm text-gray-600 pb-2">
                    {chapter.chapterContent.map((lecture, idx) => (
                      <li key={idx}><img src={assets.play_icon} alt="play icon" className='w-4 h-4 mt-1'/> <div>
                        <p>{lecture.lectureTitle}</p>
                        <div>{lecture.isPreviewFree &&<p>preview</p>}
                        <p>{humanizeDuration (lect)}</p></div>
                      </div></li>
                    ))}
                  </ul>

                  )}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Preview Section */}
      <div className="w-full md:w-1/2">
        {/* Add video preview, image or thumbnail here */}
      </div>
    </div>
  );
}

export default CDetails;
