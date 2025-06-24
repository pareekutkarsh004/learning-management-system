import React, { useContext, useEffect } from "react";
import { AppContext } from "../../../context/AppContext";
import { data, useNavigate } from "react-router-dom";
import { Line } from "rc-progress";
import Footer from "../../student/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const MyEnrollments = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    userData,
    fetchUserEnrolledCourses,
    backendUrl,
    getToken,
    calculateNoOfLectures,
  } = useContext(AppContext);
  const navigate = useNavigate();

  const [progressArray, setProgressArray] = React.useState([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            {
              courseId: course._id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progress
            ? data.progress.lectureCompleted.length
            : 0;

          return { totalLectures, lectureCompleted };
        })
      );

      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
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

        {enrolledCourses.length === 0 ? (
          // Empty state layout
          <div className="flex flex-col items-center justify-center py-20 mt-10">
            <div className="text-center">
              <div className="mb-6">
                {/* You can replace this with an icon or illustration */}
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
                onClick={() => navigate("/courses")} // Adjust route as needed
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          </div>
        ) : (
          // Existing table layout for when there are enrolled courses
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
                      key={index}
                      className="border-b border-gray-500/20 text-sm"
                    >
                      <td className="px-4 py-3 font-medium truncate flex items-center gap-2">
                        <img
                          src={course.courseThumbnail}
                          alt={course.courseTitle}
                          className="w-14 h-14 sm:w-24 md:w-28"
                        />
                        <div className="flex-1">
                          <p className="mb-1 max-sm:text-sm">
                            {course.courseTitle}
                          </p>
                          <Line
                            strokeWidth={2}
                            percent={percent}
                            className="bg-gray-300 rounded-full"
                            strokeColor={isCompleted ? "#16a34a" : "#eab308"} // green or yellow
                          />
                        </div>
                      </td>

                      <td className="px-4 py-3 max-sm:hidden">
                        {calculateCourseDuration(course)}
                      </td>

                      <td className="px-4 py-3 max-sm:hidden">
                        {progress &&
                          `${progress.lectureCompleted} / ${progress.totalLectures}`}{" "}
                        <span>Lectures</span>
                      </td>

                      <td className="px-4 py-3 max-sm:text-right">
                        <button
                          className={`px-3 sm:px-5 py-1.5 sm:py-2 text-white max-sm:text-xs ${
                            isCompleted ? "bg-green-600" : "bg-yellow-500"
                          }`}
                          onClick={() => navigate(`/player/${course._id}`)}
                        >
                          {isCompleted ? "Completed" : "On Going"}
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
