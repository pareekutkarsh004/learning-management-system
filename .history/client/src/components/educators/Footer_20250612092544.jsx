import React from 'react';
import assets from '../../assets/assets';

const Footer = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full px-8 py-4 border-t text-gray-500 text-sm">

      {/* Left side: Copyright + Social Icons */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <p className="text-center md:text-left">
          Copyright 2025 © GreatStack. All Rights Reserved.
        </p>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="#">
            <img src={assets.facebook_icon} alt="facebook_icon" className="w-5 h-5" />
          </a>
          <a href="#">
            <img src={assets.twitter_icon} alt="twitter_icon" className="w-5 h-5" />
          </a>
          <a href="#">
            <img src={assets.instagram_icon} alt="instagram_icon" className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Right side: Logo */}
      <img
        className="w-20 hidden md:block"
        src={assets.logo}
        alt="logo"
      />
    </div>
  );
};

export default Footer;
