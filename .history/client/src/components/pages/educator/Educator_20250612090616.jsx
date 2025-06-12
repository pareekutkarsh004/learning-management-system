import React from 'react'
import { Outlet } from 'react-router-dom'
function Educator() {
  return (
    <div>
    <Navbat
        {<Outlet />}
    </div>
  )
}

export default Educator