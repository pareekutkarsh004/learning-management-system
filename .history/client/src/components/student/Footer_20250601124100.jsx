import React from 'react';
import assets from '../../assets/assets';

function Footer() {
  return (
    <footer className='bg-gray-900 text-white w-full mt-10 px-8 md:px-36 py-10'>
      <div className='flex flex-col md:flex-row justify-between gap-10'>

        {/* Company Info */}
        <div className='max-w-md'>
          <img src={assets.logo_dark} alt='logo' className='h-10 mb-4' />
          <p className='text-gray-400'>
            Your Company Name is a leading platform for online learning, offering a wide range of courses to help you achieve your educational and professional goals. Join us today and start your learning journey!
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className='text-lg font-semibold mb-3'>Company</h3>
          <ul className='text-gray-400 space-y-2'>
            <li><a href='#'>Home</a></li>
            <li><a href='#'>About us</a></li>
            <li><a href='#'>Contact us</a></li>
            <li><a href='#'>Privacy policy</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className='max-w-sm'>
          <h3 className='text-lg font-semibold mb-3'>Subscribe to our newsletter</h3>
          <p className='text-gray-400 mb-4'>
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <div className='flex'>
            <input
              type='email'
              placeholder='Enter your email'
              className='px-4 py-2 rounded-l-md bg-gray-800 text-white border border-gray-700 focus:outline-none w-full'
            />
            <button className='px-4 py-2 bg-blue-600 rounded-r-md hover:bg-blue-700 text-white'>
              Subscribe
            </button>
          </div>
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
