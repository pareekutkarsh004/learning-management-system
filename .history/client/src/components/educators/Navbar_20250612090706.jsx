import React from 'react'
import assets from '../../assets/assets'
import { UserButton,useUser } from '@clerk/clerk-react'

function Navbar() {
  const educatorData = assets.dummyEducatorData
  const { user } = useUser()

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <Link to='/'>
        <img src={assets.logo} alt='Logo' className='w-28 lg:w-32' />
      </Link>
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi! {user ? user.fullName : 'Developers'}</p>
        {user ? <UserButton /> : <img className='max-w-8' src={assets.profile_img} />}
      </div>
    </div>
  )
}

export default Navbar