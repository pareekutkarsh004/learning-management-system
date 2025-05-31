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
            {course.educators.name}
        </p>
        <div>
            <p>
                4.5
            </p>
            <div>
                {[...Array(5)].map((_, i) => (
                    <img key={}/>
                )}
            </div>
        </div>
    </div>
    </div>
  )
}

export default coursesCard