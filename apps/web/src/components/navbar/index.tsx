import React from "react";
import { useRouter } from "next/router";
import { FaCartShopping } from "react-icons/fa6";
import { MdAccountBox } from "react-icons/md";
import { RiLoginBoxFill } from "react-icons/ri";
import ShoppingCart from "../shopping-cart";

const Navbar: React.FC = () => {
  const [isCartOpen, setCartOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<string[]>([]); // Replace `string[]` with the actual type of cart items
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/auth/login-page");
  };

  const handleProfileClick = () => {
    router.push("/user/profile-editor");
  };

  const toggleCart = () => {
    setCartOpen(!isCartOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50 h-[8vh] mt-[3vh] border-b border-black">
        <div className="flex items-center h-full px-4 w-full">
          <div className="absolute flex items-center">
            <li className="font-bold text-2xl text-black list-none ml-4">FRUGGER</li>
          </div>

          <div className="flex justify-center items-center space-x-8 mx-auto">
            <ul className="flex space-x-8 list-none">
              <li className="text-black">Home</li>
              <li className="text-black">Products</li>
              <li className="text-black">Stores</li>
              <li className="text-black">About</li>
            </ul>
          </div>

          <div className="absolute right-4 flex items-center space-x-4">
            <FaCartShopping
              className="text-black text-3xl cursor-pointer"
              onClick={toggleCart}
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

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems} // Pass cartItems here
      />
    </>
  );
};

export default Navbar;

