import React from 'react'
import assets from '../../assets/assets'

function Footer() {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
        <div> className=''
        <div>
          <img src={assets.logo_dark} alt='logo'/>
          <p>
            Your Company Name is a leading platform for online learning, offering a wide range of courses to help you achieve your educational and professional goals. Join us today and start your learning journey!
          </p>

        </div>
        <div></div>
        <div></div>
        </div>
        <p>
            &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
    </footer>
  )
}

export default Footer