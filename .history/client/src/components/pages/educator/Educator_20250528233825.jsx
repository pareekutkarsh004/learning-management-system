import React from 'react'
import { Outlet } from 'react-router-dom'
function Educator() {
  return (
    <div>
    Educator
        {<Outlet />}
    </div>
  )
}

export default Educator