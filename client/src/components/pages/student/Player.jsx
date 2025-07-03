import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import { useParams } from 'react-router-dom';
import assets from '../../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import Footer from '../../student/Footer';
import Rating from '../../student/Rating';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../student/Loading';

function Player() {
  const { enrolledCourses, calculateChapterTime , backendUrl, getToken, userData,
    fetchUserEnrolledCourses} = useContext(AppContext);

  const { courseId, lectureId } = useParams();
  
  const [course, setCourse] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null)
  const [initialRating, setInitialRating] = useState(0)


const getCourseData =()=>{
  enrolledCourses.map((course)=>{
    if(course._id === courseId){
      setCourse(course)
      course.courseRatings.map((item)=>{ 
        if(item.userId === userData._id){
          setInitialRating(item.rating)
        }
      })
    }
  })
}

  // useEffect(() => {
  //   const selectedCourse = enrolledCourses.find(course => course._id === courseId);
  //   if (selectedCourse) {
  //     setCourse(selectedCourse);
  //   }
  // }, [courseId, enrolledCourses]);

  const toggleChapter = (index) => {
    setExpandedChapters((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  useEffect(()=>{
    if(enrolledCourses.length >0){
      getCourseData()
    }
  },[enrolledCourses])


  const markLectureAsCompleted = async()=>{
    try {
      const token = await getToken();
      const {data} = await axios.post(`${backendUrl}/api/user/update-course-progress`,
        {courseId,lectureId},{headers:{Authorization:`Bearer ${token}`}})

        if(data.success){
          toast.success(data.message);
          getCoureProgress()
        }
        else{
          toast.error(data.message);
        }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const getCoureProgress = async()=>{
    try {
      const token = await getToken()
      const {data} = await axios.post(backendUrl + 'api/user/update-course-progress',
        {courseId},{headers :{Authorization:`Bearer ${token}`}})

        if(data.success){
          setProgressData(data.progressData)
        }else{
          toast.error(data.message)
        }

    } catch (error) {
      toast.error(error.message)
    }
  }


  const handleRate = async(rating)=>{
    try {
      const token = await getToken()
      const {data} = await axios.post(backendUrl+'/api/user/add-rating',
        {courseId,rating},{headers:{Authorization:`Bearer ${token}`}})

        if(data.success){
          toast.success(data.message)
          fetchUserEnrolledCourses();
        }
        else{
          toast.error(data.message)
        }

    } catch (error) {
      toast.error(error.message)
    }
  }

useEffect(()=>{
  getCoureProgress()
},[])

  return course ?(
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-10 md:px-36">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Column - Course Structure */}
          <div className="text-gray-800 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-xl font-semibold">Course Structure</h2>

            <div className="pt-5">
              {Array.isArray(course?.courseContent) && course.courseContent.length > 0 ? (
                course.courseContent.map((chapter, chapterIndex) => {
                  const isOpen = expandedChapters.includes(chapterIndex);

                  return (
                    <div key={chapterIndex} className="border border-gray-300 bg-white mb-2 rounded">
                      {/* Chapter Header */}
                      <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                        onClick={() => toggleChapter(chapterIndex)}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={assets.down_arrow_icon}
                            alt="arrow icon"
                            className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          />
                          <p className="font-medium md:text-base text-sm">
                            {chapter.chapterTitle}
                          </p>
                        </div>
                        <p className="text-sm md:text-base">
                          {chapter.chapterContent?.length || 0} lectures - {calculateChapterTime(chapter)}
                        </p>
                      </div>

                      {/* Lectures */}
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                        {Array.isArray(chapter.chapterContent) && (
                          <ul className="pl-4 pr-2 py-2 md:pl-10 text-gray-600 list-disc border-t border-gray-300">
                            {chapter.chapterContent.map((lecture, lectureIndex) => (
                              <li key={lectureIndex} className="flex items-start gap-2 py-1">
                                <img
                                  src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? 
                                    assets.blue_tick_icon : assets.play_icon}
                                  alt="play icon"
                                  className="w-4 h-4 mt-1"
                                />
                                <div className="flex justify-between w-full text-gray-800 text-xs md:text-sm">
                                  <p>{lecture.lectureTitle}</p>
                                  <div className="flex gap-2">
                                    {lecture.lectureUrl && (
                                      <span
                                        onClick={() =>
                                          setPlayerData({
                                            ...lecture,
                                            chapter: chapterIndex + 1,
                                            lecture: lectureIndex + 1
                                          })
                                        }
                                        className="text-blue-500 cursor-pointer"
                                      >
                                        Watch
                                      </span>
                                    )}
                                    <span>
                                      {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                        units: ['h', 'm'],
                                        round: true,
                                      })}
                                    </span>
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

          {/* Right Column - Player or Thumbnail */}
          <div>
            {playerData ? (
              <div>
                <YouTube
                  videoId={playerData.lectureUrl?.split('/').pop()}
                  opts={{ playerVars: { autoplay: 1 } }}
                  iframeClassName="w-full aspect-video"
                />
                <div className="mt-4">
                  <p className="font-semibold text-gray-800 mb-2 text-xl">
                    {playerData.chapter}.{playerData.lecture}{playerData.lectureTitle}
                  </p>
                  <button onClick={()=>{markLectureAsCompleted(playerData.lectureId)}} 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? 'Completed': 'Mark as Completed'}
                  </button>
                </div>
              </div>
            ) : (
              course?.courseThumbnail && (
                <img
                  src={course.courseThumbnail}
                  alt="Course Thumbnail"
                  className="w-full rounded shadow-lg"
                />
              )
            )}
          </div>
        </div>

        {/* Rating Section */}
        <div className="mt-10">
          <h1 className="text-xl font-bold text-gray-800">Rate this Course:</h1>
          <Rating initialRating={initialRating} onRate={handleRate}/>
          {/* You can add star rating component or buttons here */}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  ):<Loading/>
}

export default Player;
