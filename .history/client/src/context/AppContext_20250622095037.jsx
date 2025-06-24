import { createContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const { getToken, isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(false);

  const isClerkReady = authLoaded && userLoaded;

  const fetchAllCourses = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/course/all`);
      const data = response.data;

      if (data.success) {
        setAllCourses(data.courses);
        console.log("✅ Courses fetched:", data.courses.length);
      } else {
        toast.error(data.message || "Failed to load courses");
      }
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      toast.error(error.response?.data?.message || "Failed to load courses");
    }
  };

  const fetchUserData = async () => {
    if (!user) {
      console.log("❌ No user found, skipping fetchUserData");
      setUserDataLoading(false);
      return;
    }

    try {
      setUserDataLoading(true);
      console.log("🔄 Fetching user data...");

      const token = await getToken();
      if (!token) {
        console.log("❌ No token available");
        toast.error("Authentication failed. Please login again.");
        setUserDataLoading(false);
        return;
      }

      const response = await axios.get(`${backendURL}/api/user/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success && response.data.user) {
        const userFetched = response.data.user;
        setUserData(userFetched);
        setIsEducator(userFetched.role === "educator");
        console.log("✅ User data set:", userFetched);
      } else {
        const fallbackUser = {
          clerkId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          enrolledCourses: [],
        };
        setUserData(fallbackUser);
        setIsEducator(false);
        console.log("⚠️ No user returned from backend, local data created");
      }
    } catch (error) {
      console.error("❌ fetchUserData error:", error);

      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
        setUserData(null);
      } else if (error.response?.status === 404) {
        const fallbackUser = {
          clerkId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          enrolledCourses: [],
        };
        setUserData(fallbackUser);
        setIsEducator(false);
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load user profile"
        );
      }
    } finally {
      setUserDataLoading(false);
    }
  };

  const updateEducatorRole = async () => {
    try {
      const token = await getToken();
      if (!token || !user) return;

      const response = await axios.get(
        `${backendURL}/api/educator/update-role`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("✅ Role updated to educator");
        setIsEducator(true);
        await fetchUserData(); // Refresh user data
      } else {
        console.warn("⚠️ Failed to update role to educator");
      }
    } catch (error) {
      console.error("❌ Error updating educator role:", error);
    }
  };

  const fetchUserEnrolledCourses = async () => {
    if (!user) {
      console.log("❌ No user found, skipping fetchUserEnrolledCourses");
      return;
    }

    try {
      const token = await getToken();
      if (!token) return;

      const response = await axios.get(
        `${backendURL}/api/user/enrolled-courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.success) {
        const courses = data.enrolledCourses?.reverse() || [];
        setEnrolledCourses(courses);

        if (userData) {
          setUserData((prev) => ({
            ...prev,
            enrolledCourses: data.enrolledCourses || [],
          }));
        }
      } else {
        if (data.message !== "User not found") toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching enrolled courses:", error);

      if (error.response?.status !== 404) {
        toast.error(
          error.response?.data?.message || "Failed to load enrolled courses"
        );
      }
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (!isClerkReady) return;

    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    } else {
      setUserData(null);
      setIsEducator(false);
      setEnrolledCourses([]);
      setUserDataLoading(false);
    }
  }, [user, isClerkReady]);

  const calculateRating = (course) => {
    if (!course?.courseRatings?.length) return 0;
    const total = course.courseRatings.reduce((sum, r) => sum + r.rating, 0);
    return (total / course.courseRatings.length).toFixed(1);
  };

  const calculateChapterTime = (chapter) => {
    const time =
      chapter?.chapterContent?.reduce(
        (acc, lec) => acc + (lec.lectureDuration || 0),
        0
      ) || 0;
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;
    course?.courseContent?.forEach((ch) =>
      ch?.chapterContent?.forEach((lec) => {
        time += lec.lectureDuration || 0;
      })
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateNoOfLectures = (course) => {
    return course?.courseContent?.reduce(
      (sum, chapter) => sum + (chapter?.chapterContent?.length || 0),
      0
    );
  };

  const refreshUserData = async () => {
    if (user && isClerkReady) {
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
    backendUrl: backendURL,
    userData,
    setUserData,
    userDataLoading,
    getToken,
    refreshUserData,
    isClerkReady,
    isSignedIn,
    updateEducatorRole,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
