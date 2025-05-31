import React from 'react'
import { Link } from 'react-router-dom'

function CourseSection() {
  return (
    <div>
    <h2>
        Learn from the best educators
    </h2>
    <p>
              Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.
    </p>


    <Link to={'/course-list'} onClick={()=>}>Show all courses</Link>
    </div>
  )
}

export default CourseSection