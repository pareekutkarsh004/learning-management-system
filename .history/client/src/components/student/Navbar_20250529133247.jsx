import { assets } from 'assets/assets'
import React from 'react'
import { Link } from 'react-router-dom'
// import assets from '../../assets/navbar.png'
function Navbar() {
  return (
    <div>
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
        <button className='bg-blue text-white '>Create Account</button>
        </div>
        <div></div>
    </div>
  )
}

export default Navbar