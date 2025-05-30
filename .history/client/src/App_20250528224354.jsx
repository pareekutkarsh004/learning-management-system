import React from 'react'
import { Routes } from 'react-router-dom'

function Home() {
  return (
    <div>
     <Routes>
      <Route path="/" element={<div>Home Page</div>} />
      <Route path="/about" element={<div>About Page</div>} />
      <Route path="/contact" element={<div>Contact Page</div>} />
      {/* Add more routes as needed */}
     </Routes>
    </div>
    
  )
}

export default Home
