import React from 'react';
import assets from '../../assets/assets';

function Footer() {
  return (
    <footer className='bg-gray-900 text-white w-full mt-10 px-8 md:px-36 py-12'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>

        {/* Column 1: Logo and description */}
        <div>
          <img src={assets.logo_dark} alt='logo' className='h-10 mb-4' />
          <p className='text-gray-400 text-sm'>
            Your Company Name is a leading platform for online learning, offering a wide range of courses to help you achieve your educational and professional goals. Join us today and start your learning journey!
          </p>
        </div>

        {/* Column 2: Company Links */}
        <div>
          <h3 className='text-lg font-semibold mb-4'>Company</h3>
          <ul className='text-gray-400 text-sm space-y-2'>
            <li><a href='#'>Home</a></li>
            <li><a href='#'>About us</a></li>
            <li><a href='#'>Contact us</a></li>
            <li><a href='#'>Privacy policy</a></li>
          </ul>
        </div>

        {/* Column 3: Newsletter */}
        <div>
          <h3 className='text-lg font-semibold mb-4'>Subscribe to our newsletter</h3>
          <p className='text-gray-400 text-sm mb-4'>
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <form className='flex flex-col sm:flex-row items-center gap-2'>
            <input
              type='email'
              placeholder='Enter your email'
              className='w-full sm:w-auto px-4 py-2 rounded-md text-black focus:outline-none'
            />
            <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md'>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom copyright text */}
      <p className='text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-6'>
        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
