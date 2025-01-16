import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
import { MdHome, MdShoppingBag } from "react-icons/md";
import { FaCircleInfo } from "react-icons/fa6";

interface ExtraBoxProps {
  isVisible: boolean;
  onClose: () => void;
}

const ExtraBox: React.FC<ExtraBoxProps> = ({ isVisible, onClose }) => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div
      className={`extra-box ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } fixed top-0 left-0 w-[60vw] h-full bg-white text-black shadow-lg transition-transform duration-500 z-50`}
    >
      <div
        className="absolute top-4 right-4 cursor-pointer"
        onClick={onClose}
      >
        <AiOutlineClose size={24} />
      </div>

      <div className="flex flex-col gap-4 mt-16 px-6">
        <span
          className="cursor-pointer hover:bg-gray-200 p-3 rounded flex items-center"
          onClick={() => navigateTo("/")}
        >
          <MdHome className="mr-1 text-xl"/>
          Home
        </span>
        <span
          className="cursor-pointer hover:bg-gray-200 p-3 rounded flex items-center"
          onClick={() => navigateTo("/products-page")}
        >
          <MdShoppingBag className="mr-1 text-xl"/>
          Products
        </span>
        <span
          className="cursor-pointer hover:bg-gray-200 p-3 rounded flex items-center"
          onClick={() => navigateTo("/about-page")}
        >
          <FaCircleInfo className="mr-1 text-xl"/>
          About
        </span>
      </div>
    </div>
  );
};

export default ExtraBox;
