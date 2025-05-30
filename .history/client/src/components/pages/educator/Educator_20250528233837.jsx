import React from 'react'
import { Outlet } from 'react-router-dom'
function Educator() {
  return (
    <div>
    <h1>=</h1>Educator
        {<Outlet />}
    </div>
  )
}

export default Educator