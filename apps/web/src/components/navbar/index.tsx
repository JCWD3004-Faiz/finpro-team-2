import React from "react";
import { useRouter } from "next/router";
import { FaCartShopping, FaBars } from "react-icons/fa6";
import { MdAccountBox } from "react-icons/md";
import { RiLoginBoxFill } from "react-icons/ri";
import ShoppingCart from "../shopping-cart";
import ExtraBox from "../extra-box";

const Navbar: React.FC = () => {
  const [isCartOpen, setCartOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<
    { productId: string; productName: string; productPrice: number }[]
  >([]);
  const [isMenuOpen, setMenuOpen] = React.useState(false);

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

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50 h-[8vh] mt-[3vh] border-b border-black">
        <div className="flex items-center justify-between h-full px-4 w-full">
          {/* Logo or Hamburger Icon */}
          <div className="flex items-center justify-between sm:w-auto w-full">
            {/* Hamburger icon for small screens */}
            <div className="sm:hidden">
              <FaBars
                className="text-black text-3xl cursor-pointer"
                onClick={toggleMenu}
              />
            </div>
            {/* "FRUGGER" logo visible on larger screens */}
            <div className="hidden sm:flex font-bold text-2xl text-black">
              FRUGMART
            </div>
            {/* "FRUGGER" logo for smaller screens, centered */}
            <div className="sm:hidden flex w-full justify-center items-center">
              <div className="text-black font-bold text-2xl">
                FRUGMART
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="sm:flex flex-grow justify-center sm:order-2 hidden">
            <ul className="flex space-x-8 list-none items-center">
              <li
                className="text-black cursor-pointer"
                onClick={() => navigateTo("/")}
              >
                Home
              </li>
              <li
                className="text-black cursor-pointer"
                onClick={() => navigateTo("/products-page")}
              >
                Products
              </li>
              <li
                className="text-black cursor-pointer"
                onClick={() => navigateTo("/about-page")}
              >
                About
              </li>
            </ul>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4 sm:order-3">
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

      {/* Extra Box */}
      <ExtraBox isVisible={isMenuOpen} onClose={toggleMenu} />

      {/* Shopping Cart */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
      />
    </>
  );
};

export default Navbar;
