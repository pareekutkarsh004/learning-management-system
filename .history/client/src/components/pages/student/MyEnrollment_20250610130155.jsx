import React, { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';

const MyEnrollments = () => {
  const {enrolledCourses}=useContext(AppContext);
  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>

        <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th>
              <th className="px-4 py-3 font-semibold truncate">Duration</th>
              <th className="px-4 py-3 font-semibold truncate">Completed</th>
              <th className="px-4 py-3 font-semibold truncate">Status</th>
            </tr>
          </thead>
          <tbody>
            {enrolledCourses.map((course,index)=>(
              <tr key={index} className="border-b border-gray-500/20 text-sm">
                <td className="px-4 py-3 font-medium truncate">{course.courseThumbnail}</td>
                <td className="px-4 py-3">{course.courseDuration} hours</td>
                <td className="px-4 py-3">{course.completed ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">
                  {course.completed ? (
                    <span className="text-green-600">Completed</span>
                  ) : (
                    <span className="text-red-600">In Progress</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyEnrollments;
