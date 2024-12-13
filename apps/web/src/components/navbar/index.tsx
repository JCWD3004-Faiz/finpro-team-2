import React from "react";
import { useRouter } from "next/router"; 
import { FaCartShopping } from "react-icons/fa6";
import { MdAccountBox } from "react-icons/md";
import { RiLoginBoxFill } from "react-icons/ri";

const Navbar: React.FC = () => {
  const router = useRouter(); // Initialize the router object

  const handleLoginClick = () => {
    router.push("/auth/login-page"); // Redirect to the login page
  };

  const handleProfileClick = () => {
    router.push("/profile-editor"); // Redirect to the profile editor page
  };

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
          <FaCartShopping className="text-black text-3xl" />
          <MdAccountBox
            className="text-black text-3xl cursor-pointer"
            onClick={handleProfileClick} 
          />
          <RiLoginBoxFill
            className="text-black text-3xl cursor-pointer"
            onClick={handleLoginClick} 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


