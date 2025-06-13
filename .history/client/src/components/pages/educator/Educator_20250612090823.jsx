import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../educators/Navbar'
function Educator() {
  return (
    <div>
    <Navbar/>
    <div
        {<Outlet />}
    </div>
  )
}

export default Educator