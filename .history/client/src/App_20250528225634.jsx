import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/student/Home';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<Home />} />
        <Route path="/course-list/:input" element={<Home />} />
        <Route path="/course/:id" element={<Home />} />
        <Route path="/my-enrollments" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
