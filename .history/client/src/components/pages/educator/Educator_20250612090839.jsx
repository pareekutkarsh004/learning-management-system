import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../educators/Navbar'
function Educator() {
  return (
    <div className='text-deafault flex flex-col items-center justify-between min-h-screen bg-gray-100'>
    <Navbar/>
    <div
        {<Outlet />}></div>
    </div>
  )
}

export default Educator