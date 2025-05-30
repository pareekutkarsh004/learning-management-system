import React from 'react'
import assets from "../../assets/assets";
function Hero() {
  return (
    <div className='flex flex-col items-center justify-center w-full ms:pt-36 pt-20 px-7 ms:px-0 space-y-7 textt-center '>
        <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto'>
        Empower your future with the
        courses designed to<span className='text-blue-600'>fit your choice.</span><img src={assets.sketch} alt='sketch' className='md:block hidden absloute -bottom-7 right-0 '/>
        </h1>
    </div>
  )
}

export default Hero