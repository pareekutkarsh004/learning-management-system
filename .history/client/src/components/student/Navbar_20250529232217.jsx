import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import assets from "../../assets/assets";
import { useClerk,UserButton,useUser } from '@clerk/clerk-react';
function Navbar() {
  const location = useLocation();
  const IsCourseListPage = location.pathname.includes('/course-list');
  const {openSignIn} = useClerk();
  const { user } = useUser();

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-2500 py-4 ${
      IsCourseListPage ? 'bg-white' : 'bg-cyan-100/70'
    }`}>
      <img src={assets.logo} alt="Logo" className="w-28 lg:w-32 cursor-pointer" />
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className='flex items-center gap-5'>
         {user&& <>
          <button>Become an Educator</button>
            <Link to="/my-enrollments">My Enrollments</Link></>}
        </div>
        {

          user ? <UserButton /> : <button onClick={()=>openSignIn()} className=" bg-blue-700 text-white  px-5 py-2 rounded-full">Create Account</button>}
      </div>
      {/* for phone sceeen */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500 '>
        <div className="flex items-center gap-1
        sm:gap-2 max-sm:text-xs">
          {user && <>
            <button>Become an Educator</button>
            <Link to="/my-enrollments">My Enrollments</Link></>}
        </div>
        {
          user ? <UserButton /> : <button onClick={(=>open)}>
            <img src={assets.user_icon} alt='user' />
          </button>
        }
       
      </div>
    </div>
  );
}

export default Navbar;
