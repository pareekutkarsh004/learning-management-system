import React from 'react'
import { useNavigate } from 'react-router-dom'

function CourseList() {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <div>
        <div>
          <h1>Course List</h1>
          <p className='text-gray-500'><span className='text-blue-600 cursor-pointer' onClick={()=>navigate('/')}>Home </span>/<span> Course List</span></p>
        </div>
          <Sea />
        </div>
      </div>
    </>
  )
}

export default CourseList