import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaCartShopping, FaBars } from "react-icons/fa6";
import { MdAccountBox } from "react-icons/md";
import { RiLoginBoxFill, RiLogoutBoxFill } from "react-icons/ri";
import ShoppingCart from "../shopping-cart";
import ExtraBox from "../extra-box";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";

const Navbar: React.FC = () => {
  const user = useAuth();
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const router = useRouter();

  const user_id = Number(user?.id);

  useEffect(() => {
    const token = Cookies.get("access_token");
    setAccessToken(token);
  }, []);

  const handleLoginClick = () => {
    router.push("/auth/login-page");
  };

  const handleProfileClick = () => {
    router.push("/user/profile-editor");
  };

  const handleLogoutClick = () => {
    Cookies.remove("access_token");
    setAccessToken(undefined);
    window.location.href = "/";
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
          <div className="flex items-center justify-between sm:w-auto w-full">
            <div className="sm:hidden">
              <FaBars
                className="text-black text-3xl cursor-pointer"
                onClick={toggleMenu}
              />
            </div>
            <div className="hidden sm:flex font-bold text-2xl text-black hover:cursor-pointer hover:text-muted-foreground"
            onClick={() => navigateTo("/")}
            >
              FRUGMART
            </div>
            <div className="sm:hidden flex w-full justify-center items-center hover:cursor-pointer">
              <div className="text-black font-bold text-2xl hover:text-muted-foreground"
              onClick={() => navigateTo("/")}
              >
                FRUGMART
              </div>
            </div>
          </div>

          <div className="sm:flex flex-grow justify-center sm:order-2 hidden">
            <ul className="flex space-x-8 list-none items-center">
              <li
                className="text-black cursor-pointer hover:underline"
                onClick={() => navigateTo("/")}
              >
                Home
              </li>
              <li
                className="text-black cursor-pointer hover:underline"
                onClick={() => navigateTo("/products-page")}
              >
                Products
              </li>
              <li
                className="text-black cursor-pointer hover:underline"
                onClick={() => navigateTo("/about-page")}
              >
                About
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-4 sm:order-3">
            {accessToken ? (
              <>
                <FaCartShopping
                  className="text-black text-3xl cursor-pointer hover:text-muted-foreground"
                  onClick={toggleCart}
                  title="Cart"
                />
                <MdAccountBox
                  className="text-black text-3xl cursor-pointer hover:text-muted-foreground"
                  onClick={handleProfileClick}
                  title="Profile"
                />
                <RiLogoutBoxFill
                  className="text-black text-3xl cursor-pointer hover:text-muted-foreground"
                  onClick={handleLogoutClick}
                  title="Logout"
                />
              </>
            ) : (
              <RiLoginBoxFill
                className="text-black text-3xl cursor-pointer hover:text-muted-foreground"
                onClick={handleLoginClick}
                title="Login"
              />
            )}
          </div>
        </div>
      </nav>

      <ExtraBox isVisible={isMenuOpen} onClose={toggleMenu} />

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        user_id={user_id}
      />
    </>
  );
};

export default Navbar;
