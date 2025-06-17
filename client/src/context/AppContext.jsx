import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import {useAuth,useUser} from "@clerk/clerk-react"
import humanizeDuration from "humanize-duration";
import axios from 'axios'
import { toast } from "react-toastify";
export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const currency = import.meta.env.VITE_CURRENCY || "₹"; // fallback to ₹ if undefined
    
    const {getToken} = useAuth()
    const {user} =useUser() 
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [userData, setUserData] = useState(null);

    // Fetch all courses from the server or use dummy
    const fetchAllCourses = async () => {
        // setAllCourses(dummyCourses);
        try {
            const {data} = await axios.get(backendURL + '/api/course/all');
            if(data.success){
                setAllCourses(data.courses)
            }else{
              toast.error(data.message)
            }
        } catch (error) {
             toast.error(error.message)
        }
        // In real use-case, you can fetch from API here
        // const response = await axios.get('/api/courses');
        // setAllCourses(response.data);
    };  
    
    //Fetch User data
    const fetchUserData = async()=>{

        if(user?.publicMetadata?.role === 'educator'){
            setIsEducator(true);
        }

        try {
            const token = await getToken();

            const response = await axios.get(backendURL +'/api/user/data',{headers: 
                {Authorization: `Bearer ${token}`}})
            
            if(response.data.success){
                setUserData(response.data.user)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    
    //fetch enrolled courses from the server or use dummy
    const fetchUserEnrolledCourses = async () => {

        // In real use-case, you can fetch from API here
        // const response = await axios.get('/api/enrolled-courses');
        // setEnrolledCourses(response.data);
        // setEnrolledCourses(dummyCourses); // Using dummy data for now

        try {
            const token= await getToken();
            const{data} = await axios.get(backendURL +'/api/user/enrolled-courses',
                {headers:{Authorization:`Bearer ${token}`}})
    
            if(data.success){
                setEnrolledCourses(data.enrolledCourses.reverse())
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

    };

    useEffect(() => {
        fetchAllCourses();
        // fetchUserEnrolledCourses();
    }, []);


//    const logToken = async()=>{
//     console.log(await getToken());
//    }
    useEffect(()=>{
       if(user){
        //  logToken() 
         fetchUserData()
         fetchUserEnrolledCourses();
       } 
    },[user])

    // Calculate average rating for a course
    const calculateRating = (course) => {
        if (!course.courseRatings || course.courseRatings.length === 0) return 0;
        const totalRating = course.courseRatings.reduce(
            (sum, rating) => sum + rating.rating,
            0
        );
        // return (totalRating / course.courseRatings.length).toFixed(1);
        return Math.floor (totalRating / course.courseRatings.length)
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
        enrolledCourses,
        setEnrolledCourses,
        fetchAllCourses,
        backendURL,
        userData,
        setUserData,
        getToken,
        
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
