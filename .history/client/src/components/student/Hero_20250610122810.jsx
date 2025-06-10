import React from 'react'
import assets from "../../assets/assets";
import SearchBar from './SearchBar';
function Hero() {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70 to-white'>

      <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto'>
        Empower your future with the courses designed to
        <span className='relative text-blue-600 inline-block'>
          fit your choice.
          <img
            src={assets.sketch}
            alt='sketch'
            className='absolute -bottom-2 left-0 md:-bottom-3 md:left-1/4 lg:left-1/3 w-[130px] md:w-[180px]'
          />
        </span>
      </h1>

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