import React from 'react'
import { Routes } from 'react-router-dom'
import Home from './components/pages/student/Home'

function App() {
  return (
    <div>
     <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<div>About Page</div>} />
      <Route path="/contact" element={<div>Contact Page</div>} />
     </Routes>
    </div>
    
  )
}

export default App
