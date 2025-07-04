import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import Loading from "../../student/Loading";
import assets from "../../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../student/Footer";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";

function CDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
    userData,
    backendURL,
    getToken,
    isSignedIn,
    userDataLoading,
    // refreshUserData,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/course/${id}`);
      if (data.success && data.course) {
        setCourse(data.course);
      } else {
        toast.error(data.message || "Failed to fetch course");
      }
    } catch (error) {
      console.error("❌ Error fetching course:", error);
      toast.error(
        error.response?.data?.message || error.message || "Server error"
      );
    }
  };

  const enrollCourse = async () => {
    if (loading) return;

    if (!isSignedIn) {
      toast.warn("Please sign in to enroll in this course");
      return;
    }

    if (!course?._id) {
      toast.error("Course data is not available");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      if (!token) {
        toast.warn("Authentication required. Please sign in again.");
        return;
      }

      // Check if user data is available for enrollment check
      let currentUser = userData;
      if (!currentUser || userDataLoading) {
        console.log("🔄 Refreshing user data...");
        // If you have refreshUserData function in context, uncomment below
        // const refreshed = await refreshUserData();
        // currentUser = refreshed;
      }

      if (!currentUser) {
        toast.error("Unable to load user profile. Please try again.");
        return;
      }

      // Check enrollment status
      if (currentUser.enrolledCourses?.includes(course._id)) {
        toast.warn("You are already enrolled in this course");
        setIsEnrolled(true);
        return;
      }

      console.log("🔍 Making purchase request:", {
        courseId: course._id,
        backendURL,
        token: token ? "present" : "missing",
      });

      // Make the purchase request
      const { data } = await axios.post(
        `${backendURL}/api/user/purchase-course`,
        {
          courseId: course._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 second timeout
        }
      );

      console.log("✅ Purchase response:", data);

      if (data.success) {
        if (data.session_url) {
          // For payment gateway redirect (Stripe/Razorpay)
          console.log("🔄 Redirecting to payment:", data.session_url);
          window.location.replace(data.session_url);
        } else {
          // For direct enrollment
          toast.success("Successfully enrolled in the course!");
          setIsEnrolled(true);
          // Refresh user data if function is available
          // await refreshUserData();
        }
      } else {
        toast.error(data.message || "Enrollment failed");
      }
    } catch (err) {
      console.error("❌ Purchase error:", err);

      // Enhanced error handling
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.message;

        console.error("❌ Response error:", {
          status,
          message,
          data: err.response.data,
        });

        switch (status) {
          case 404:
            toast.error(
              "Enrollment service not found. Please contact support."
            );
            break;
          case 401:
            toast.error("Authentication failed. Please sign in again.");
            break;
          case 400:
            toast.error(
              message || "Invalid request. Please check course details."
            );
            break;
          case 409:
            toast.error("You are already enrolled in this course.");
            setIsEnrolled(true);
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error(message || "Enrollment failed");
        }
      } else if (err.request) {
        console.error("❌ Network error:", err.request);
        toast.error("Network error. Please check your connection.");
      } else if (err.code === "ECONNABORTED") {
        toast.error("Request timeout. Please try again.");
      } else {
        console.error("❌ Unknown error:", err);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Safe video ID extraction
  const extractVideoId = (url) => {
    if (!url) return null;

    try {
      // Handle YouTube URLs
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const urlParts = url.split("/");
        const lastPart = urlParts[urlParts.length - 1];

        // Handle query parameters
        if (lastPart.includes("?")) {
          return lastPart.split("?")[0];
        }
        return lastPart;
      }

      // For direct video IDs
      return url.split("/").pop();
    } catch (error) {
      console.error("❌ Error extracting video ID:", error);
      return null;
    }
  };

  useEffect(() => {
    if (id) {
      console.log("🔍 Fetching course data for ID:", id);
      fetchCourseData();
    }
  }, [id]);

  useEffect(() => {
    if (userData && course && !userDataLoading) {
      const enrolled = userData.enrolledCourses?.includes(course._id);
      console.log("🔍 Enrollment check:", {
        enrolled,
        userCourses: userData.enrolledCourses,
        courseId: course._id,
      });
      setIsEnrolled(enrolled);
    } else {
      setIsEnrolled(false);
    }
  }, [userData, course, userDataLoading]);

  const toggleChapter = (index) => {
    setExpandedChapters((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (!course) return <Loading />;

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-cyan-100/70 to-white"></div>

      <div className="flex md:flex-row flex-col-reverse gap-10 items-start justify-between md:px-36 px-8 md:pt-30 pt-20 flex-grow">
        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
            {course.courseTitle}
          </h1>

          <p
            className="py-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: course.courseDescription?.slice(0, 200) || "",
            }}
          ></p>

          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p className="text-sm font-medium text-yellow-600">
              {calculateRating(course)}
            </p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(course))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="star"
                  className="w-4 h-4"
                />
              ))}
            </div>
            <p className="text-gray-500">
              ({course.courseRatings?.length || 0} ratings)
            </p>
            <p>{course.enrolledStudents?.length || 0} students enrolled</p>
          </div>

          <p className="text-sm">
            Course by{" "}
            <span className="text-blue-600 underline">
              {course.dummyEducatorData?.name || "Unknown Instructor"}
            </span>
          </p>

          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5">
              {course.courseContent?.map((chapter, index) => {
                const isOpen = expandedChapters.includes(index);
                return (
                  <div
                    key={index}
                    className="border border-gray-300 bg-white mb-2 rounded"
                  >
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                      onClick={() => toggleChapter(index)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={assets.down_arrow_icon}
                          alt="arrow icon"
                          className={`transform transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                        <p className="font-medium md:text-base text-sm">
                          {chapter.chapterTitle}
                        </p>
                      </div>
                      <p className="text-sm md:text-default">
                        {chapter.chapterContent?.length || 0} lectures -{" "}
                        {calculateChapterTime(chapter)}
                      </p>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <ul className="pl-4 text-gray-600 pr-2 py-2 md:pl-10 list-disc border-t border-gray-300">
                        {chapter.chapterContent?.map((lecture, idx) => (
                          <li key={idx} className="flex items-start gap-2 py-1">
                            <img
                              src={assets.play_icon}
                              alt="play"
                              className="w-4 h-4 mt-1"
                            />
                            <div className="flex items-center justify-between w-full text-xs md:text-default text-gray-800">
                              <p>{lecture.lectureTitle}</p>
                              <div className="flex gap-2">
                                {lecture.isPreviewFree && (
                                  <p
                                    className="text-blue-500 cursor-pointer hover:underline"
                                    onClick={() => {
                                      const videoId = extractVideoId(
                                        lecture.lectureUrl
                                      );
                                      if (videoId) {
                                        console.log(
                                          "🎥 Playing video ID:",
                                          videoId
                                        );
                                        setPlayerData({ videoId });
                                      } else {
                                        console.error(
                                          "❌ Invalid video URL:",
                                          lecture.lectureUrl
                                        );
                                        toast.error(
                                          "Unable to play video preview"
                                        );
                                      }
                                    }}
                                  >
                                    preview
                                  </p>
                                )}
                                <p>
                                  {humanizeDuration(
                                    lecture.lectureDuration * 60000,
                                    { units: ["h", "m"], round: true }
                                  )}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Description
            </h3>
            <p
              className="pt-3 rich-text"
              dangerouslySetInnerHTML={{
                __html: course.courseDescription || "",
              }}
            ></p>
          </div>
        </div>

        {/* Course Card */}
        <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden min-w-[300px] sm:min-w-[420px]">
          {playerData ? (
            <div className="relative">
              <YouTube
                videoId={playerData.videoId}
                iframeClassName="w-full aspect-video"
                onError={(error) => {
                  console.error("❌ YouTube player error:", error);
                  toast.error("Unable to load video preview");
                  setPlayerData(null);
                }}
              />
              <button
                onClick={() => setPlayerData(null)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
              >
                ×
              </button>
            </div>
          ) : (
            <img
              src={course.courseThumbnail}
              alt="Course thumbnail"
              className="w-full object-cover"
              onError={(e) => {
                console.error("❌ Thumbnail loading error");
                e.target.src = assets.default_course_image || "";
              }}
            />
          )}

          <div className="p-5 flex items-center gap-2">
            <img
              src={assets.time_left_clock_icon}
              alt="clock"
              className="w-4 h-4"
            />
            <p className="text-sm text-red-500">
              <span className="font-semibold">5 days</span> left at this price!
            </p>
          </div>

          <div className="flex gap-3 items-center pt-2 px-5 pb-4">
            <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
              {currency}
              {(
                course.coursePrice -
                (course.discount * course.coursePrice) / 100
              ).toFixed(2)}
            </p>
            <p className="md:text-lg text-gray-500 line-through">
              {currency}
              {course.coursePrice}
            </p>
            <p className="md:text-lg text-gray-500">{course.discount}% off</p>
          </div>

          <div className="flex justify-between items-center gap-3 px-5 pb-6 text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <img src={assets.star} alt="star" className="w-4 h-4" />
              <p>{calculateRating(course)}</p>
            </div>
            <div className="h-4 w-px bg-gray-500/40"></div>
            <div className="flex items-center gap-1">
              <img
                src={assets.time_clock_icon}
                alt="clock"
                className="w-4 h-4"
              />
              <p>{calculateCourseDuration(course)}</p>
            </div>
            <div className="h-4 w-px bg-gray-500/40"></div>
            <div className="flex items-center gap-1">
              <img src={assets.lesson_icon} alt="lesson" className="w-4 h-4" />
              <p>{calculateNoOfLectures(course)}</p>
            </div>
          </div>

          <div className="px-5 pb-8">
            <button
              className={`w-full py-3 rounded text-white font-medium transition-all ${
                isEnrolled
                  ? "bg-green-600 cursor-not-allowed"
                  : loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isEnrolled || loading}
              onClick={enrollCourse}
            >
              {loading
                ? "Processing..."
                : isEnrolled
                ? "Already Enrolled"
                : "Enroll Now"}
            </button>

            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-800">
                What's in the course?
              </p>
              <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CDetails;
