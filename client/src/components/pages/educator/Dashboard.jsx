import React, { useContext, useEffect, useState } from "react";
import assets, { dummyDashboardData } from "../../../assets/assets";
import Loading from "../../student/Loading";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { currency, isEducator, getToken, userData } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get backend URL from environment or use localhost
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Add comprehensive debugging
  useEffect(() => {
    console.log("=== DASHBOARD DEBUG INFO ===");
    console.log("isEducator:", isEducator);
    console.log("typeof isEducator:", typeof isEducator);
    console.log("backendURL:", backendURL);
    console.log("userData:", userData);
    console.log("AppContext values:", {
      currency,
      backendURL,
      isEducator,
      userData,
    });
    console.log("===========================");
  }, [isEducator, backendURL, userData]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // More detailed debugging
      console.log("Starting fetchDashboardData...");
      console.log("Current isEducator value:", isEducator);
      console.log("Current userData:", userData);

      // Check if user data exists and has educator role
      if (!userData) {
        setError("User data not loaded. Please log in again.");
        setIsLoading(false);
        return;
      }

      // Check if user has educator role (adjust this based on your user data structure)
      const userIsEducator =
        userData.role === "educator" ||
        userData.isEducator === true ||
        isEducator === true;
      console.log("User is educator check:", userIsEducator);
      console.log("User role:", userData.role);

      if (!userIsEducator) {
        setError(
          `Access denied. Your account type is: ${
            userData.role || "Unknown"
          }. Educator access required.`
        );
        setIsLoading(false);
        return;
      }

      if (!backendURL) {
        setError("Backend URL is not configured");
        setIsLoading(false);
        return;
      }

      const token = await getToken();
      console.log("Token obtained:", !!token);
      console.log(
        "Token preview:",
        token ? token.substring(0, 20) + "..." : "No token"
      );

      if (!token) {
        setError("Authentication token not available. Please log in again.");
        setIsLoading(false);
        return;
      }

      console.log(
        "Making API request to:",
        `${backendURL}/api/educator/dashboard`
      );

      const response = await axios.get(`${backendURL}/api/educator/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      console.log("API Response status:", response.status);
      console.log("API Response data:", response.data);

      if (response.data.success) {
        setDashboardData(response.data.dashboardData);
        console.log("Dashboard data successfully set");
      } else {
        const errorMessage =
          response.data.message || "Failed to fetch dashboard data";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Dashboard fetch error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

      let errorMessage = "Failed to load dashboard";

      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message;

        switch (status) {
          case 401:
            errorMessage = "Authentication failed. Please log in again.";
            break;
          case 403:
            errorMessage = `Access forbidden. Server says: ${
              serverMessage || "You are not authorized as an educator"
            }`;
            break;
          case 404:
            errorMessage =
              "Dashboard endpoint not found. Please check server configuration.";
            break;
          case 500:
            errorMessage = `Server error: ${
              serverMessage || "Internal server error"
            }`;
            break;
          default:
            errorMessage = serverMessage || `Server returned status ${status}`;
        }
      } else if (error.request) {
        errorMessage =
          "Cannot connect to server. Please check your network connection.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Server is taking too long to respond.";
      } else {
        errorMessage = error.message || "An unexpected error occurred";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Dashboard useEffect triggered with dependencies:", {
      isEducator,
      backendURL,
      userData: !!userData,
    });

    // Wait for all required context values to be loaded
    if (backendURL && userData !== undefined) {
      fetchDashboardData();
    } else {
      console.log("Waiting for context to load...", {
        hasBackendURL: !!backendURL,
        hasUserData: userData !== undefined,
      });
      setIsLoading(false); // Stop loading if we're waiting for context
    }
  }, [isEducator, backendURL, userData]);

  // Enhanced error display with debugging info
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-lg mx-auto p-6 border rounded-lg bg-red-50">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Dashboard Access Error
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>

          <div className="bg-gray-100 p-4 rounded mb-4 text-left">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>Backend URL:</strong> {backendURL || "Not set"}
              </p>
              <p>
                <strong>Is Educator (Context):</strong> {String(isEducator)}
              </p>
              <p>
                <strong>User Data:</strong> {userData ? "Loaded" : "Not loaded"}
              </p>
              {userData && (
                <>
                  <p>
                    <strong>User Role:</strong>{" "}
                    {userData.role || "Not specified"}
                  </p>
                  <p>
                    <strong>User ID:</strong>{" "}
                    {userData._id || userData.id || "Not found"}
                  </p>
                  <p>
                    <strong>User Email:</strong> {userData.email || "Not found"}
                  </p>
                </>
              )}
              <p>
                <strong>Current URL:</strong> {window.location.href}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={fetchDashboardData}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mr-3"
            >
              Retry
            </button>
            <button
              onClick={() => {
                // Clear any stored authentication and redirect to login
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/login";
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while waiting for context
  if (isLoading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-gray-600">
            {!userData ? "Loading user data..." : "Loading dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  // If we have user data but no dashboard data, show loading
  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-8 md:p-8 p-4 pt-8 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Educator Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome,{" "}
          {userData.firstName || userData.name || userData.email || "Educator"}
        </div>
      </div>

      <div className="space-y-5">
        {/* Always show stats cards */}
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

        {/* Show different content based on whether educator has courses */}
        {(dashboardData.totalCourses || 0) === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg p-8">
            <div className="text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
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
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Welcome to Your Educator Dashboard!
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                You haven't created any courses yet. Start your teaching journey
                by creating your first course.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() =>
                    (window.location.href = "/educator/add-course")
                  }
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Create Your First Course
                </button>
                <p className="text-sm text-gray-500">
                  Get started by sharing your knowledge with students worldwide
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Show enrollments table when educator has courses */
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Latest Enrollments</h2>
              <span className="text-sm text-gray-500">
                {dashboardData.enrolledStudentsData?.length || 0} total
                enrollments
              </span>
            </div>

            <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
              <table className="table-fixed md:table-auto w-full overflow-hidden">
                <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                      #
                    </th>
                    <th className="px-4 py-3 font-semibold">Student Name</th>
                    <th className="px-4 py-3 font-semibold">Course Title</th>
                    <th className="px-4 py-3 font-semibold hidden md:table-cell">
                      Enrolled Date
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-500">
                  {dashboardData.enrolledStudentsData?.length > 0 ? (
                    dashboardData.enrolledStudentsData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-500/20 hover:bg-gray-50"
                      >
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
                            {item.student?.firstName ||
                              item.student?.name ||
                              "Unknown Student"}
                          </span>
                        </td>
                        <td className="px-4 py-3 truncate">
                          {item.courseTitle || "Unknown Course"}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {item.enrolledDate
                            ? new Date(item.enrolledDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <svg
                            className="h-12 w-12 text-gray-300 mb-4"
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
                          <p className="text-lg font-medium mb-2">
                            No enrollments yet
                          </p>
                          <p className="text-sm">
                            Your courses are ready! Students will appear here
                            when they enroll.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
