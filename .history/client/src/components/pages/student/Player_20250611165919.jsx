import React, { useContext } from 'react'
import { AppContext } from '../../../context/AppContext';

function Player() {
  const {enrolledCourses ,calculateChapterTime}=useContext(AppContext)
  return (
   
<>
  <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 ms:px-36'>
    {/* left coloum */}

      <div className='text-gray-800'>
        <h2 className='text-xl font-semibold'>Course Structure</h2>
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
                                    <p onClick={() => setPlayerData({ videoId: lecture.lectureUrl.split('/').pop() })} className="text-blue-500 cursor-pointer">preview</p>
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


    {/* right coloum */}
    <div></div>
  </div>
</>
  )
}

export default Player