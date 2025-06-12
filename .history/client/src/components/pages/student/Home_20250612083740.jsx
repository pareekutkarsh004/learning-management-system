mport React from 'react';
import Hero from '../../student/Hero';
import Companies from '../../student/companies'; // Capitalized
import CourseSection from '../../student/CourseSection';
import TestimonialSections from '../../student/TestimonialSections';
import CallToAction from '../../student/CallToAction';
import Footer from '../../student/Footer';

function Home() {
  return (
    <div className='relative w-full'>
      {/* Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full min-h-screen z-[-1] bg-gradient-to-b from-cyan-100/70 to-white"></div>

      {/* Actual Content */}
      <div className='flex flex-col items-center text-center space-y-7 relative z-10 w-full'>
        <Hero />
        <Companies />
        <CourseSection />
        <TestimonialSections />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}


export default Home;
