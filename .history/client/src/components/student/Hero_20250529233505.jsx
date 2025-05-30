import React from 'react'
import assets from "../../assets/assets";
function Hero() {
  return (
    <div className='flex flex-col items-center justify-center bg-cyan-100/70 py-10 md:py-20 px-4 sm:px-10 md:px-14 lg:px-36 relative'>
        <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto'>
        Empower your future with the
        courses designed to<span className='text-blue-600'>fit your choice.</span><img src={assets.sketch} alt='sketch' className='md:block hidden absloute -bottom-7 right-0 '/>
        </h1>
    </div>
  )
}

export default Hero