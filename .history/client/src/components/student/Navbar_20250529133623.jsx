import { assets } from 'assets/assets'
import React from 'react'
import { Link } from 'react-router-dom'
// import assets from '../../assets/navbar.png'
function Navbar() {
const IsC

  return (
    <div className='flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-2500 py-4'>
        <img src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer '/>
        <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div>
          <button>
            Become an Educator
          </button>
          <Link to="/my-enrollments" >
            My Enrollments
          </Link>
        </div>
        <button className='bg-blue text-white mx-t py-2 rounded-full'>Create Account</button>
        </div>
        <div></div>
    </div>
  )
}

export default Navbar