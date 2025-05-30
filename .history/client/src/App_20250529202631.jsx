import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Student pages
import Home from './components/pages/student/Home';
import CourseList from './components/pages/student/CourseList';
import CourseDetails from './components/pages/student/CDetails';
import MyEnrollments from './components/pages/student/MyEnrollment';
import Player from './components/pages/student/Player';
import Loading from './components/student/Loading';

// Educator pages
import Educator from './components/pages/educator/Educator';
import Dashboard from './components/pages/educator/Dashboard';
import AddCourse from './components/pages/educator/AddCourse';
import MyCourse from './components/pages/educator/MyCourses';
import StudentsEnrolled from './components/pages/educator/StudentsEnrolled'; // ✅ fixed
import Navbar from './components/student/Navbar';/

function App() {
  return (
    <div className='text-default min-h-screen bg-white'>
    <Navbar/>
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />

        {/* Educator Routes */}
        <Route path="/educator" element={<Educator />}>
          <Route path="educator" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-course" element={<MyCourse />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
