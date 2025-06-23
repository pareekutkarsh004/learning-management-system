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
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  // Fetch all courses (publicly)
  const fetchAllCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/course/all`);
      const data = response.data;

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message || "Failed to load courses");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Fetch user profile
  const fetchUserData = async () => {
    if (user?.publicMetadata?.role === "educator") {
      setIsEducator(true);
    }

    try {
      const token = await getToken();

      console.log("🔐 Clerk JWT Token:", token); // ✅ Add this line

      const response = await axios.get(`${backendURL}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  

  // Fetch courses the user is enrolled in
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${backendURL}/api/user/enrolled-courses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // On mount, fetch all courses
  useEffect(() => {
    fetchAllCourses();
  }, []);

  // When user logs in or out
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    } else {
      setUserData(null);
      setIsEducator(false);
      setEnrolledCourses([]);
    }
  }, [user]);

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
    backendURL,
    userData,
    setUserData,
    getToken,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
