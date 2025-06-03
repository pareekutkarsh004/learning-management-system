import { createContext, useState } from "react";

export const AppContext = createContext();
export const  AppContextProvider = (props)=>{

    const currency=import.meta.env.Vite_Currency;
    const [allCourses,setAllCourses]=useState([]);
    //fetch all courses from the server and set it to allCourses state
    const fetchAllCourses = async () => {
        try {
            const response = await fetch('/api/courses');
            const data = await response.json();
            setAllCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
     const value ={
        currency
        };
    return (
       
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}