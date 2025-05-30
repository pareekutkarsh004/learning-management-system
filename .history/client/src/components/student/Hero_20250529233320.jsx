import React from 'react'
import assets from "../../assets/assets";
function Hero() {
  return (
    <div>
        <h1>
        Empower your future with the
        courses designed to<span className='text-blue-'>fit your choice.</span><img src={assets.sketch} alt='sketch' className='md:block hidden absloute -bottom-7 right-0 '/>
        </h1>
    </div>
  )
}

export default Hero