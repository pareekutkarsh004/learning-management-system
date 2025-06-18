import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyCourses = () => {
  const { currency, allCourses, backendUrl, isEducator, getToken } = useContext(AppContext)
  const [courses, setCourses] = useState(null)

  const fetchEducatorCourses = async () => {
   try {
     const token = await getToken();
     const {data}= await axios.get(backendUrl +'/api/educator/courses',
      {headers:{Authorization:`Bearer ${token}`}})

      data.success && setCourses(data.courses)

   } catch (error) {
    toast.error(error.message)
   }
  }

  useEffect(() => {
    if(isEducator){
      fetchEducatorCourses()
    }

  }, [isEducator])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>

      <div className="rounded-md bg-white border border-gray-500/20">
        <table className="md:table-auto table-fixed w-full overflow-hidden">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-bold truncate">All Courses</th>
              <th className="px-4 py-3 font-bold truncate">Earnings</th>
              <th className="px-4 py-3 font-bold truncate">Students</th>
              <th className="px-4 py-3 font-bold truncate">Published On</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {courses?.map((course) => (
              <tr key={course._id} className="border-b border-gray-500/20">
                <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                  <img
                    src={course.courseThumbnail}
                    alt="Course Image"
                    className="w-16 rounded"
                  />
                  <span className="truncate hidden md:block font-medium">
                    {course.courseTitle}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">
                  {currency} {Math.floor(
                    course.enrolledStudents.length *
                    (course.coursePrice - course.discount * course.coursePrice / 100)
                  )}
                </td>
                <td className="px-4 py-3 font-medium">
                  {course.enrolledStudents.length}
                </td>
                <td className="px-4 py-3 font-medium">
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyCourses