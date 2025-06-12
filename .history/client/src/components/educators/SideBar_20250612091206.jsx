import React from 'react';
import { Link } from 'react-router-dom';
import assets from '../../../assets/assets'; // Adjust path if needed

const Sidebar = () => {
  const {isEducator}
  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  return (
    <div className="w-full md:w-64 bg-white shadow-md h-screen p-4 text-gray-800">
      <h1 className="text-lg font-bold mb-6">Sidebar</h1>
      <ul className="space-y-4">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path} className="flex items-center gap-4 hover:text-blue-600">
              <img src={item.icon} alt={`${item.name} icon`} className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
