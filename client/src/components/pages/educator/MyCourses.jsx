import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyCourses = () => {
  const { currency, allCourses, backendURL, isEducator, getToken } =
    useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateCourse = () => {
    navigate("/educator/add-course");
  };

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const fetchEducatorCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const { data } = await axios.get(backendURL + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCourses(data.courses || []);
      } else {
        setError("Failed to fetch courses");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch courses";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <button
            onClick={handleCreateCourse}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Course
          </button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 ml-3">Loading courses...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <button
            onClick={handleCreateCourse}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Course
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-red-500 text-center">
            <svg
              className="mx-auto h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Courses
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchEducatorCourses}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        {courses && courses.length > 0 && (
          <button
            onClick={handleCreateCourse}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Course
          </button>
        )}
      </div>

      <div className="rounded-md bg-white border border-gray-500/20">
        {!courses || courses.length === 0 ? (
          // Improved empty state when no courses exist
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="text-center max-w-md">
              {/* Gradient background circle */}
              <div className="relative mx-auto mb-8 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full animate-pulse"></div>
                <svg
                  className="relative w-16 h-16 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Ready to Share Your Knowledge?
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                You haven't created any courses yet. Start your teaching journey
                by creating your first course and inspire learners worldwide!
              </p>

              <button
                onClick={handleCreateCourse}
                className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 mb-8"
              >
                <span className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 transition-transform group-hover:rotate-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create Your First Course
                </span>
              </button>

              {/* Tips section */}
              <div className="bg-gray-50 rounded-lg p-6 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">💡</span>
                  <h4 className="font-semibold text-gray-900">
                    Quick Tips to Get Started
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Choose a topic you're passionate and knowledgeable about
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Plan your course structure with clear learning objectives
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Create engaging content with videos, quizzes, and
                    assignments
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Set competitive pricing based on your course value
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // Table with courses data
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-bold">Course</th>
                  <th className="px-4 py-3 font-bold">Earnings</th>
                  <th className="px-4 py-3 font-bold">Students</th>
                  <th className="px-4 py-3 font-bold">Published</th>
                  <th className="px-4 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {courses.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b border-gray-500/20 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={course.courseThumbnail}
                          alt="Course Image"
                          className="w-16 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/64x48?text=Course";
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {course.courseTitle}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {course.courseDescription?.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-green-600">
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
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewCourse(course._id)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="View Course"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
