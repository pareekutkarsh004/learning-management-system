import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const currency = import.meta.env.VITE_CURRENCY || "₹"; // fallback to ₹ if undefined
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    // Fetch all courses from the server or use dummy
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
        // In real use-case, you can fetch from API here
        // const response = await axios.get('/api/courses');
        // setAllCourses(response.data);
    };  //fetch enrolled courses from the server or use dummy
    const fetchEnrolledCourses = async () => {
        // In real use-case, you can fetch from API here
        // const response = await axios.get('/api/enrolled-courses');
        // setEnrolledCourses(response.data);
        setEnrolledCourses(dummyCourses); // Using dummy data for now
    };

    useEffect(() => {
        fetchAllCourses();
    }, []);

    // ✅ Calculate average rating
    const calculateRating = (course) => {
        if (!course.courseRatings || course.courseRatings.length === 0) return 0;
        const totalRating = course.courseRatings.reduce(
            (sum, rating) => sum + rating.rating,
            0
        );
        return (totalRating / course.courseRatings.length).toFixed(1);
    };

    // ✅ Calculate chapter time
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.forEach((lecture) => {
            time += lecture.lectureDuration;
        });
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    };

    // ✅ Calculate course duration
    const calculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.forEach((chapter) => {
            chapter.chapterContent.forEach((lecture) => {
                time += lecture.lectureDuration;
            });
        });
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
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
