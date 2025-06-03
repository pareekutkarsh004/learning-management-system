import React from 'react';
import assets from '../../assets/assets';

function Footer() {
  return (
    <footer className='bg-gray-900 text-white w-full mt-10 px-8 md:px-36 py-10'>
      {/* Centered Logo Section */}
      <div className='text-center max-w-2xl mx-auto mb-10'>
        <img src={assets.logo_dark} alt='logo' className='h-10 mx-auto mb-4' />
        <p className='text-gray-400'>
          Your Company Name is a leading platform for online learning, offering a wide range of courses to help you achieve your educational and professional goals. Join us today and start your learning journey!
        </p>
      </div>

      {/* Footer Links Section */}
      <div className='flex flex-col md:flex-row items-start justify-between gap-10'>
        <div>
          <h3 className='text-lg font-semibold mb-3'>Company</h3>
          <ul className='text-gray-400 space-y-2'>
            <li><a href='#'>About Us</a></li>
            <li><a href='#'>Careers</a></li>
            <li><a href='#'>Blog</a></li>
          </ul>
        </div>
        <div>
          <h3 className='text-lg font-semibold mb-3'>Support</h3>
          <ul className='text-gray-400 space-y-2'>
            <li><a href='#'>Help Center</a></li>
            <li><a href='#'>Contact Us</a></li>
            <li><a href='#'>Terms & Conditions</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <p className='text-center text-gray-500 text-sm mt-10'>
        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
