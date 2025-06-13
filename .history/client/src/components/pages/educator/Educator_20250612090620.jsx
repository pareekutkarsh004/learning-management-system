import React from 'react'
import { Outlet } from 'react-router-dom'
function Educator() {
  return (
    <div>
    <Navbar
        {<Outlet />}
    </div>
  )
}

export default Educator