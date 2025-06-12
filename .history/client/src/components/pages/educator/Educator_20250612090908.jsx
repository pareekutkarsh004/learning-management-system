import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../educators/Navbar'
function Educator() {
  return (
    <div className='text-deafault min-h-screen '>
    <Navbar/>
    <div
        {<Outlet />}></div>
    </div>
  )
}

export default Educator