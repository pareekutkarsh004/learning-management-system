import React, { useState, useRef, useEffect } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'


const AddCourse = () => {
  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(null)
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  })

  // Initialize Quill editor
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        },
        placeholder: 'Write course description here...',
      })
    }
  }, [])

  const handleAddChapter = () => {
    const newChapter = {
      chapterTitle: `Chapter ${chapters.length + 1}`,
      chapterContent: [],
      collapsed: false
    }
    setChapters([...chapters, newChapter])
  }

  const handleAddLecture = (chapterIndex) => {
    setCurrentChapterIndex(chapterIndex)
    setShowPopup(true)
  }

  const handleSaveLecture = () => {
    if (currentChapterIndex === null) return

    const updatedChapters = [...chapters]
    updatedChapters[currentChapterIndex].chapterContent.push({
      ...lectureDetails,
      id: Date.now()
    })

    setChapters(updatedChapters)
    setShowPopup(false)
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    })
  }

  const toggleChapterCollapse = (chapterIndex) => {
    const updatedChapters = [...chapters]
    updatedChapters[chapterIndex].collapsed = !updatedChapters[chapterIndex].collapsed
    setChapters(updatedChapters)
  }

  const removeLecture = (chapterIndex, lectureIndex) => {
    const updatedChapters = [...chapters]
    updatedChapters[chapterIndex].chapterContent.splice(lectureIndex, 1)
    setChapters(updatedChapters)
  }

  const removeChapter = (chapterIndex) => {
    const updatedChapters = [...chapters]
    updatedChapters.splice(chapterIndex, 1)
    setChapters(updatedChapters)
  }

  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <h1 className='text-2xl font-bold mb-6'>Add New Course</h1>

      <form className='flex flex-col gap-4 max-w-md w-full text-gray-500'>
        <div className='flex flex-col gap-1'>
          <p>Course Title</p>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder='Type here'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
            required
          />
        </div>

        <div className='flex flex-col gap-1'>
          <p>Course Description</p>
          <div ref={editorRef} className='h-64 mb-4'></div>
        </div>

        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex flex-col gap-1'>
            <p>Course Price</p>
            <input
              type="number"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              placeholder='0'
              className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500'
              required
            />
          </div>

          <div className='flex md:flex-row flex-col items-center gap-3'>
            <p>Course Thumbnail</p>
            <label htmlFor='thumbnailImage' className='flex items-center gap-3'>
              <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded' />
              <input
                type="file"
                id='thumbnailImage'
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
              <img
                className='max-h-10'
                src={image ? URL.createObjectURL(image) : ''}
                alt=""
              />
            </label>
          </div>
        </div>

        {/* Chapters & Lectures Section */}
        <div>
          <h2 className='text-lg font-bold my-4'>Course Chapters</h2>

          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="bg-white border rounded-lg mb-4">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center">
                  <img
                    src={assets.dropdown_icon}
                    width={14}
                    alt=""
                    className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && "-rotate-90"}`}
                    onClick={() => toggleChapterCollapse(chapterIndex)}
                  />
                  <span className="font-semibold">{chapterIndex + 1}. {chapter.chapterTitle}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>
                  <img
                    src={assets.cross_icon}
                    alt=""
                    className='cursor-pointer'
                    onClick={() => removeChapter(chapterIndex)}
                  />
                </div>
              </div>

              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className="flex justify-between items-center mb-2">
                      <span>
                        {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins -
                        <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-1">link</a> -
                        {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                      </span>
                      <img
                        src={assets.cross_icon}
                        alt=""
                        className='cursor-pointer'
                        onClick={() => removeLecture(chapterIndex, lectureIndex)}
                      />
                    </div>
                  ))}
                  <div
                    className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
                    onClick={() => handleAddLecture(chapterIndex)}
                  >
                    + Add Lecture
                  </div>
                </div>
              )}
            </div>
          ))}

          <div
            className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
            onClick={handleAddChapter}
          >
            + Add Chapter
          </div>
        </div>

        <button
          type="submit"
          className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium mt-6'
        >
          Save Course
        </button>
      </form>

      {/* Add Lecture Popup */}
      {showPopup && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white text-gray-700 p-4 rounded relative w-full max-w-80'>
            <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

            <div className="mb-2">
              <p>Lecture Title</p>
              <input
                type="text"
                className="mt-1 block w-full border rounded py-1 px-2"
                value={lectureDetails.lectureTitle}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
              />
            </div>

            <div className="mb-2">
              <p>Lecture Duration (mins)</p>
              <input
                type="number"
                className="mt-1 block w-full border rounded py-1 px-2"
                value={lectureDetails.lectureDuration}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
              />
            </div>

            <div className="mb-2">
              <p>Lecture URL</p>
              <input
                type="text"
                className="mt-1 block w-full border rounded py-1 px-2"
                value={lectureDetails.lectureUrl}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
              />
            </div>

            <div className="flex gap-2 my-4">
              <p>Is Preview Free?</p>
              <input
                type="checkbox"
                className='mt-1 scale-125'
                checked={lectureDetails.isPreviewFree}
                onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
              />
            </div>

            <button
              type='button'
              className="w-full bg-blue-400 text-white px-4 py-2 rounded"
              onClick={handleSaveLecture}
            >
              Add
            </button>

            <img
              onClick={() => setShowPopup(false)}
              src={assets.cross_icon}
              className='absolute top-4 right-4 w-4 cursor-pointer'
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AddCourse