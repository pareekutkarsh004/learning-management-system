import React from 'react';
import Hero from '../../student/Hero';
import Companies from '../../student/companies'; // Capitalized
import CourseSection from '../../student/CourseSection';

function Home() {
  return (
    <div className='flex flex-col items-center text-center space-y-7'>
      <Hero />
      <Companies /> {/* Capitalized usage */}
      <CourseSection/>
      <Tes
    </div>
  );
}

export default Home;
