import React from 'react'
import assets from "../../assets/assets";
function Hero() {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 textt-center bg-gradient-to-b from-cyan-100/70 '>
        <h1>Empower your future with the
        courses designed to<span className='text-blue-600'>fit your choice.</span><img src={assets.sketch} alt='sketch' className='md:block hidden absloute -bottom-7 right-0 '/>
        </h1>
    </div>
  )
}

export default Hero