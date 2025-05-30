import { assets } from 'assets/assets'
import React from 'react'
// import assets from '../../assets/navbar.png'
function Navbar() {
  return (
    <div>
        <img src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer '/>
        <div className='hidden md:flex items-center gap-5 teg'>

        </div>
        <div></div>
    </div>
  )
}

export default Navbar