import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyCourses = () => {
  const { currency, allCourses, backendUrl, isEducator, getToken } =
    useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      data.success && setCourses(data.courses);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  // Show loading state
  if (courses === null) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>

      <div className="rounded-md bg-white border border-gray-500/20">
        {courses.length === 0 ? (
          // Empty state when no courses exist
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Courses Created
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't created any courses yet. Start creating your first
                course to share your knowledge!
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Create Your First Course
              </button>
            </div>
          </div>
        ) : (
          // Table with courses data
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
              {courses.map((course) => (
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
                    {currency}{" "}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
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
        )}
      </div>
    </div>
  );
};

export default MyCourses;
