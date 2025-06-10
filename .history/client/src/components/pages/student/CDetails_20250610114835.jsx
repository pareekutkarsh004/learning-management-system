import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import Loading from '../../student/Loading';
import assets from '../../../assets/assets';
import humanizeDuration from 'humanize-duration';

function CDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState([]);

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
  } = useContext(AppContext);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const foundCourse = allCourses.find(course => course._id === id);
      if (foundCourse) {
        setCourse(foundCourse);
        if (foundCourse.courseContent?.length > 0) {
          setExpandedChapters([0]); // expand first chapter by default
        }
      } else {
        console.error('Course not found');
      }
    }
  }, [allCourses, id]);

  const toggleChapter = (index) => {
    setExpandedChapters((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

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

        {/* Rating */}
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
            ({course.courseRatings.length}{" "}
            {course.courseRatings.length > 1 ? "ratings" : "rating"})
          </p>
          <p>
            {course.enrolledStudents.length}{" "}
            {course.enrolledStudents.length > 1
              ? "students enrolled"
              : "student enrolled"}
          </p>
        </div>

        {/* Instructor */}
        <p className="text-sm">
          Course by{" "}
          <span className="text-blue-600 underline">
            {course.instructorName || "Unknown Instructor"}
          </span>
        </p>

        {/* Course Structure */}
        <div className="pt-8 text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="pt-5">
            {Array.isArray(course.courseContent) && course.courseContent.length > 0 ? (
              course.courseContent.map((chapter, index) => {
                const isOpen = expandedChapters.includes(index);
                return (
                  <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                    {/* Header */}
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                      onClick={() => toggleChapter(index)}
                      role="button"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={assets.down_arrow_icon}
                          alt="arrow icon"
                          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                        <p className="font-medium md:text-base text-sm">
                          {chapter.chapterTitle}
                        </p>
                      </div>
                      <p className="text-sm md:text-default">
                        {Array.isArray(chapter.chapterContent)
                          ? chapter.chapterContent.length
                          : 0}{" "}
                        lectures - {calculateChapterTime(chapter)}
                      </p>
                    </div>

                    {/* Content */}
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                      {Array.isArray(chapter.chapterContent) && (
                        <ul className="pl-4 text-gray-600 pr-2 py-2 md:pl-10 list-disc border-t border-gray-300">
                          {chapter.chapterContent.map((lecture, idx) => (
                            <li key={idx} className="flex items-start gap-2 py-1">
                              <img
                                src={assets.play_icon}
                                alt="play icon"
                                className="w-4 h-4 mt-1"
                              />
                              <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                                <p>{lecture.lectureTitle}</p>
                                <div className="flex gap-2">
                                  {lecture.isPreviewFree && (
                                    <p className="text-blue-500 cursor-pointer">preview</p>
                                  )}
                                  <p>
                                    {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                      units: ['h', 'm'],
                                      round: true,
                                    })}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No chapters available.</p>
            )}
          </div>
        </div>

        {/* Full Course Description */}
        <div className="py-20 text-sm md:text-default">
          <h3 className="text-xl font-semibold text-gray-800">
            Course Description
          </h3>
          <p
            className="pt-3 rich-text"
            dangerouslySetInnerHTML={{
              __html: course.courseDescription || '',
            }}
          ></p>
        </div>
      </div>

      {/* Right Column */}
      
        <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden min-w-[300px] sm:min-w-[420px]">
          <img
            src={course.courseThumbnail}
            alt="Course thumbnail"
            className="w-full object-cover"
          />
          <div className="p-5 flex items-center gap-2">
            <img
              src={assets.time_left_clock_icon}
              alt="clock icon"
              className="w-4 h-4"
            />
            <p className="text-sm text-red-500">
              <span className="font-semibold">5 days</span> left at this price!
            </p>
          </div>
          <div>
            <p></p>
          </div>
        </div>
      </div>
  );
}

export default CDetails;
