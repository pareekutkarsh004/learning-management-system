import React, { useContext, useEffect } from "react";
import { AppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Line } from "rc-progress";
import Footer from "../../student/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

const MyEnrollments = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    userData,
    fetchUserEnrolledCourses,
    calculateNoOfLectures,
  } = useContext(AppContext);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [progressArray, setProgressArray] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          try {
            const { data } = await axios.post(
              `${backendURL}/api/user/get-course-progress`,
              {
                courseId: course._id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            let totalLectures = calculateNoOfLectures(course);
            const lectureCompleted = data.progress
              ? data.progress.lectureCompleted.length
              : 0;

            return { totalLectures, lectureCompleted };
          } catch (error) {
            console.error(
              `Error fetching progress for course ${course._id}:`,
              error
            );
            // Return default progress if individual course fails
            return {
              totalLectures: calculateNoOfLectures(course),
              lectureCompleted: 0,
            };
          }
        })
      );

      setProgressArray(tempProgressArray);
    } catch (error) {
      console.error("Error fetching course progress:", error);
      toast.error(
        error.response?.data?.message || "Failed to load course progress"
      );
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses]);

  return (
    <>
      <div className="md:px-36 px-8 pt-10 pb-9">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>

        {isLoading ? (
          // Loading state
          <div className="flex items-center justify-center py-20 mt-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your enrollments...</p>
            </div>
          </div>
        ) : enrolledCourses.length === 0 ? (
          // Empty state layout
          <div className="flex flex-col items-center justify-center py-20 mt-10">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Enrollments Yet
              </h3>

              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't enrolled in any courses yet. Start your learning
                journey by exploring our course catalog.
              </p>

              <button
                onClick={() => navigate("/course-list")}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          </div>
        ) : (
          // Courses table
          <div className="overflow-auto max-h-[80vh] custom-scrollbar mt-10 border rounded-lg">
            <table className="md:table-auto table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
                <tr>
                  <th className="px-4 py-3 font-semibold truncate">Course</th>
                  <th className="px-4 py-3 font-semibold truncate">Duration</th>
                  <th className="px-4 py-3 font-semibold truncate">
                    Completed
                  </th>
                  <th className="px-4 py-3 font-semibold truncate">Status</th>
                </tr>
              </thead>

              <tbody>
                {enrolledCourses.map((course, index) => {
                  const progress = progressArray[index];
                  const percent = progress
                    ? (progress.lectureCompleted * 100) / progress.totalLectures
                    : 0;

                  const isCompleted =
                    progress &&
                    progress.lectureCompleted === progress.totalLectures;

                  return (
                    <tr
                      key={course._id || index}
                      className="border-b border-gray-500/20 text-sm"
                    >
                      <td className="px-4 py-3 font-medium truncate flex items-center gap-2">
                        <img
                          src={course.courseThumbnail}
                          alt={course.courseTitle}
                          className="w-14 h-14 sm:w-24 md:w-28 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "/placeholder-course.png"; // Fallback image
                          }}
                        />
                        <div className="flex-1">
                          <p className="mb-1 max-sm:text-sm font-medium">
                            {course.courseTitle}
                          </p>
                          <Line
                            strokeWidth={2}
                            percent={percent}
                            className="bg-gray-300 rounded-full"
                            strokeColor={isCompleted ? "#16a34a" : "#eab308"}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-3 max-sm:hidden">
                        {calculateCourseDuration(course)}
                      </td>

                      <td className="px-4 py-3 max-sm:hidden">
                        {progress ? (
                          <>
                            {progress.lectureCompleted} /{" "}
                            {progress.totalLectures}
                            <span className="text-gray-500 ml-1">Lectures</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Loading...</span>
                        )}
                      </td>

                      <td className="px-4 py-3 max-sm:text-right">
                        <button
                          className={`px-3 sm:px-5 py-1.5 sm:py-2 text-white max-sm:text-xs rounded transition-colors ${
                            isCompleted
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-yellow-500 hover:bg-yellow-600"
                          }`}
                          onClick={() => navigate(`/player/${course._id}`)}
                        >
                          {isCompleted ? "Completed" : "Continue"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;
