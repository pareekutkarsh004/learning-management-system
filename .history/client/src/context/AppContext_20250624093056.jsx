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
      // Don't send user token for public course listing
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

      // Handle specific error cases
      if (error.response?.status === 500) {
        console.error("Server error - check backend logs");
        toast.error("Server error. Please try again later.");
      } else if (error.response?.status === 400) {
        console.error("Bad request - check API parameters");
        toast.error("Invalid request. Please refresh the page.");
      } else {
        toast.error(error.response?.data?.message || "Failed to load courses");
      }
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
      console.log("🔄 Fetching user data for user:", user.id);

      const token = await getToken();
      if (!token) {
        console.log("❌ No token available");
        toast.error("Authentication failed. Please login again.");
        setUserDataLoading(false);
        return;
      }

      console.log("🔑 Token obtained, making API request...");

      const response = await axios.get(`${backendURL}/api/user/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 User data API response:", response.data);

      if (response.data.success && response.data.user) {
        const userFetched = response.data.user;
        setUserData(userFetched);
        setIsEducator(userFetched.role === "educator");
        console.log("✅ User data set:", {
          role: userFetched.role,
          isEducator: userFetched.role === "educator",
          userId: userFetched._id || userFetched.id,
        });
      } else {
        console.log("⚠️ No user data returned from backend, creating fallback");
        const fallbackUser = {
          clerkId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          enrolledCourses: [],
          role: "student", // Default role
        };
        setUserData(fallbackUser);
        setIsEducator(false);
        console.log("⚠️ Fallback user created with student role");
      }
    } catch (error) {
      console.error("❌ fetchUserData error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 401) {
        console.log("🔒 Authentication failed - token invalid");
        toast.error("Authentication failed. Please login again.");
        setUserData(null);
        setIsEducator(false);
      } else if (error.response?.status === 404) {
        console.log("👤 User not found in database, creating new user profile");

        // Instead of creating fallback, try to create the user in the backend
        try {
          await createUserInBackend();
        } catch (createError) {
          console.error("Failed to create user in backend:", createError);

          // Only create fallback if backend creation fails
          const fallbackUser = {
            clerkId: user.id,
            email: user.emailAddresses?.[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            enrolledCourses: [],
            role: "student",
          };
          setUserData(fallbackUser);
          setIsEducator(false);
          console.log("⚠️ Fallback user created after backend creation failed");
        }
      } else {
        console.log("💥 Unexpected error occurred");
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

  // New function to create user in backend when they don't exist
  const createUserInBackend = async () => {
    if (!user) return;

    try {
      const token = await getToken();
      if (!token) return;

      console.log("🔨 Creating user in backend...");

      const response = await axios.post(
        `${backendURL}/api/user/create`,
        {
          clerkId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          role: "student", // Default role, can be updated later
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("✅ User created in backend successfully");
        const newUser = response.data.user;
        setUserData(newUser);
        setIsEducator(newUser.role === "educator");
      } else {
        throw new Error(response.data.message || "Failed to create user");
      }
    } catch (error) {
      console.error("❌ Error creating user in backend:", error);
      throw error;
    }
  };

  const updateEducatorRole = async () => {
    try {
      const token = await getToken();
      if (!token || !user) {
        console.log("❌ Cannot update role - no token or user");
        return;
      }

      console.log("🔄 Updating user role to educator...");

      const response = await axios.post(
        `${backendURL}/api/educator/update-role`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📡 Update role response:", response.data);

      if (response.data.success) {
        console.log("✅ Role updated to educator successfully");
        setIsEducator(true);

        // Update local user data
        if (userData) {
          setUserData((prev) => ({
            ...prev,
            role: "educator",
          }));
        }

        // Refresh user data from backend
        await fetchUserData();

        toast.success("Successfully upgraded to educator account!");
      } else {
        console.warn(
          "⚠️ Failed to update role to educator:",
          response.data.message
        );
        toast.error(response.data.message || "Failed to update role");
      }
    } catch (error) {
      console.error("❌ Error updating educator role:", error);
      toast.error(
        error.response?.data?.message || "Failed to update educator role"
      );
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
    if (!isClerkReady) {
      console.log("⏳ Waiting for Clerk to be ready...");
      return;
    }

    console.log("🔄 Clerk is ready, checking user status:", {
      hasUser: !!user,
      userId: user?.id,
      isSignedIn,
    });

    if (user && isSignedIn) {
      fetchUserData();
      fetchUserEnrolledCourses();
    } else {
      console.log("👤 No user signed in, clearing data");
      setUserData(null);
      setIsEducator(false);
      setEnrolledCourses([]);
      setUserDataLoading(false);
    }
  }, [user, isClerkReady, isSignedIn]);

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

    // ✅ Count total number of lectures in a course
    // Function to calculate number of lectures in a course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;

        course?.courseContent?.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });

        return totalLectures;
    };


    // ✅ Context value to be provided
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
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
