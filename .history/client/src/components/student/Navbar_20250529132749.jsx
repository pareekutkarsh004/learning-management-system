import { assets } from 'assets/assets'
import React from 'react'
// import assets from '../../assets/navbar.png'
function Navbar() {
  return (
    <div>
        <img src={assets.logo} alt="Logo"/>
    </div>
  )
}

export default Navbar