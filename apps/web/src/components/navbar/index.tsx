import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-black shadow-lg z-50 h-[8vh]">
      <div className="flex items-center h-full px-4 w-full">
        {/* Left-aligned "FRUG" with bold font */}
        <div className="absolute left-4 flex items-center">
          <li className="font-bold text-2xl text-gray-800 dark:text-gray-200 list-none ml-4">
            FRUG
          </li>
        </div>

        {/* Center-aligned other navbar links */}
        <div className="flex justify-center items-center space-x-8 mx-auto">
          <ul className="flex space-x-8 list-none">
            <li className="text-gray-800 dark:text-gray-200">Home</li>
            <li className="text-gray-800 dark:text-gray-200">Products</li>
            <li className="text-gray-800 dark:text-gray-200">Stores</li>
            <li className="text-gray-800 dark:text-gray-200">About</li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;





