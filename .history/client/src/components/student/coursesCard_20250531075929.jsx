import React from 'react'

function coursesCard({course}) {
  return (
    <div>
    <img src={course.courseThumbnail} alt=''/>
    <div>
        <h3>
            {course.courseName}
        </h3>
        <p>
            
        </p>
    </div>
    </div>
  )
}

export default coursesCard