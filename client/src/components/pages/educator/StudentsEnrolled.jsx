<<<<<<< HEAD
import React, { useState, useEffect } from 'react'
import { dummyStudentEnrolled } from '../../../assets/assets'

const StudentsEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null)

  const fetchEnrolledStudents = async () => {
    setEnrolledStudents(dummyStudentEnrolled)
  }

  useEffect(() => {
    fetchEnrolledStudents()
  }, [])

  return enrolledStudents ? (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <h1 className="text-2xl font-bold text-gray-900 w-full p-4">Students Enrolled</h1>
=======
import React, { useState, useEffect, useContext } from "react";
import { dummyStudentEnrolled } from "../../../assets/assets";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/enrolled-students",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("API Response:", data); // Debug log

      if (data.success) {
        setEnrolledStudents(
          data.enrolledStudents ? data.enrolledStudents.reverse() : []
        );
      } else {
        toast.error(data.message);
        setEnrolledStudents([]); // Set empty array on error
      }
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
      toast.error(error.message);
      setEnrolledStudents([]); // Set empty array on error
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  // Show loading state
  if (enrolledStudents === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading enrolled students...</p>
      </div>
    );
  }

  // Show empty state when no students are enrolled
  if (enrolledStudents.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <h1 className="text-2xl font-bold text-gray-900 w-full p-4 border-b border-gray-500/20">
            Students Enrolled
          </h1>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Students Enrolled
              </h3>
              <p className="text-gray-500">
                No students have enrolled in your courses yet. Keep promoting
                your courses to attract more students!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show table with enrolled students
  return (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <h1 className="text-2xl font-bold text-gray-900 w-full p-4">
          Students Enrolled
        </h1>
>>>>>>> main

        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
<<<<<<< HEAD
              <th className="px-4 py-3 font-bold text-center hidden sm:table-cell">#</th>
              <th className="px-4 py-3 font-bold">Student Name</th>
              <th className="px-4 py-3 font-bold">Course Title</th>
              <th className="px-4 py-3 font-bold hidden sm:table-cell">Enrollment Date</th>
            </tr>
          </thead>
          <tbody className='text-sm text-gray-500'>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
=======
              <th className="px-4 py-3 font-bold text-center hidden sm:table-cell">
                #
              </th>
              <th className="px-4 py-3 font-bold">Student Name</th>
              <th className="px-4 py-3 font-bold">Course Title</th>
              <th className="px-4 py-3 font-bold hidden sm:table-cell">
                Enrollment Date
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  {index + 1}
                </td>
>>>>>>> main
                <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                  <img
                    src={item.student.imageUrl}
                    alt={item.student.name}
                    className="w-9 h-9 rounded-full"
                  />
                  <span className="truncate">{item.student.name}</span>
                </td>
                <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
<<<<<<< HEAD
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading enrolled students...</p>
    </div>
  )
}

export default StudentsEnrolled
=======
  );
};

export default StudentsEnrolled;
>>>>>>> main
