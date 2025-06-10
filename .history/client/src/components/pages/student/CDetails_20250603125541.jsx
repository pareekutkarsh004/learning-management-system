import React from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../../context/AppContext'
function CDetails() {
  const {id}=useParams();
  const [course, setCourse] = React.useState(null);
  const {allCourses} = React.useContext(AppContext);
  return (
    <div></div>
  )
}

export default CDetails