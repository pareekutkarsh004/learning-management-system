import React, { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration } = useContext(AppContext);
  const navigate = useNavigate();

  const [progressArray, setProgressArray] = React.useState([
    { lectureCompleted: 3, totalLectures: 10 },
    { lectureCompleted: 5, totalLectures: 12 },
    { lectureCompleted: 7, totalLectures: 15 },
    { lectureCompleted: 10, totalLectures: 10 },
    { lectureCompleted: 1, totalLectures: 8 },
    { lectureCompleted: 6, totalLectures: 10 },
    { lectureCompleted: 0, totalLectures: 5 },
    { lectureCompleted: 2, totalLectures: 6 },
  ]);

  return (
    <>
      <div className="md:px-36 px-8 pt-10 pb-9">
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
            {enrolledCourses.map((course, index) => (
              <tr key={index} className="border-b border-gray-500/20 text-sm">
                <td className="px-4 py-3 font-medium truncate flex items-center gap-2">
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseTitle}
                    className="w-14 h-14 sm:w-24 md:w-28"
                  />
                  <div>
                    <p>{course.courseTitle}</p>
                  </div>
                </td>

                <td className="px-4 py-3">{calculateCourseDuration(course)}</td>

                <td className="px-4 py-3">
                  {progressArray[index] &&
                    `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`}{" "}
                  <span>Lectures</span>
                </td>

                <td className="px-4 py-3 max-sm:text-right">
                  <button
                    className="px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white"
                    onClick={() => navigate(`/player/${course._id}`)}
                  >
                    {progressArray[index] &&
                      progressArray[index].lectureCompleted ===
                      progressArray[index].totalLectures
                      ? "Completed"
                      : "On Going"}
                  </button>
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
