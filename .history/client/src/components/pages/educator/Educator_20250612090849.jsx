import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../educators/Navbar'
function Educator() {
  return (
    <div className='text-deafault ='>
    <Navbar/>
    <div
        {<Outlet />}></div>
    </div>
  )
}

export default Educator