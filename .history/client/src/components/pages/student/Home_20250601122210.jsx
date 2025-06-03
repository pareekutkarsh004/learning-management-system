import React from 'react';
import Hero from '../../student/Hero';
import Companies from '../../student/companies'; // Capitalized
import CourseSection from '../../student/CourseSection';
import TestimonialSections from '../../student/TestimonialSections';
import CallToAction from '../../student/CallToAction';

function Home() {
  return (
    <div className='flex flex-col items-center text-center space-y-7'>
      <Hero />
      <Companies /> {/* Capitalized usage */}
      <CourseSection/>
      <TestimonialSections/>
      <CallToAction/>
      <foo
    </div>
  );
}

export default Home;
