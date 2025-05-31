import { createContext, useState } from "react";

export const AppContext = createContext();
export const  AppContextProvider = (props)=>{

    const currency=import.meta.env.Vite_Currency;
    const [allCourses,setAllCourses]=useState([]);
    //fetch all courses from the server and set it to allCourses state
    const 
     const value ={
        currency
        };
    return (
       
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}