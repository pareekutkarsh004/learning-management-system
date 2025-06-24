import React, { useContext, useEffect, useState } from "react";
import assets, { dummyDashboardData } from "../../../assets/assets";
import Loading from "../../student/Loading";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Debug logs
      console.log("isEducator:", isEducator);
      console.log("backenUrl:", backendUrl);

      if (!isEducator) {
        setError("User is not an educator");
        setIsLoading(false);
        return;
      }

      if (!backendUrl) {
        setError("Backend URL is not defined");
        setIsLoading(false);
        return;
      }

      const token = await getToken();
      console.log("Token obtained:", !!token);

      if (!token) {
        setError("No authentication token available");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${backenUrl}/api/educator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        setDashboardData(response.data.dashboardData);
        console.log("Dashboard data set:", response.data.dashboardData);
      } else {
        setError(response.data.message || "Failed to fetch dashboard data");
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Dashboard useEffect triggered");
    fetchDashboardData();
  }, [isEducator, backenUrl]); // Added backenUrl as dependency

  // Debug render
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !dashboardData) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col gap-8 md:p-8 p-4 pt-8 w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold">Educator Dashboard</h1>

      <div className="space-y-5">
        {dashboardData.totalCourses === 0 ? (
          <div className="text-center mt-10 text-gray-600 text-lg font-medium">
            You haven’t created any courses yet.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-5 items-center">
              <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
                <img src={assets.patients_icon} alt="patients_icon" />
                <div>
                  <p className="text-2xl font-medium text-gray-600">
                    {dashboardData.enrolledStudentsData?.length || 0}
                  </p>
                  <p className="text-base text-gray-500">Total Enrolments</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
                <img src={assets.appointments_icon} alt="appointments_icon" />
                <div>
                  <p className="text-2xl font-medium text-gray-600">
                    {dashboardData.totalCourses || 0}
                  </p>
                  <p className="text-base text-gray-500">Total Courses</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
                <img src={assets.earning_icon} alt="earning_icon" />
                <div>
                  <p className="text-2xl font-medium text-gray-600">
                    {currency}
                    {dashboardData.totalEarnings || 0}
                  </p>
                  <p className="text-base text-gray-500">Total Earnings</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2>
              <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                <table className="table-fixed md:table-auto w-full overflow-hidden">
                  <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                        #
                      </th>
                      <th className="px-4 py-3 font-semibold">Student Name</th>
                      <th className="px-4 py-3 font-semibold">Course Title</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-500">
                    {dashboardData.enrolledStudentsData?.length > 0 ? (
                      dashboardData.enrolledStudentsData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-500/20">
                          <td className="px-4 py-3 text-center hidden sm:table-cell">
                            {index + 1}
                          </td>
                          <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                            <img
                              src={
                                item.student?.imageUrl || "/default-avatar.png"
                              }
                              alt="Profile"
                              className="w-9 h-9 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = "/default-avatar.png";
                              }}
                            />
                            <span className="truncate">
                              {item.student?.name || "Unknown Student"}
                            </span>
                          </td>
                          <td className="px-4 py-3 truncate">
                            {item.courseTitle || "Unknown Course"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No enrollments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
