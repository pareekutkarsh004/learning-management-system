import { assets } from 'assets/assets'
import React from 'react'
// import assets from '../../assets/navbar.png'
function Navbar() {
  return (
    <div>
        <img src={assets.logo} alt="Logo" className='w-28 lg:w-32 c'/>
    </div>
  )
}

export default Navbar