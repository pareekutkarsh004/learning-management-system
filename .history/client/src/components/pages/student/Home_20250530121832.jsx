import React from 'react'
import Hero from '../../student/Hero'
import companies from '../../student/'
function Home() {
  return (
    <div className='flex flex-col  items-center text-center space-y-7'>
   <Hero/>
      <companies />
    </div>
  )
}

export default Home