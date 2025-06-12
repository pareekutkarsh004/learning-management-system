import React from 'react'
import { Outlet } from 'react-router-dom'
function Educator() {
  return (
    <div>
    <Nav
        {<Outlet />}
    </div>
  )
}

export default Educator