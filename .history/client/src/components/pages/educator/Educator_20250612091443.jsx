import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../educators/Navbar'
import Sidebar from '../../educators/SideBar'
function Educator() {
  return (
    <div className='text-deafault min-h-screen bg-white'>
    <Navbar/>
    <div className='flex '>
    <Sidebar/><div className=''>
          {<Outlet />}</div>
        </div>
    </div>
  )
}

export default Educator