import React from 'react'
import assets from '../../assets/assets'
import { UserButton,useUser } from '@clerk/clerk-react'
function Navbar() {
  const educatorData=assets.dummyEducatorData
  const { user } = useUser();
  return (
    <div>
      
    </div>
  )
}

export default Navbar