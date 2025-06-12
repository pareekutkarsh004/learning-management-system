import React, { useState, useRef, useEffect } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import uniqid from 'uniqid'
import assets from '../../../assets/assets'

const AddCourse = () => {
  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)
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

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:')
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        }
        setChapters([...chapters, newChapter])
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId))
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      )
    }
  }

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId)
      setShowPopup(true)
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1)
          }
          return chapter
        })
      )
    }
  }

  const handleSaveLecture = () => {
    if (!currentChapterId) return

    const updatedChapters = chapters.map(chapter => {
      if (chapter.chapterId === currentChapterId) {
        return {
          ...chapter,
          chapterContent: [...chapter.chapterContent, {
            ...lectureDetails,
            id: uniqid()
          }]
        }
      }
      return chapter
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

  return (
    <div className='min-h-screen overflow-y-scroll px-4 py-8 md:px-12 bg-gray-50'>
      <h1 className='text-3xl font-bold mb-6 text-gray-800'>Add New Course</h1>

      <form className='flex flex-col space-y-6 w-full max-w-3xl text-gray-600'>

        {/* Course Title */}
        <div className='flex flex-col gap-1'>
          <label className='font-medium'>Course Title</label>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder='Enter title'
            className='outline-none py-2 px-3 rounded border border-gray-400'
            required
          />
        </div>

        {/* Course Description */}
        <div className='flex flex-col gap-1'>
          <label className='font-medium'>Course Description</label>
          <div ref={editorRef} className='h-64 border border-gray-300 rounded'></div>
        </div>

        {/* Pricing, Discount, and Thumbnail */}
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6'>

          {/* Price */}
          <div className='flex flex-col gap-1'>
            <label className='font-medium'>Course Price ($)</label>
            <input
              type="number"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              className='outline-none py-2 px-3 w-40 rounded border border-gray-400'
              required
            />
          </div>

          {/* Discount */}
          <div className='flex flex-col gap-1'>
            <label className='font-medium'>Discount (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              min="0"
              max="100"
              className='outline-none py-2 px-3 w-40 rounded border border-gray-400'
            />
          </div>

          {/* Thumbnail Upload */}
          <div className='flex flex-col gap-2'>
            <label className='font-medium'>Course Thumbnail</label>
            <label htmlFor='thumbnailImage' className='flex items-center gap-3 cursor-pointer'>
              <img src={assets.file_upload_icon} alt="upload" className='p-2 bg-blue-500 rounded' />
              <input
                type="file"
                id='thumbnailImage'
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
              {image && (
                <img
                  className='h-10 rounded'
                  src={URL.createObjectURL(image)}
                  alt="thumbnail preview"
                />
              )}
            </label>
          </div>

        </div>

        {/* Chapters Section */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>Course Chapters</h2>

          {chapters.map((chapter, chapterIndex) => (
            <div key={chapter.chapterId} className="bg-white border rounded-lg mb-4">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center">
                  <img
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                    src={assets.dropdown_icon}
                    width={14}
                    alt="toggle"
                    className={`mr-2 cursor-pointer transition-all ${chapter.collapsed ? "-rotate-90" : ""}`}
                  />
                  <span className="font-semibold">{chapterIndex + 1}. {chapter.chapterTitle}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>
                  <img
                    onClick={() => handleChapter('remove', chapter.chapterId)}
                    src={assets.cross_icon}
                    alt="delete"
                    className='cursor-pointer'
                  />
                </div>
              </div>

              {!chapter.collapsed && (
                <div className="p-4 space-y-2">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className="flex justify-between items-center">
                      <span>
                        {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins -
                        <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-1">link</a> -
                        {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                      </span>
                      <img
                        src={assets.cross_icon}
                        alt="remove"
                        onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
                        className='cursor-pointer'
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    className="bg-gray-100 px-4 py-2 rounded mt-2"
                    onClick={() => handleLecture('add', chapter.chapterId)}
                  >
                    + Add Lecture
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            className="w-full bg-blue-100 text-blue-600 font-semibold py-2 rounded mt-2"
            onClick={() => handleChapter('add')}
          >
            + Add Chapter
          </button>
        </div>

        <button
          type="submit"
          className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium mt-4'
        >
          Save Course
        </button>
      </form>

      {/* Lecture Popup remains unchanged */}
      {showPopup && (
        /* ... keep your existing popup code here ... */
        <></>
      )}
    </div>
  )
  
}

export default AddCourse