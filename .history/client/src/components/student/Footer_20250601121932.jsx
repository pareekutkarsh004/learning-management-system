import React from 'react'
import assets from '../../assets/assets'

function Footer() {
  return (
    <footer>
        <div>
        <div>
          <img src={assets.logo_dark}/>

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