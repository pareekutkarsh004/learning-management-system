import { createContext, useState } from "react";

export const AppContext = createContext();
export const  AppContextProvider = (props)=>{

    const currency=import.meta.env.Vite_Currency;
    const [allCourses,setAllCourses]=useState([])
     const value ={
        currency
        };
    return (
       
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}