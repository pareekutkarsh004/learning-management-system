import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/student/Home';
import CourseList from './components/pages/student/CourseList';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CourseList/>} />
        <Route path="/course-list/:input" element={<CourseList/>} />
        <Route path="/course/:id" element={<CourseDetails/>} />
        <Route path="/my-enrollments" element={<Home />} />
        <Route path="/player/:courseId" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
