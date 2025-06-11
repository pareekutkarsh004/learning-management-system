import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import { useParams } from 'react-router-dom';
import assets from '../../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';

function Player() {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [playerData, setPlayerData] = useState(null);

  useEffect(() => {
    const selectedCourse = enrolledCourses.find(course => course._id === courseId);
    if (selectedCourse) {
      setCourse(selectedCourse);
    }
  }, [courseId, enrolledCourses]);

  const toggleChapter = (index) => {
    setExpandedChapters((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
      {/* Left Column */}
      <div className="text-gray-800 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
        <h2 className="text-xl font-semibold">Course Structure</h2>

        <div className="pt-5">
          {Array.isArray(course?.courseContent) && course.courseContent.length > 0 ? (
            course.courseContent.map((chapter, index) => {
              const isOpen = expandedChapters.includes(index);

              return (
                <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                  {/* Chapter Header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleChapter(index)}
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

                  {/* Chapter Lectures */}
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                    {Array.isArray(chapter.chapterContent) && (
                      <ul className="pl-4 pr-2 py-2 md:pl-10 text-gray-600 list-disc border-t border-gray-300">
                        {chapter.chapterContent.map((lecture, idx) => (
                          <li key={idx} className="flex items-start gap-2 py-1">
                            <img
                              src={false ?assets.blue_tick_icon:assets.play_icon}
                              alt="play icon"
                              className="w-4 h-4 mt-1"
                            />
                            <div className="flex justify-between w-full text-gray-800 text-xs md:text-sm">
                              <p>{lecture.lectureTitle}</p>
                              <div className="flex gap-2">
                                {lecture.lectureUrl && (
                                  <span
                                    onClick={() => setPlayerData({
                                     ...lecture,chapter:index+1,lecture:index+1
                                    })}
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

      {/* Right Column */}
      <div>{/* Right column content goes here */}
      { playerData && (
        <div>
          <YouTube/>
        </div>
      )}
      <img src={}/>
      </div>
    </div>
  );
}

export default Player;
