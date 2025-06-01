import React from 'react';
import assets from '../../assets/assets';

function CallToAction() {
  return (
    <div className='text-center px-6 py-10 bg-gray-100 rounded-lg'>
      <h1 className='text-3xl font-bold text-gray-800 mb-4'>
        Learn anything, anytime, anywhere
      </h1>
      <p className='text-gray-600 max-w-2xl mx-auto mb-6'>
        Join our community of learners and educators. Explore a wide range of courses, from programming to art, and take your skills to the next level. Sign up today and start your learning journey with us!
      </p>
      <div className='flex justify-center gap-4'>
        <button className='bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition'>
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
