import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
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

  // Fetch all courses
  const fetchAllCourses = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/course/all`);
      const data = response.data;

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    if (user?.publicMetadata?.role === "educator") {
      setIsEducator(true);
    }

    try {
      const token = await getToken();
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
      toast.error(error.message);
    }
  };

  // Fetch enrolled courses
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
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    } else {
      // Handle logout or unauthenticated state
      setUserData(null);
      setIsEducator(false);
      setEnrolledCourses([]);
    }
  }, [user]);

  // Calculate average rating
  const calculateRating = (course) => {
    if (!course?.courseRatings?.length) return 0;

    const totalRating = course.courseRatings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );

    return (totalRating / course.courseRatings.length).toFixed(1);
  };

  // Calculate chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter?.chapterContent?.forEach((lecture) => {
      time += lecture.lectureDuration;
    });

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Calculate total course duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course?.courseContent?.forEach((chapter) => {
      chapter?.chapterContent?.forEach((lecture) => {
        time += lecture.lectureDuration;
      });
    });

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Calculate total number of lectures
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course?.courseContent?.forEach((chapter) => {
      totalLectures += chapter?.chapterContent?.length || 0;
    });

    return totalLectures;
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
