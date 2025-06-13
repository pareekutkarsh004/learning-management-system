import React, { useState, useRef, useEffect } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
    }
  }

  const handleAddChapter = () => {
    const newChapter = {
      id: uniqid(),
      title: `Chapter ${chapters.length + 1}`,
      lectures: []
    }
    setChapters([...chapters, newChapter])
  }

  const handleAddLecture = (chapterId) => {
    setCurrentChapterId(chapterId)
    setShowPopup(true)
  }

  const handleSaveLecture = () => {
    if (!currentChapterId) return

    const updatedChapters = chapters.map(chapter => {
      if (chapter.id === currentChapterId) {
        return {
          ...chapter,
          lectures: [...chapter.lectures, {
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
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <h1 className='text-2xl font-bold mb-6'>Add New Course</h1>

      <form className='w-full max-w-4xl space-y-6'>
        <div className='flex flex-col gap-1'>
          <label className='font-medium'>Course Title</label>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder='Type here'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 focus:border-blue-500'
            required
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='font-medium'>Course Description</label>
          <div ref={editorRef} className='h-64 mb-4'></div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-1'>
            <label className='font-medium'>Course Price ($)</label>
            <input
              type="number"
              value={coursePrice}
              onChange={(e) => setCoursePrice(Number(e.target.value))}
              className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 focus:border-blue-500'
              min="0"
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='font-medium'>Discount (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 focus:border-blue-500'
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='font-medium'>Course Thumbnail</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className='outline-none py-2 px-3 rounded border border-gray-300 focus:border-blue-500'
          />
        </div>

        <div className='border-t pt-6'>
          <h2 className='text-xl font-bold mb-4'>Course Chapters</h2>
          <button
            type="button"
            onClick={handleAddChapter}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4'
          >
            Add Chapter
          </button>

          {chapters.map((chapter) => (
            <div key={chapter.id} className='mb-6 border rounded-lg p-4'>
              <h3 className='font-bold mb-2'>{chapter.title}</h3>
              <button
                type="button"
                onClick={() => handleAddLecture(chapter.id)}
                className='bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 mb-2'
              >
                Add Lecture
              </button>

              {chapter.lectures.length > 0 && (
                <div className='mt-2 space-y-2'>
                  {chapter.lectures.map((lecture) => (
                    <div key={lecture.id} className='p-2 bg-gray-50 rounded'>
                      <p className='font-medium'>{lecture.lectureTitle}</p>
                      <p className='text-sm text-gray-600'>{lecture.lectureDuration}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium'
        >
          Save Course
        </button>
      </form>

      {showPopup && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg w-full max-w-md'>
            <h3 className='font-bold text-lg mb-4'>Add Lecture</h3>

            <div className='space-y-4'>
              <div className='flex flex-col gap-1'>
                <label>Lecture Title</label>
                <input
                  type="text"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                  className='outline-none py-2 px-3 rounded border border-gray-300'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label>Lecture Duration (minutes)</label>
                <input
                  type="number"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                  className='outline-none py-2 px-3 rounded border border-gray-300'
                  min="1"
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label>Video URL</label>
                <input
                  type="text"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                  className='outline-none py-2 px-3 rounded border border-gray-300'
                />
              </div>

              <div className='flex items-center gap-2'>
                <input
                  type="checkbox"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                  className='h-4 w-4'
                />
                <label>Available as free preview</label>
              </div>

              <div className='flex justify-end gap-2 pt-4'>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className='px-4 py-2 border rounded hover:bg-gray-100'
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLecture}
                  className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                >
                  Save Lecture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddCourse