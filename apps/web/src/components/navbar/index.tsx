import React, { useState } from "react";
import { useRouter } from "next/router";
import { FaCartShopping } from "react-icons/fa6";
import { MdAccountBox } from "react-icons/md";
import { RiLoginBoxFill } from "react-icons/ri";
import ShoppingCart from "../shopping-cart"; // Import ShoppingCart component

const Navbar: React.FC = () => {
  const [isCartOpen, setCartOpen] = useState(false); // State for ShoppingCart visibility
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/auth/login-page");
  };

  const handleProfileClick = () => {
    router.push("/profile-editor");
  };

  const toggleCart = () => {
    setCartOpen(!isCartOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50 h-[8vh] mt-[3vh] border-b border-black">
        <div className="flex items-center h-full px-4 w-full">
          {/* Logo Section */}
          <div className="absolute flex items-center">
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
            <FaCartShopping
              className="text-black text-3xl cursor-pointer"
              onClick={toggleCart} // Toggle ShoppingCart visibility
            />
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

      {/* ShoppingCart Component */}
      <ShoppingCart isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;

