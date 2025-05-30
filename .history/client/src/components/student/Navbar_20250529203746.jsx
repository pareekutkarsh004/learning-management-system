import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import assets from "../../assets/assets";

function Navbar() {
  const location = useLocation();
  const IsCourseListPage = location.pathname.includes('/course-list');

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-2500 py-4 ${
      IsCourseListPage ? 'bg-white' : 'bg-cyan-100/70'
    }`}>
      <img src={assets.logo} alt="Logo" className="w-28 lg:w-32 cursor-pointer" />
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div>
          <button>Become an Educator</button>
          <Link to="/my-enrollments">My Enrollments</Link>
        </div>
        <button className=" bg-blue-400 text-white mx-t py-6 rounded-full">Create Account</button>
      </div>
      <div></div>
    </div>
  );
}

export default Navbar;
