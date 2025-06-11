import React, { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Line } from "rc-progress";

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

        {/* Scrollable table wrapper */}
        <div className="overflow-auto max-h-[80vh] custom-scrollbar mt-10 border rounded-lg">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Course</th>
                <th className="px-4 py-3 font-semibold truncate">Duration</th>
                <th className="px-4 py-3 font-semibold truncate">Completed</th>
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
                      <div>
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
                        className={`px-3 sm:px-5 py-1.5 sm:py-2 text-white max-sm:text-xs ${isCompleted ? "bg-green-600" : "bg-yellow-500"
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
      </div>
    </>
  );
};

export default MyEnrollments;
