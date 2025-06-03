import React from 'react';
import assets from '../../assets/assets';

function CallToAction() {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
      <h1 className='text-xl md:text-4xl font-semibold text-gray-800 '>
        Learn anything, anytime, anywhere
      </h1>
      <p className='text-gray-500 sm:text-sm'>
        Join our community of learners and educators. Explore a wide range of courses, from programming to art, and take your skills to the next level. Sign up today and start your learning journey with us!
      </p>
      <div className='flex items-center  font-medium mt-4 gap-6'>
        <button className='bg-blue-600 text-white px-10 py-3 rounded-medium hover:bg-blue-600 transition'>
          Get Started
        </button>
        <button className='flex items-center gap-2 text-blue-600 font-medium hover:underline'>
          Learn More <img src={assets.arrow_icon} alt='arrow_icon' className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}

export default CallToAction;
