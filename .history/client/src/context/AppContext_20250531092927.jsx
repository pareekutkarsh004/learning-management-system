import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";

export const AppContext = createContext();
export const  AppContextProvider = (props)=>{

    const currency=import.meta.env.Vite_Currency;
    const [allCourses,setAllCourses]=useState([]);
    //fetch all courses from the server and set it to allCourses state
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
        }
        useEffect(()=>{
        fetchAllCourses();
        },[])
    const calucateRating=(course)=>{
if(course.courseRating==0){
    return 0;
    }
    let totalrating=0;
    course.courseRating.forEach((rating)=>{
        totalrating+=rating.rating;
    })
    else{

    }
     const value ={
        currency,allCourses
        };
    return (
       
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}