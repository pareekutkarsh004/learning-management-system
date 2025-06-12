import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../educators/Navbar';
import Sidebar from '../../educators/Sidebar';
import Footer from '../../educators/Footer';

function Educator() {
  return (
    <div className="text-default min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Educator;
