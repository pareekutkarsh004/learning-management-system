import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all required components/pages
import Home from './components/pages/student/Home';
import CourseList from './components/pages/student/CourseList';
// import CourseDetails from './components/pages/student/CourseDetails';
import MyEnrollments from './components/pages/student/MyEnrollment';
import Player from './components/pages/student/Player';
import CourseDetails from './components/pages/student/CDetails'; // Ensure this component exists 
// import NotFound from './components/pages/NotFound'; // optional fallback

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
