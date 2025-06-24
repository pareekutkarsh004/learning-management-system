import { createContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const { getToken } = useAuth();
  const { user, isLoaded } = useUser(); // Add isLoaded to track when Clerk is ready

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(false); // Track loading state

  // Fetch all courses (publicly)
  const fetchAllCourses = async () => {
    try {
      const response = await axios.get(
        `${backendURL || "http://localhost:5000"}/api/course/all`
      );
      const data = response.data;

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message || "Failed to load courses");
      }
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Fetch user profile
  const fetchUserData = async () => {
    if (!user || userDataLoading) return; // Prevent multiple calls

    setUserDataLoading(true);

    try {
      // Check if user is educator
      if (user?.publicMetadata?.role === "educator") {
        setIsEducator(true);
      }

      console.log("🔄 Fetching user data...");
      const token = await getToken();
      console.log("🔐 Token exists:", !!token);

      if (!token) {
        console.log("❌ No token available");
        setUserDataLoading(false);
        return;
      }

      const response = await axios.get(
        `${backendURL || "http://localhost:5000"}/api/user/data`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("📡 User data API response:", response.data);

      const data = response.data;
      if (data.success) {
        setUserData(data.user);
        console.log("✅ User data set successfully:", data.user);
      } else {
        console.log("❌ API returned error:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      console.error("❌ Error response:", error.response?.data);

      // Don't show toast for 401 errors (user not authenticated)
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setUserDataLoading(false);
    }
  };

  // Fetch courses the user is enrolled in
  const fetchUserEnrolledCourses = async () => {
    if (!user) return;

    try {
      const token = await getToken();
      if (!token) return;

      const response = await axios.get(
        `${backendURL || "http://localhost:5000"}/api/user/enrolled-courses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
        console.log(
          "✅ Enrolled courses fetched:",
          data.enrolledCourses.length
        );
      } else {
        console.log("❌ Failed to fetch enrolled courses:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching enrolled courses:", error);
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  // On mount, fetch all courses
  useEffect(() => {
    fetchAllCourses();
  }, []);

  // When Clerk is loaded and user changes
  useEffect(() => {
    console.log("🔍 AppContext - User effect triggered");
    console.log("🔍 AppContext - isLoaded:", isLoaded);
    console.log("🔍 AppContext - user exists:", !!user);

    if (!isLoaded) {
      console.log("🔄 Clerk not loaded yet, waiting...");
      return; // Wait for Clerk to load
    }

    if (user) {
      console.log("✅ User found, fetching data...");
      fetchUserData();
      fetchUserEnrolledCourses();
    } else {
      console.log("❌ No user, resetting state...");
      setUserData(null);
      setIsEducator(false);
      setEnrolledCourses([]);
    }
  }, [user, isLoaded]); // Add isLoaded as dependency

  // Debug userData changes
  useEffect(() => {
    console.log("🔍 AppContext - userData changed:", userData);
  }, [userData]);

  // Utility: average rating
  const calculateRating = (course) => {
    if (!course?.courseRatings?.length) return 0;
    const total = course.courseRatings.reduce((sum, r) => sum + r.rating, 0);
    return (total / course.courseRatings.length).toFixed(1);
  };

  // Utility: chapter duration
  const calculateChapterTime = (chapter) => {
    const time =
      chapter?.chapterContent?.reduce(
        (acc, lec) => acc + lec.lectureDuration,
        0
      ) || 0;
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Utility: full course duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course?.courseContent?.forEach((ch) =>
      ch?.chapterContent?.forEach((lec) => {
        time += lec.lectureDuration;
      })
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Utility: number of lectures
  const calculateNoOfLectures = (course) => {
    return course?.courseContent?.reduce(
      (sum, chapter) => sum + (chapter?.chapterContent?.length || 0),
      0
    );
  };

  // Refresh user data function (useful for manual refresh)
  const refreshUserData = async () => {
    if (user) {
      await fetchUserData();
      await fetchUserEnrolledCourses();
    }
  };

  const value = {
    currency,
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    isEducator,
    setIsEducator,
    enrolledCourses,
    setEnrolledCourses,
    fetchAllCourses,
    backendUrl: backendURL, // Fixed: using backendURL instead of backendURL
    userData,
    setUserData,
    userDataLoading, // Expose loading state
    getToken,
    refreshUserData, // Expose refresh function
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
