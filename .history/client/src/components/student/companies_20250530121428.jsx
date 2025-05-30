import React from 'react'
import assets from "../../assets/assets";
function companies() {
  return (
    <div>
      <p>
        Trusted by learners from
      </p>
      <div>
        <img src={assets.microsoft_logo} alt='microsoft_logo' className='w-20 md:w-28' />
        <img src={assets.walmart_logo} alt='walmart' className='w-20 md:w-28' />
        <img src={assets.accenture_logo} alt='accenture' className='w-20 md:w-28' />
        <img src={assets.adobe_logo} alt='microsoft_logo' className='w-20 md:w-28' />
        <img src={assets.paypal_logo} alt='microsoft_logo' className='w-20 md:w-28' />
      </div>
    </div>
  )
}

export default companies