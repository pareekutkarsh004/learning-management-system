import React from 'react'
import assets from "../../assets/assets";
function companies() {
  return (
    <div>
      <p>
        Trusted by learners from
      </p>
      <div>
        <img src={assets.microsoft_logo} alt='microsoft_logo' className='w-20 ' />
      </div>
    </div>
  )
}

export default companies