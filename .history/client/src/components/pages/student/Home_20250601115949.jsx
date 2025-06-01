import React from 'react';
import Hero from '../../student/Hero';
import Companies from '../../student/companies'; // Capitalized
import CourseSection from '../../student/CourseSection';
import TestimonialSections from '../../student/TestimonialSections';

function Home() {
  return (
    <div className='flex flex-col items-center text-center space-y-7'>
      <Hero />
      <Companies /> {/* Capitalized usage */}
      <CourseSection/>
      <TestimonialSections/>
      <
    </div>
  );
}

export default Home;
