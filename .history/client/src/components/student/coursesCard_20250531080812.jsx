import React from 'react'
import assets from '../../assets/assets'

function coursesCard({course}) {
    const {currency}
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
                    <img key={i} src={assets.star} alt=''  />
                ))}
            </div>
            <p>22</p>
        </div>
        <p>
            {(course.CoursePrice-course.discount*course.CoursePrice/100).toFixed(2)} 
        </p>
    </div>
    </div>
  )
}

export default coursesCard