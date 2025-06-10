import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import Loading from '../../student/Loading';
import assets from '../../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../student/Footer';
import YouTube from 'react-youtube';

function CDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
    user,
  } = useContext(AppContext);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const foundCourse = allCourses.find(course => course._id === id);
      if (foundCourse) {
        setCourse(foundCourse);
        if (foundCourse.courseContent?.length > 0) {
          setExpandedChapters([0]);
        }
        if (user && foundCourse.enrolledStudents.includes(user._id)) {
          setIsEnrolled(true);
        }
      } else {
        console.error('Course not found');
      }
    }
  }, [allCourses, id, user]);

  const toggleChapter = (index) => {
    setExpandedChapters((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  if (!course) return <Loading />;

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Full page gradient background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-cyan-100/70 to-white"></div>

      {/* Page Content */}
      <div className="flex md:flex-row flex-col-reverse gap-10 items-start justify-between md:px-36 px-8 md:pt-30 pt-20 flex-grow">
        {/* Left Column */}
        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
            {course.courseTitle}
          </h1>

          <p
            className="py-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: course.courseDescription?.slice(0, 200) || '',
            }}
          ></p>

          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p className="text-sm font-medium text-yellow-600">
              {calculateRating(course)}
            </p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < Math.floor(calculateRating(course)) ? assets.star : assets.starBlank}
                  alt="star"
                  className="w-4 h-4"
                />
              ))}
            </div>
            <p className="text-gray-500">
              ({course.courseRatings.length} {course.courseRatings.length > 1 ? "ratings" : "rating"})
            </p>
            <p>
              {course.enrolledStudents.length} {course.enrolledStudents.length > 1 ? "students enrolled" : "student enrolled"}
            </p>
          </div>

          <p className="text-sm">
            Course by <span className="text-blue-600 underline">
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
                                      <p onClick={()=>setPlayerData({videoId:lecture.lectureUrl.split('/').pop()})} className="text-blue-500 cursor-pointer">preview</p>
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

          {/* Full Description */}
          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">Course Description</h3>
            <p className="pt-3 rich-text" dangerouslySetInnerHTML={{
              __html: course.courseDescription || '',
            }}></p>
          </div>
        </div>

        {/* Right Column (Course Card) */}
        <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden min-w-[300px] sm:min-w-[420px]">
          <img
            src={course.courseThumbnail}
            alt="Course thumbnail"
            className="w-full object-cover"
          />
          <div className="p-5 flex items-center gap-2">

          {
            playerData?<YouTube videoId={playerData.videoId} ot/>
            : <img src={assets.time_left_clock_icon} alt="clock icon" className="w-4 h-4" />
          }
            
            <p className="text-sm text-red-500">
              <span className="font-semibold">5 days</span> left at this price!
            </p>
          </div>

          <div className="flex gap-3 items-center pt-2 px-5 pb-4">
            <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
              {currency}{(course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2)}
            </p>
            <p className="md:text-lg text-gray-500 line-through">
              {currency}{course.coursePrice}
            </p>
            <p className="md:text-lg text-gray-500">
              {course.discount}% off
            </p>
          </div>

          <div className="flex justify-between items-center gap-3 px-5 pb-6 text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <img src={assets.star} alt="star icon" className="w-4 h-4" />
              <p>{calculateRating(course)}</p>
            </div>
            <div className="h-4 w-px bg-gray-500/40"></div>
            <div className="flex items-center gap-1">
              <img src={assets.time_clock_icon} alt="clock icon" className="w-4 h-4" />
              <p>{calculateCourseDuration(course)}</p>
            </div>
            <div className="h-4 w-px bg-gray-500/40"></div>
            <div className="flex items-center gap-1">
              <img src={assets.lesson_icon} alt="lesson icon" className="w-4 h-4" />
              <p>{calculateNoOfLectures(course)}</p>
            </div>
          </div>

          <div className="px-5 pb-8">
            <button
              className={`w-full py-3 rounded text-white font-medium ${isEnrolled ? 'bg-green-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              disabled={isEnrolled}
              onClick={() => setIsEnrolled(true)}
            >
              {isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </button>
            <div className='pt-6'>
              <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course?</p>
              <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer fixed properly at the bottom */}
      <Footer />
    </div>
  );
}

export default CDetails;
