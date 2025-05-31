import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const currency = import.meta.env.VITE_CURRENCY || "₹"; // fallback to ₹ if undefined
    const [allCourses, setAllCourses] = useState([]);

    // Fetch all courses from the server or use dummy
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
        // In real use-case, you can fetch from API here
        // const response = await axios.get('/api/courses');
        // setAllCourses(response.data);
    };

    useEffect(() => {
        fetchAllCourses();
    }, []);

    // Calculate average rating for a course
    const calculateRating = (course) => {
        if (!course.courseRatings || course.courseRating.length === 0) {
            return 0;
        }
        const totalRating = course.courseRating.reduce(
            (sum, rating) => sum + rating.rating,
            0
        );
        return (totalRating / course.courseRating.length).toFixed(1);
    };

    const value = {
        currency,
        allCourses,
        calculateRating,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
