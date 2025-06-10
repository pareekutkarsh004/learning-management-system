import React from 'react'
import assets from "../../assets/assets";
import SearchBar from './SearchBar';
function Hero() {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70 to-white'>


        <p className='md:block hidden text-gray-500 max-w-2xl mx-auto' >
        We bring together world-class instructors, interactive content, and a supportive
        community to help you achieve your personal and professional goals.
        </p>
      <p className='md:hidden text-gray-500 max-w-sm mx-auto'>We bring together world-class instructors to help you achieve your professional goals</p>
      <SearchBar/>
    </div>
  )
}

export default Hero