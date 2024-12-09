import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-black shadow-lg z-50 h-[8vh]">
      <div className="flex items-center h-full px-4 w-full">
        {/* Logo Section */}
        <div className="absolute left-4 flex items-center">
          <li className="font-bold text-2xl text-black list-none ml-4">
            FRUGGER
          </li>
        </div>

        {/* Menu Section */}
        <div className="flex justify-center items-center space-x-8 mx-auto">
          <ul className="flex space-x-8 list-none">
            <li className="text-black">Home</li>
            <li className="text-black">Products</li>
            <li className="text-black">Stores</li>
            <li className="text-black">About</li>
          </ul>
        </div>

        {/* Shopping Cart and Person Icon Section */}
        <div className="absolute right-4 flex items-center space-x-4">
          <span className="material-symbols-outlined text-black text-3xl">
            shopping_cart
          </span>
          <span className="material-symbols-outlined text-black text-3xl">
            person
          </span>
          <span className="material-symbols-outlined text-black text-3xl">
            login
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;






